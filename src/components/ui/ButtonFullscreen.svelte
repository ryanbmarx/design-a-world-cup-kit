<script>
	import Chevron from "./icons/Chevron.svelte";

	export let fullscreen = false;

	$: label = fullscreen
		? "Tap to exit player fullscreen mode"
		: "Tap to enter player fullscreen mode ";
</script>

<style>
	.fullscreen {
		--fullscreen-rotate: -5.2deg;
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

		transform-origin: top right;
		transform: rotate(var(--fullscreen-rotate)) translate(0, -50%);
	}

	.fullscreen::before {
		/* THE WHITE BAR */
		content: "";
		display: block;
		height: 7px;
		width: 150%;
		background-color: white;

		position: absolute;
		top: 50%;
		left: 0;
		/* Fudging the translate a little bit so it visualy aligns better with the other rotated things */
		transform: translate(-5%, -30%);
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

		transform-origin: top left;
		transform: rotate(calc(var(--fullscreen-rotate) * -1));
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

	@media all and (min-width: 375px) {
		.fullscreen {
			--fullscreen-rotate: -4.2deg;
		}
	}

	@media all and (min-width: 450px) {
		.fullscreen {
			--fullscreen-rotate: -3.5deg;
		}
	}
	@media all and (min-width: 550px) {
		.fullscreen {
			--fullscreen-rotate: -2.8deg;
		}
	}
	@media all and (min-width: 680px) {
		.fullscreen {
			--fullscreen-rotate: -2.3deg;
		}
	}
	@media all and (min-width: 750px) {
		.fullscreen {
			--fullscreen-rotate: -2.1deg;
		}
	}
	@media all and (min-width: 908px) {
		.fullscreen {
			--fullscreen-rotate: -1.7deg;
		}
	}
	@media all and (min-width: 1024px) {
		.fullscreen {
			display: none;
		}
	}
</style>

<button class="fullscreen" on:click aria-label={label}>
	<div class:flip={fullscreen} class="fullscreen__btn">
		<span class="fullscreen__inner">
			<Chevron />
		</span>
	</div>
</button>
