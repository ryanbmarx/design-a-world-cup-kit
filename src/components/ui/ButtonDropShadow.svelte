<script>
	let clazz = "";
	export { clazz as class };
	export let id = null;
	export let muted = null;
	export let active = null;
	export let ariaLabel = null;
	export let disabled = null;
</script>

<style>
	.button-drop-shadow {
		position: relative;

		display: flex;
		align-items: center;
		gap: 0.5rem;

		font: var(--font-size) / 1.3em var(--fonts-sans-serif);
		border: none;
		background: white;
		padding: 0.5rem 1rem;
		box-sizing: border-box;
		cursor: pointer;

		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.56);
		transition: transform var(--speed-transition) ease-in-out,
			opacity var(--speed-transition) ease-in-out,
			box-shadow var(--speed-transition) ease-in-out;
	}

	.button-drop-shadow:hover {
		transform: translate(1px, 1px);
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
		opacity: 1;
	}

	.muted {
		opacity: 0.5;
	}

	.active,
	.active:hover {
		transform: translate(3px, 3px);
		box-shadow: 1px 1px 0 rgba(0, 0, 0, 1);
		opacity: 1;
		background-color: var(--color-accent);
		color: var(--color-accent-text);
	}

	.button-drop-shadow::after {
		content: "";
		display: block;
		height: 0.6em;
		width: max(2rem, 50%);
		background-color: var(--color-accent);
		position: absolute;
		bottom: 0;
		left: 50%;
		clip-path: polygon(0 0, 100% 0, 50% 100%);
		opacity: 0;
		transform: translate(-50%, 0);

		/* A little longer on the translate to make it smoother */
		transition: transform calc(var(--speed-transition) * 2) ease-in-out,
			opacity var(--speed-transition) ease-in-out;
	}

	.active::after {
		opacity: 1;
		transform: translate(-50%, calc(100% + 0.5em));
	}
</style>

<button
	aria-label={ariaLabel}
	{id}
	{disabled}
	class:active
	class:muted
	class="button-drop-shadow {clazz}"
	on:click>
	<slot />
</button>
