<script>
	import Chevron from "./icons/Chevron.svelte";

	export let fullscreen = false;

	$: label = fullscreen
		? "Tap to exit player fullscreen mode"
		: "Tap to enter player fullscreen mode ";
</script>

<style>
	.fullscreen {
		position: absolute;
		bottom: var(--controls-height);
		left: 0%;

		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: var(--controls-triangle-height);
		transition: bottom var(--speed-transition) ease-in-out;
		background-color: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.fullscreen__btn {
		position: relative;
		z-index: 2;
		width: var(--touch-target);
		height: var(--touch-target);
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: inherit;
		padding: 0;
		margin: 0;
		border: none;

		background-color: transparent;
	}

	.fullscreen:focus .fullscreen__inner {
		outline: 2px solid var(--color-accent);
		border-color: var(--color-accent);
	}

	.fullscreen:hover .fullscreen__inner {
		border-color: var(--color-accent);
	}

	.fullscreen__inner {
		background-color: var(--color-background);
		border: 2px solid white;
		border-radius: 0.35rem;

		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.7rem;
		height: 1.7rem;
	}

	.fullscreen__btn :global(svg) {
		fill: var(--color-font);
		transform: rotate(90deg);
		transition: transform var(--speed-transition) ease-in-out;
		width: 75%;
		height: 75%;
	}

	.fullscreen__btn.flip :global(svg) {
		transform: rotate(-90deg);
	}

	.fullscreen__bar {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	@media all and (min-width: 1024px) {
		.fullscreen {
			display: none;
		}
	}
</style>

<button class="fullscreen" on:click aria-label={label}>
	<svg
		preserveAspectRatio="none"
		xmlns="http://www.w3.org/2000/svg"
		viewbox="0 0 1000 100"
		class="fullscreen__bar">
		<line x1="0" y1="90" x2="1000" y2="10" stroke="white" stroke-width="20" />
	</svg>
	<div class:flip={fullscreen} class="fullscreen__btn">
		<span class="fullscreen__inner">
			<Chevron />
		</span>
	</div>
</button>
