<script>
	import throttle from "lodash.throttle";
	import { fireEvent } from "../utils/analytics";
	import { onMount } from "svelte";
	export let disabled = true;

	export let activeClothes;
	export let person;
	export let isPatternColor = false;
	let value = disabled ? null : "#000000";

	const swatches = ["#ff0000", "#ffffff", "#009bff", "#000", "#ff0", "#f80"];

	// Analytics stuff
	const category = "content";
	const action = "design-a-kit customization";

	let throttledFireEvent = fireEvent;
	onMount(() => {
		throttledFireEvent = throttle(fireEvent, 500, { leading: true });
	});
</script>

<style>
	.custom__wrapper {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 0.5rem;
		position: relative;
	}

	.custom__text {
		text-align: right;
		font: bold var(--font-size-small) / 1em var(--fonts-sans-serif);
		color: var(--color-font);
		padding: 0.5em;
	}

	.custom__color {
		display: block;
		width: calc(2 * var(--touch-target));
		height: 2rem;
		border: 3px solid black;
		background-color: var(--color, var(--grey-medium));
	}
	.custom__input {
		appearance: none;
		position: absolute;
		bottom: 0;
		right: 0;
		clip-path: polygon(0 0, 1px 1px, 0 0);
		display: block;
		border: none;
		height: var(--touch-target);
		min-width: var(--touch-target);
		width: 100%;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}

	/* DISABLED -------- */

	.disabled .custom__text {
		color: var(--grey-medium);
	}
</style>

<ul class="swatches" class:disabled>
	{#each swatches as color}
		<li>
			<button
				on:click={e => {
					person.changeColor(activeClothes, color, isPatternColor);
					fireEvent({
						category,
						action,
						label: `${activeClothes} changed color to ${color}`,
					});
				}}
				{disabled}
				class="swatch"
				aria-label="Select the color {color}"
				style:--color-background={color} />
		</li>
	{/each}
</ul>

<label class="custom__wrapper" class:disabled>
	<span class="custom__text">Choose your own</span>
	<span class="custom__color" style:--color={value} aria-hidden="true" />
	<input
		class="custom__input"
		class:disabled
		type="color"
		{disabled}
		bind:value
		on:input={e => {
			person.changeColor(activeClothes, e.target.value, isPatternColor);
			throttledFireEvent({
				category,
				action,
				label: `${activeClothes} changed color to custom color: ${e.target.value}`,
			});
		}} />
</label>
