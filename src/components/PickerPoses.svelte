<script>
	import { onMount } from "svelte";
	import { fireEvent } from "../utils/analytics.js";
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";

	export let label_pose;
	export let person;

	let dpr = 2;
	const poses = {
		Idle2: "Standing",
		Idle: "Ready for action",
		legup: "Leg up",
		orc: "Defense is ready",
		// ready: "Ready?",
		// stall: "Stall?",
		GoalkeeperIdle: "Goal Keeper",
		OffensiveIdle: "Shake it off",
		// StallSoccerball: "The Stall",
		WarriorIdle: "Warrior",
		DancingRunningMan: "Running Man",
	};
	export let activePose = "Idle2";
	let visible = { first: false, last: false };
	let list;
	let posesContainer;
	let scrollIncrement = 250;

	onMount(() => {
		dpr = window.devicePixelRatio;
		scrollIncrement = posesContainer.offsetWidth * 0.95;
	});

	function watchForBtn(element, value) {
		if (typeof window !== "undefined" && window.IntersectionObserver && element) {
			const observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						// set the src attribute and bail
						if (entry.isIntersecting) {
							visible[value] = true;
						} else {
							visible[value] = false;
						}
					});
				},
				{
					rootMargin: "0px 0px 0px 0px",
				}
			);
			observer.observe(element);
		}
	}

	function initBtn(node) {
		const { index = null } = node.dataset;
		if (index === "0") {
			watchForBtn(node, "first");
		} else if (parseInt(index) + 1 === Object.values(poses).length) {
			watchForBtn(node, "last");
		}
	}

	function handleBack(e) {
		posesContainer.scrollLeft -= scrollIncrement;
		fireEvent({
			category: "nav",
			action: "design-a-kit poses cycled",
			label: "poses back",
		});
	}
	function handleFwd(e) {
		posesContainer.scrollLeft += scrollIncrement;
		fireEvent({
			category: "nav",
			action: "design-a-kit poses cycled",
			label: "poses forward",
		});
	}
</script>

<style>
	.carousel {
		--btn-width: 1rem;
		position: relative;
		margin: 0 0 var(--gap) 0;
	}

	@supports (scroll-snap-align: start) {
		.carousel__inner {
			scroll-snap-type: x mandatory;
		}

		.pose {
			scroll-snap-align: start;
		}
	}
	.poses {
		list-style: none;
		margin: var(--gap) 0;
		padding: 0;
		width: 100%;

		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
		gap: 0.5rem;
	}

	.pose {
		flex: 1 1 6.5rem;
		min-width: 6.5rem;
	}

	.pose :global(.pose__btn) {
		flex-flow: column nowrap;
		width: 100%;
		height: 100%;
	}

	.pose :global(.pose__btn::after) {
		content: none;
	}

	.icon {
		display: block;
		margin: 0 0 auto 0;
		height: 3rem;
		width: 3rem;
	}

	.icon :global(svg) {
		stroke: black;
		width: 100%;
		height: 100%;
	}

	:global(.active) .icon :global(svg) {
		stroke: var(--color-accent-text);
	}

	.btn {
		display: none;
		position: relative;
		border: none;
		background: none;
		padding: 0;
		cursor: pointer;
		transition: transform var(--speed-transition), opacity var(--speed-transition);
		opacity: 0.5;
	}

	.carousel:hover .btn {
		opacity: 1;
	}

	.btn::after {
		content: "";
		background-color: var(--color-accent);
		height: 56%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 22%;
		transition: opacity var(--speed-transition) ease-in-out,
			background-color var(--speed-transition) ease-in-out;
		clip-path: polygon(100% 0, 100% 100%, 0 50%);
	}

	.btn--fwd::after {
		clip-path: polygon(0 0, 100% 50%, 0 100%);
	}

	.btn[disabled] {
		cursor: not-allowed;
	}
	.btn[disabled]::after {
		opacity: 0.1;
		background-color: #fff;
	}

	@media all and (min-width: 1024px) {
		.carousel {
			display: block;
		}
		.carousel__inner {
			overflow-x: scroll;
			overflow-y: hidden;
			scroll-behavior: smooth;
		}

		.poses {
			width: fit-content;
			margin: 0;
			grid-auto-flow: column;
		}

		.btn {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: var(--btn-width);
			transform: translate(calc(-100% - 0.5rem), 0);
			margin: 0 0 0 0.25rem;
		}

		.btn--fwd {
			left: 100%;
			transform: translate(0.5rem, 0);
			margin: 0 0.25rem 0 0;
		}
	}
</style>

<h2 class="label">{label_pose}</h2>
<div class="carousel">
	<button
		on:click={handleBack}
		disabled={visible.first}
		class="btn btn--back"
		aria-label="Press to move backwards in the list of poses" />
	<div class="carousel__inner" bind:this={posesContainer}>
		<ul class="poses" bind:this={list}>
			{#each Object.entries(poses) as [id, label], index (id)}
				<li class="pose pose--{id}" data-index={index} use:initBtn>
					<ButtonDropShadow
						active={activePose === id}
						aria-label="Select the {label} pose"
						class="pose__btn"
						on:click={e => {
							activePose = id;
							person.changePose(id);
							fireEvent({
								category: "content",
								action: "design-a-kit customization",
								label: `pose changed to ${id}`,
							});
						}}>
						<span class="icon">
							<svg><use href="#poses-{id.toLowerCase()}" /></svg>
						</span>
						<span class="pose__label">{label}</span>
					</ButtonDropShadow>
				</li>
			{/each}
		</ul>
	</div>
	<button
		on:click={handleFwd}
		disabled={visible.last}
		class="btn btn--fwd"
		aria-label="Press to move forwards in the list of poses" />
</div>
