<script>
	import { fade } from "svelte/transition";
	import X from "./icons/X.svelte";
	export let label = "Done";
	export let sticky = false;
	export let visible = false;
</script>

<style>
	.x {
		position: absolute;
		top: 1rem;
		right: 0;

		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		justify-content: end;
		cursor: pointer;
		color: var(--grey-very-light);
		background-color: transparent;
		border: none;

		opacity: 0.7;
		transform: scale(0.85);
		transition: opacity var(--speed-transition) ease-in-out,
			transform var(--speed-transition) ease-in-out;
	}

	.x.sticky {
		position: sticky;
		top: calc(-1 * var(--gap));
		top: 0;
		margin: 0 0 0 auto;
		background-color: var(--color-background);
		padding: 0.25rem 0.5rem;
		opacity: 0.85;
		z-index: 1000;
	}

	.x:focus {
		outline: 2px solid var(--color-accent);
	}

	.x:hover {
		opacity: 1;
		transform: scale(0.9);
	}
	.x__label {
		text-transform: uppercase;
		font: bold var(--font-size-small) / 1em var(--fonts-sans-serif);
		color: currentColor;
	}

	.x__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		justify-content: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		height: var(--touch-target);
		width: var(--touch-target);
	}
	.x :global(svg) {
		height: 58%;
		width: 58%;
		color: currentColor;
	}
</style>

{#if visible}
	<button transition:fade={{ duration: 70 }} class="x" on:click class:sticky>
		<span class="x__label">{label}</span>
		<span class="x__icon"><X /></span>
	</button>
{/if}
