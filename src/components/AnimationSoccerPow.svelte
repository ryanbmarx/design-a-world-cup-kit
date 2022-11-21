<script>
	import { urlFor, base } from "../utils/links";

	export let animate = false;
	export let duration = false;
	export let visible = false;

	const { ASSET_PATH } = base();
</script>

<style>
	.icon,
	.ball {
		display: block;
		height: 4rem;
		width: 4rem;
		position: relative;
	}
	.icon {
		opacity: 0;
		display: none;
		z-index: 1000000;
		transition: opacity var(--speed-transition) ease-out;
	}

	.icon--ball {
		position: relative;
		transform: translate(0, 0) scale(1.5);
		shape-outside: circle();
		margin: 0 2rem 0 0;
	}

	.icon.visible {
		opacity: 1;
		display: block;
	}

	.icon > svg {
		position: absolute;
		top: 0;
		left: 0;

		height: 100%;
		width: 100%;
	}
	.ball {
		background-color: white;
	}
	.pow {
		transform: scale(0.8);
	}

	.pow--3 {
		fill: yellow;
		animation-delay: 75ms;
	}
	.pow--2 {
		fill: maroon;
		animation-delay: 35ms;
	}
	.pow--1 {
		fill: orange;
	}

	.ball {
		border-radius: 50%;
		border: 1px solid black;
		background: white;
		position: relative;
		clip-path: circle();
	}
	.ball::before {
		/* 3D gradient */
		border-radius: inherit;
		content: "";
		display: block;
		background: #000 radial-gradient(circle at 10% 20%, #fff, #555);
		mix-blend-mode: multiply;
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.ball::after {
		/* Ball shadow */
		content: "";
		display: block;
		height: 0.75rem;
		width: 80%;
		background: #222;
		opacity: 0.6;
		border-radius: inherit;
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translate(-50%, -0.5rem);
		z-index: -1;
		filter: blur(5px);
	}

	.ball__inner {
		display: block;
		overflow: hidden;
		border-radius: inherit;
		height: 100%;
		width: 100%;
	}
	.ball__pattern {
		display: block;
		aspect-ratio: 600 / 281;
		height: 200%;
		transform: translate(-65%, -39%) rotate(-9deg);
		animation: spin 55s infinite;
	}

	@media all and (prefers-reduced-motion: no-preference) {
		.ball__pattern {
			animation: spin 55s infinite;
		}
		.animate .ball__pattern {
			animation: spin 1s infinite;
		}

		.animate .pow {
			animation: pop 100ms ease-out 1 forwards;
		}

		/* ANIMATION STATE ----------------- */
		.animate .ball {
			/* animation: name duration timing-function delay iteration-count direction fill-mode; */
			animation: ballKick var(--duration) ease-in 1;
			animation-fill-mode: forwards;
			animation-delay: 25ms;
		}
	}

	@keyframes spin {
		from {
			transform: translate(-18%, -50%) rotate(-9deg) scale(0.65);
		}
		to {
			transform: translate(-65%, -59%) rotate(-9deg) scale(0.65);
		}
	}

	@keyframes pop {
		from {
			transform: scale(0.8);
		}

		85% {
			opacity: 1;
		}

		to {
			transform: scale(4);
			opacity: 0;
		}
	}

	@keyframes ballKick {
		0% {
			transform: translate(0, 0) scale(1);
		}
		65% {
			transform: translate(65vw, 0) scale(40);
		}

		95% {
			transform: translate(40vw, 0) scale(50);
			opacity: 1;
		}
		100% {
			transform: translate(-100vw, 0) scale(50);
			opacity: 0;
		}
	}
</style>

<span
	class="icon icon--ball"
	class:animate
	style:--duration="{duration}ms"
	class:visible>
	<svg class="pow pow--1">
		<title>A cartoon explosion "pow" shape</title>
		<use href="#pow" />
	</svg>
	<svg class="pow pow--2">
		<title>A cartoon explosion "pow" shape</title>
		<use href="#pow" />
	</svg>
	<svg class="pow pow--3">
		<title>A cartoon explosion "pow" shape</title>
		<use href="#pow" />
	</svg>
	<span class="ball">
		<span class="ball__inner">
			<span class="ball__pattern">
				<img src={urlFor("soccer-pattern.png", ASSET_PATH)} alt="" /></span>
			<!-- <svg class="ball__pattern">
				<title>A soccer ball pattern</title>
				<use href="#soccer-pattern" />
			</svg> -->
		</span>
	</span>
</span>
