<script>
	import { fireEvent } from "../utils/analytics.js";
	import { mode } from "../stores.js";
	import ButtonDone from "./ui/ButtonDone.svelte";

	export let visible;
	export let id;

	const defaultControls = id === "default";

	function handleDone(e) {
		fireEvent({
			category: "nav",
			action: "design-a-kit controls",
			label: `${$mode} controls toggled off`,
		});
		$mode = null;
	}
</script>

<style>
	.controls {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
		padding: var(--gap);
		z-index: 1;
		transform: translate(0, 100%);

		height: 0;
		overflow-y: scroll;
		overflow-x: hidden;

		opacity: 0;
		transition: opacity var(--speed-transition) ease-out,
			height var(--speed-transition) ease-out,
			transform var(--speed-transition) ease-out;
	}

	.controls.default {
		padding-top: calc(3 * var(--gap));
	}

	.controls.visible {
		height: 100%;
		z-index: 2;
		opacity: 1;
		transform: translate(0, 0);
		transition-delay: calc(2 * var(--speed-transition));
	}

	@media all and (prefers-reduced-motion: reduced) {
		.controls {
			transition-duration: 1ms !important;
		}
	}
</style>

<div class="controls controls--{id}" class:visible class:default={defaultControls}>
	<ButtonDone on:click={handleDone} visible={!defaultControls} sticky={true} />
	<slot />
</div>
