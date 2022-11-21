<script>
	import { onMount } from "svelte";
	import { urlFor, base } from "../utils/links.js";
	import { fireEvent } from "../utils/analytics.js";
	import { loaded } from "../stores.js";
	import throttle from "lodash.throttle";
	import Chevron from "./ui/icons/Chevron.svelte";
	import TWEEN from "@tweenjs/tween.js";
	// THREE STUFF
	import { PatternColorCombiner } from "../utils/PatternColorCombiner.js";
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";

	export let activePose;
	let drawingCanvas;
	let renderer;
	let controls;
	let animationMixer;
	let clock;
	let modelReady = false;
	let sphericalTarget;
	let sportsPlusLogo;

	let fbxLoader;
	let currentAnimAction;
	let multiAnimationRunning = false;
	let currentSequenceIndex = 0;
	let currentAnimSequence;
	const multiAnimationData = {
		Idle: {
			sequence: ["Idle", "Idle2", "Idle2", "Idle2"],
		},
		StallSoccerball: {
			sequence: ["StallSoccerball", "Idle2", "Idle2", "Idle2"],
		},
	};
	let dpr = typeof window === "object" ? window.devicePixelRatio : 2;

	// combiners
	let shirtCombiner;
	let shortsCombiner;
	let socksCombiner;

	const { ASSET_PATH } = base();
	let scene, camera;

	const DURATION =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: no-preference)").matches
			? 2000
			: 0; // Rotation tween length
	const combinerObjects = new Map();
	const animationMap = new Map();
	const ZOOM_BOUNDS = {
		min: 5,
		max: 50,
	};

	const TARGETS = {
		default: {
			x: -3.7852016305966703,
			y: 3.334019015567383,
			z: 8.076302427311676,
			_x: -0.10290267663876553,
			_y: -0.436244534735959,
			_z: -0.04360682598596754,
		},
		poses: {
			x: -3.7852016305966703,
			y: 3.334019015567383,
			z: 8.076302427311676,
			_x: -0.10290267663876553,
			_y: -0.436244534735959,
			_z: -0.04360682598596754,
		},
		patch: {
			x: -1.4788782127315467,
			y: 4.932264722234711,
			z: 5.438795987266114,
			_x: -0.420528392405479,
			_y: -0.243304500360901,
			_z: -0.1073230407130285,
		},
		jersey: {
			x: -1.8278055375496118,
			y: 5.752307120566746,
			z: 3.32890752506192,
			_x: -0.7737594386593901,
			_y: -0.3742355628149845,
			_z: -0.3430296546003543,
		},
		colors: {
			// (Note: Same as jersey, which is default clothes)
			x: -1.8278055375496118,
			y: 5.752307120566746,
			z: 3.32890752506192,
			_x: -0.7737594386593901,
			_y: -0.3742355628149845,
			_z: -0.3430296546003543,
		},
		shorts: {
			x: -2.0666425737464067,
			y: 3.6337265376547987,
			z: 4.409495731962566,
			_x: -0.25165938408664495,
			_y: -0.42610641353265627,
			_z: -0.10587362771979433,
		},
		socks: {
			x: 0.448024845622189,
			y: 1.146166800389526,
			z: 5.654711571365331,
			_x: 0.23499351243033995,
			_y: 0.07690083322644387,
			_z: -0.018391139738082356,
		},
		number: {
			x: 3.1199673506969154,
			y: 6.871995220033177,
			z: -4.173356764300778,
			_x: -2.33295347094452,
			_y: 0.4765232595507327,
			_z: 2.693646205384094,
		},
	};
	// Analytics stuff
	const category = "nav";
	let throttledFireEvent = fireEvent;

	onMount(() => {
		throttledFireEvent = throttle(fireEvent, 500, { leading: true });
	});

	async function init(drawingCanvas) {
		const [THREE, { OrbitControls }, { FBXLoader }] = await Promise.all([
			import("three"),
			import("three/examples/jsm/controls/OrbitControls"),
			import("three/examples/jsm/loaders/FBXLoader"),
		]);
		sphericalTarget = new THREE.Spherical();
		sportsPlusLogo = new Image();
		sportsPlusLogo.crossOrigin = "Anonymous";
		sportsPlusLogo.src = urlFor("SPlus_Black.jpg", ASSET_PATH);

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			75,
			drawingCanvas.clientWidth / drawingCanvas.clientHeight,
			1,
			100
		);
		clock = new THREE.Clock();

		shirtCombiner = new PatternColorCombiner(
			urlFor("models/soccerPlayer/shirt.jpg", ASSET_PATH),
			THREE
		);
		shortsCombiner = new PatternColorCombiner(
			urlFor("models/soccerPlayer/shorts.jpg", ASSET_PATH),
			THREE
		);
		socksCombiner = new PatternColorCombiner(
			urlFor("models/soccerPlayer/socks.jpg", ASSET_PATH),
			THREE
		);

		combinerObjects.set("shirt", shirtCombiner);
		combinerObjects.set("shorts", shortsCombiner);
		combinerObjects.set("socks", socksCombiner);

		const playerKitModelURL = urlFor("models/soccerPlayer/T-Pose.fbx", ASSET_PATH);
		const playerModelPartImages = new Map([
			["shirt", urlFor("models/soccerPlayer/shirt.jpg", ASSET_PATH)],
			["shorts", urlFor("models/soccerPlayer/shorts.jpg", ASSET_PATH)],
			["socks", urlFor("models/soccerPlayer/socks.jpg", ASSET_PATH)],
			["shoes", urlFor("models/soccerPlayer/shoes.jpg", ASSET_PATH)],
			["skin", urlFor("models/soccerPlayer/skin.jpg", ASSET_PATH)],
		]);

		const groundModelURL = urlFor("models/ground/ground.fbx", ASSET_PATH);
		const groundModelPartImages = new Map([
			["ground", urlFor("models/ground/terrain_grass.png", ASSET_PATH)],
		]);

		camera.position.set(1, 8, 7);

		// Setup Renderer
		let useAntiAlias = window.devicePixelRatio <= 1;
		renderer = new THREE.WebGLRenderer({
			antialias: useAntiAlias,
			powerPreference: "high-performance",
			canvas: drawingCanvas,
			preserveDrawingBuffer: true,
		});
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		resize();

		// Orbit controls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.enablePan = false;
		controls.dampingFactor = 0.05;
		controls.minDistance = ZOOM_BOUNDS.min;
		controls.maxDistance = ZOOM_BOUNDS.max;
		controls.target.set(0, 2.5, 0);

		// Lights
		var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		let light = new THREE.DirectionalLight(0xffffff, 0.5);
		light.castShadow = true;
		light.shadow.bias = -0.0001; // Fixes shadow artifacts from faces too close together
		light.position.set(5, 10, 5);
		light.target.position.set(0, 0, 0);
		scene.add(light);
		scene.add(light.target);

		// Player Model
		const textureLoader = new THREE.TextureLoader();
		fbxLoader = new FBXLoader();
		fbxLoader.load(
			playerKitModelURL,
			model => {
				model.scale.set(0.1, 0.1, 0.1);

				// Use basic materials not influenced by lighting for speed
				model.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.castShadow = true;
						node.receiveShadow = true;
						if (playerModelPartImages.has(node.name)) {
							let imageFile = playerModelPartImages.get(node.name);
							node.material = new THREE.MeshPhongMaterial({
								map: textureLoader.load(imageFile, () => {
									// Setup material maps
									if (combinerObjects.has(node.name)) {
										combinerObjects.get(node.name).setMaterial(node.material);
									}
									render();
								}),
								skinning: true,
							});
						}
					}
				});

				scene.add(model);
				render();

				animationMixer = new THREE.AnimationMixer(model);
				// Multi chained animation listener
				animationMixer.addEventListener("loop", function (e) {
					if (multiAnimationRunning == false) return;
					playNextSequenceAnimation();
				});

				// Load idle animation
				changePose(activePose);
				modelReady = true;
			},
			xhr => {
				$loaded = (xhr.loaded / xhr.total) * 100;
			},
			error => {
				console.log(error);
			}
		);

		// Ground model
		fbxLoader.load(
			groundModelURL,
			model => {
				model.scale.set(0.1, 0.1, 0.1);

				// Use basic materials not influenced by lighting for speed
				model.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.receiveShadow = true;
						if (groundModelPartImages.has(node.name)) {
							let imageFile = groundModelPartImages.get(node.name);
							node.material = new THREE.MeshPhongMaterial({
								map: textureLoader.load(imageFile, () => {
									render();
								}),
								transparent: true,
							});
						}
					}
				});

				scene.add(model);
				render();
			},
			xhr => {
				$loaded = (xhr.loaded / xhr.total) * 100;
			},
			error => {
				console.log(error);
			}
		);

		resize();
		animate();
	}

	// A utility function that logs the camera values to rotate the thing around
	function outputCamera() {
		console.group("CAMERA");
		console.log({ "camera.postition": camera.position });
		console.log({ "camera.rotation": camera.rotation });
		console.log({
			"camera.position.distanceTo(controls.target)": camera.position.distanceTo(
				controls.target
			),
		});
		const { x, y, z } = camera.position;
		const { _x, _y, _z } = camera.rotation;
		console.log(`x:${x},y:${y},z:${z},_x:${_x},_y:${_y},_z:${_z}`);
		console.log("Scene polycount:", renderer.info.render.triangles);
		console.log("Active Drawcalls:", renderer.info.render.calls);
		console.log("Textures in Memory", renderer.info.memory.textures);
		console.log("Geometries in Memory", renderer.info.memory.geometries);
		console.groupEnd("CAMERA");
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		if (modelReady) {
			animationMixer.update(clock.getDelta());
		}
		TWEEN.update();
		render();
	}

	function render() {
		renderer.render(scene, camera);
	}

	// Re-renders the player to fit the given display space
	export const resize = () => {
		const canvas = renderer.domElement;
		const width = canvas.offsetWidth;
		const height = canvas.offsetHeight;
		// you must pass false here or three.js sadly fights the browser
		renderer.setSize(width, height, false);
		renderer.setPixelRatio(dpr);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	export async function changePattern(clothingItem = null, patternID = null) {
		const convertedClothingItem = clothingItem === "jersey" ? "shirt" : clothingItem;
		const combiner = combinerObjects.get(convertedClothingItem);
		const fileID = `${convertedClothingItem}_${patternID}`;
		if (patternID == "none") {
			combiner.updatePatternImage(null);
		} else {
			const newPatternImage = new Image();
			newPatternImage.crossOrigin = "Anonymous";
			newPatternImage.src = urlFor(
				"models/soccerPlayer/patterns/" + fileID + ".png",
				ASSET_PATH
			);
			newPatternImage.onload = function () {
				combiner.updatePatternImage(newPatternImage);
			};
		}
	}

	// Changes the color or pattern color of the selected clothing item
	export function changeColor(clothingItem = null, color = null, patternColor = false) {
		if (!clothingItem || !color) return;
		const convertedClothingItem = clothingItem === "jersey" ? "shirt" : clothingItem;
		if (patternColor) {
			console.log(`Changing the pattern color of ${clothingItem} to ${color}`);

			combinerObjects.get(convertedClothingItem).updatePatternColor(color);
		} else {
			console.log(`Changing the primary color of ${clothingItem} to ${color}`);

			combinerObjects.get(convertedClothingItem).updatePrimaryColor(color);
		}
	}

	// Changes the number displayed on the player's jersey
	export function changeNumber(jerseyNumber = null) {
		if (!jerseyNumber) return;
		console.log(`Changing the jersey number to ${jerseyNumber}`);
		shirtCombiner.updateNumber(jerseyNumber);
	}

	// Changes the patch displayed on the player
	export function changePatch(patchID = null) {
		console.log(`Changing the patch to ${patchID}`);
		if (patchID == null) {
			shirtCombiner.updatePatchImage(null);
		} else {
			const newPatchImage = new Image();
			newPatchImage.crossOrigin = "Anonymous";
			newPatchImage.src = urlFor("thumbnails/patches/" + patchID + ".png", ASSET_PATH);
			newPatchImage.onload = function () {
				shirtCombiner.updatePatchImage(newPatchImage);
			};
		}
	}

	export function changePose(poseID = null) {
		console.log(`Changing the pose to ${poseID}`);
		if (poseID == null) return;
		if (poseID in multiAnimationData) {
			console.log("This is a multi animation sequence");
			if (currentAnimAction) {
				currentAnimAction.fadeOut(1);
			}
			currentSequenceIndex = 0;
			currentAnimSequence = multiAnimationData[poseID].sequence;
			multiAnimationRunning = true;
			playNextSequenceAnimation();
		} else {
			multiAnimationRunning = false;
			playAnimation(poseID);
		}
	}

	function playNextSequenceAnimation() {
		let nextPoseID = currentAnimSequence[currentSequenceIndex];
		playAnimation(nextPoseID);
		currentSequenceIndex = (currentSequenceIndex + 1) % currentAnimSequence.length;
	}

	function playAnimation(poseID = null) {
		if (currentAnimAction && currentAnimAction == animationMap.get(poseID)) return;

		if (currentAnimAction) {
			currentAnimAction.fadeOut(1);
		}
		if (animationMap.has(poseID)) {
			var nextAnimAction = animationMap.get(poseID);
			nextAnimAction.enabled = true;
			nextAnimAction.reset();
			nextAnimAction.fadeIn(1);
			currentAnimAction = nextAnimAction;
		} else {
			loadAnimation(poseID, loadedAction => {
				loadedAction.fadeIn(1);
				loadedAction.play();
				currentAnimAction = loadedAction;
			});
		}
	}

	function loadAnimation(poseID, loadedAction) {
		const animURL = urlFor(
			"models/soccerPlayer/animations/" + poseID + ".fbx",
			ASSET_PATH
		);
		fbxLoader.load(
			animURL,
			animClip => {
				var action = animationMixer.clipAction(animClip.animations[0]);
				animationMap.set(poseID, action);
				loadedAction(action);
			},
			xhr => {
				$loaded = (xhr.loaded / xhr.total) * 100;
			},
			error => {
				console.log(error);
			}
		);
	}

	// Resets all features to default
	export function reset(e) {
		changePose("Idle");
		for (let combiner of combinerObjects.values()) {
			combiner.reset();
		}
		fireEvent({
			category: "content",
			action: "design-a-kit reset",
			label: "All choices reset",
		});
	}

	// Restores camera zoom and position to factory default
	export function resetCamera(e) {
		setCamera("default");
		fireEvent({
			category: "content",
			action: "design-a-kit reset",
			label: "Camera position reset",
		});
	}

	export function downloadPNG(e) {
		const shareWidth = 1024;
		const shareHeight = 1024;
		const padding = 50;
		const logoWidthHeight = 80;
		const logoOffset = 40;

		// Set up new canvas
		const sharingCanvas = document.createElement("canvas");
		sharingCanvas.width = shareWidth;
		sharingCanvas.height = shareHeight;
		sharingCanvas.crossOrigin = "Anonymous";
		const sharingContext = sharingCanvas.getContext("2d");
		sharingContext.crossOrigin = "Anonymous";

		// Draw the person image on it first
		const sourceWidth = drawingCanvas.height; // Use height for both width and height here
		const sourceHeight = drawingCanvas.height;
		const sourceX = drawingCanvas.width / 2 - sourceWidth / 2;
		const sourceY = drawingCanvas.height / 2 - sourceHeight / 2;

		// FIll in empty space with a plain square
		sharingContext.fillStyle = "#000000";
		sharingContext.fillRect(0, 0, shareWidth, shareHeight);

		sharingContext.drawImage(
			drawingCanvas,
			sourceX,
			sourceY,
			sourceWidth,
			sourceHeight,
			0,
			0,
			shareWidth,
			shareHeight
		);

		// Add URL in bottom left corner
		sharingContext.textAlign = "left";
		sharingContext.textBaseline = "middle";
		sharingContext.fillStyle = "#FFFFFF";
		sharingContext.font = "40px 'Bebas Neue', monospace";
		sharingContext.fillText(
			"usatoday.com/design-a-kit",
			padding,
			shareHeight - padding
		);

		// Add S+ logo in bottom right corner
		sharingContext.drawImage(
			sportsPlusLogo,
			shareWidth - logoWidthHeight - padding + logoOffset,
			shareHeight - logoWidthHeight - padding + logoOffset,
			logoWidthHeight,
			logoWidthHeight
		);

		// Download code
		const w = window.open("about:blank");
		w.document.title = "Your custom World Cup kit! | USA TODAY Sports+";
		const i = new Image();
		i.crossOrigin = "Anonymous";
		i.src = sharingCanvas.toDataURL();
		setTimeout(function () {
			w.document.write(i.outerHTML);
		}, 0);
	}

	function rotateUp() {
		throttledFireEvent({ category, action: "design-a-kit rotate", label: "rotate up" });
		const radMove = (20 * Math.PI) / 180.0;
		moveCamera(-radMove, 0);
	}

	function rotateDown() {
		throttledFireEvent({
			category,
			action: "design-a-kit rotate",
			label: "rotate down",
		});
		const radMove = (20 * Math.PI) / 180.0;
		moveCamera(radMove, 0);
	}

	function rotateLeft() {
		throttledFireEvent({
			category,
			action: "design-a-kit rotate",
			label: "rotate left",
		});
		const radMove = (20 * Math.PI) / 180.0;
		moveCamera(0, -radMove);
	}

	function rotateRight() {
		throttledFireEvent({
			category,
			action: "design-a-kit rotate",
			label: "rotate right",
		});
		const radMove = (20 * Math.PI) / 180.0;
		moveCamera(0, radMove);
	}

	function zoomOut() {
		throttledFireEvent({ category, action: "design-a-kit zoom", label: "zoom out" });
		doZoom(1);
	}

	function zoomIn() {
		throttledFireEvent({ category, action: "design-a-kit zoom", label: "zoom in" });
		doZoom(-1);
	}

	// Will move the camera around the person
	export function moveCamera(upMove, leftMove) {
		sphericalTarget.set(
			controls.getDistance(),
			controls.getPolarAngle(),
			controls.getAzimuthalAngle()
		);
		sphericalTarget.phi += upMove;
		sphericalTarget.theta += leftMove;
		sphericalTarget.makeSafe();
		camera.position.setFromSpherical(sphericalTarget);
		camera.position.add(controls.target);
		camera.lookAt(controls.target);
		render();
	}
	// Will move the camera around the person
	/**
	 *
	 * @param {object} options
	 * @param {integer} options.up The value, in degrees, of the desired polar angle
	 * @param {integer} options.left The value, in degrees, of the desired azimuth angle
	 * @param {integer} options.zoom The value, in {{TK units}}, of the desired camera radius distance. Remember, a smaller number is a shorter distance which means the camera is _closer._
	 */
	export function setCamera(t = "") {
		if (!(t in TARGETS)) return;
		const { x, y, z, _x, _y, _z } = TARGETS[t];

		const cameraTween = new TWEEN.Tween(camera.rotation)
			.to({ _x, _y, _z }, DURATION)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();

		const rotationTween = new TWEEN.Tween(camera.position)
			.to(
				{
					x,
					y,
					z,
				},
				DURATION
			)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();
	}

	function doZoom(zoomDirection) {
		let wheelEvent = new WheelEvent("wheel", {
			deltaY: zoomDirection,
			deltaMode: 1,
		});
		renderer.domElement.dispatchEvent(wheelEvent);
	}
</script>

<style>
	.person {
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.person__canvas {
		width: 100%;
		height: 100%;
		background-color: aqua;
	}

	.person__controls {
		display: none;
	}

	.person :global(.camera-reset) {
		position: absolute;
		top: var(--gap);
		left: var(--gap);
		font-size: var(--font-size-small);
		opacity: 0.5;
		transition: opacity var(--speed-transition);
	}
	.person :global(.camera-reset:hover) {
		opacity: 1;
	}

	.icon {
		display: block;
		height: 1.2rem;
		width: 1.2rem;
	}

	.icon svg {
		width: 100%;
		height: 100%;
	}
	:global(.camera-test) {
		position: fixed;
		top: 0%;
		left: 1rem;
	}
	@media all and (min-width: 1024px) {
		.person {
			clip-path: unset;
		}

		.person__controls {
			position: absolute;
			top: 0;
			right: 0;
			padding: var(--gap);

			display: grid;
			gap: 0.25rem;
			grid-template: repeat(3, minmax(1px, 1fr)) / repeat(5, minmax(1px, 1fr));
			width: 12rem;
			aspect-ratio: 5 / 3;
		}

		.person__controls__icon,
		.person__controls__btn {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			height: 100%;
			width: 100%;
			border: none;
			border-radius: 0;
			padding: 0;

			cursor: pointer;
		}

		.person__controls__btn {
			background-color: white;
		}

		.person__controls__icon svg {
			fill: white;
		}

		.person__controls__btn:hover {
			background-color: var(--grey-light);
		}
		.person__controls__btn:focus {
			outline: 2px solid var(--color-accent);
		}

		.person__controls__btn :global(svg) {
			width: 100%;
			height: 100%;
			fill: black;
		}
		.person__controls__btn :global(svg) {
			stroke-width: 2px;
			stroke: black;
			stroke-linejoin: round;
		}

		/* POSITIONING IN THE GRID */
		.person__controls__btn--up {
			grid-row: 1;
			grid-column: 2;
		}
		.person__controls__btn--down {
			grid-row: 3;
			grid-column: 2;
		}
		.person__controls__btn--right {
			grid-row: 2;
			grid-column: 3;
		}
		.person__controls__btn--left {
			grid-row: 2;
			grid-column: 1;
		}
		.person__controls__btn--out {
			grid-row: 1;
			grid-column: 5;
		}
		.person__controls__btn--in {
			grid-row: 3;
			grid-column: 5;
		}
		.person__controls__icon--zoom {
			grid-column: 5;
			grid-row: 2;
		}
		.person__controls__icon--pan {
			grid-column: 2;
			grid-row: 2;
		}

		/* TWEAKING THE ICONS */
		.person__controls__icon--pan svg {
			width: 90%;
		}
		.person__controls__icon--zoom svg {
			width: 70%;
			height: 100%;
		}
		.person__controls__btn--up :global(svg) {
			transform: rotate(-90deg);
		}
		.person__controls__btn--down :global(svg) {
			transform: rotate(90deg);
		}

		.person__controls__btn--left :global(svg) {
			transform: rotate(180deg);
		}

		.person__controls__btn--out :global(svg),
		.person__controls__btn--in :global(svg) {
			/* transform: rotate(-90deg); */
			width: 55%;
			height: 55%;
		}
	}
</style>

<svelte:options accessors />

<svelte:window on:resize={resize} />

<div class="person">
	<ButtonDropShadow class="camera-reset" on:click={resetCamera}>
		<span class="icon">
			<svg><use href="#reset" /></svg>
		</span>
		Reset zoom
	</ButtonDropShadow>
	<div class="person__controls">
		<button
			on:click={e => {
				rotateUp();
			}}
			class="person__controls__btn person__controls__btn--up"
			aria-label="Rotate the player up">
			<Chevron />
		</button>
		<button
			on:click={e => {
				rotateDown();
			}}
			class="person__controls__btn person__controls__btn--down"
			aria-label="Rotate the player down">
			<Chevron />
		</button>
		<button
			on:click={e => {
				rotateLeft();
			}}
			class="person__controls__btn person__controls__btn--left"
			aria-label="Rotate the player to the left">
			<Chevron />
		</button>
		<button
			on:click={e => {
				rotateRight();
			}}
			class="person__controls__btn person__controls__btn--right"
			aria-label="Rotate the player to the right">
			<Chevron />
		</button>
		<button
			on:click={e => {
				zoomOut();
			}}
			class="person__controls__btn person__controls__btn--out"
			aria-label="Zoom out">
			<svg><use href="#minus" /></svg>
		</button>
		<button
			on:click={e => {
				zoomIn();
			}}
			class="person__controls__btn person__controls__btn--in"
			aria-label="Zoom in">
			<svg><use href="#plus" /></svg>
		</button>
		<span class="person__controls__icon person__controls__icon--zoom">
			<svg>
				<title>Magnifying glass</title>
				<use href="#glass" />
			</svg>
		</span>
		<span class="person__controls__icon person__controls__icon--pan">
			<svg>
				<title>A circular arrow</title>
				<use href="#arrow-circle" />
			</svg>
		</span>
	</div>
	<canvas class="person__canvas" bind:this={drawingCanvas} id="canvas" use:init />
</div>
