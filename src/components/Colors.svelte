<script>
	import { fly } from "svelte/transition";
	import { activeClothes } from "../stores.js";
	import { fireEvent } from "../utils/analytics.js";
	import throttle from "lodash.throttle";
	import { getContext } from "svelte";

	import PickerPattern from "./PickerPattern.svelte";
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";
	import PickerColor from "./PickerColor.svelte";
	import { onMount } from "svelte";

	export let label_clothes = "Select an item of clothing";
	export let label_color_1;
	export let label_color_2;
	export let label_pattern;

	export let person;

	let colorTransition = { y: 50, duration: 150 };
	let patternSelected = false;
	let patternPicker;

	// Analytics stuff
	const category = "content";
	const action = "design-a-kit customization";
	let throttledFireEvent = fireEvent;

	// Clothes
	const clothes = {
		jersey: {
			label: "Jersey",
			hasPatterns: true,
			patternSelected: false,
		},
		shorts: {
			label: "Shorts",
			hasPatterns: true,
			patternSelected: false,
		},
		socks: {
			label: "Socks",
			hasPatterns: true,
			patternSelected: false,
		},
	};

	const { isMobile } = getContext("design-a-kit");

	$: showPattern = clothes?.[$activeClothes]?.hasPatterns ?? false;

	onMount(() => {
		throttledFireEvent = throttle(fireEvent, 500, { leading: true });
	});
</script>

<style>
	.clothes {
		display: grid;
		gap: var(--gap);
		grid-template-columns: repeat(3, minmax(1px, 1fr));
		grid-auto-flow: row;
		margin-bottom: calc(3 * var(--gap));
	}
	.clothes .label {
		grid-column: 1/-1;
	}

	.colors > :global(*:not(:last-child)) {
		margin: 0 0 var(--gap) 0;
	}

	/* BUTTONS */
	.clothes :global(.clothes__btn) {
		text-align: center;
		align-items: center;
		flex-flow: column nowrap;
		padding: 0.5rem;
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
	@media all and (min-width: 1024px) {
		.clothes {
			margin-bottom: calc(var(--gap) * 2);
		}
	}
</style>

<div class="clothes">
	<h2 class="label">
		{label_clothes}
		{$isMobile}
	</h2>
	{#each Object.entries(clothes) as [id, { label, hasPatterns = false }]}
		<ButtonDropShadow
			class="clothes__btn"
			active={id === $activeClothes}
			on:click={e => {
				throttledFireEvent({ category, action, label: `clothing item picked: ${id}` });
				$activeClothes = id;
				showPattern = hasPatterns;
				if ($isMobile) {
					person.setCamera(id);
				}
			}}
			{id}>
			<span class="icon">
				<svg><use href="#{id}" /></svg>
			</span>
			{label}
		</ButtonDropShadow>
	{/each}
</div>
<div class="colors">
	<h2 class:disabled={!$activeClothes} class="label">
		{label_color_1}
	</h2>
	<PickerColor
		disabled={!activeClothes}
		activeClothes={$activeClothes}
		{person}
		isPatternColor={false} />
	<h2
		class="label"
		class:disabled={!$activeClothes || !showPattern}
		transition:fly={colorTransition}>
		{label_pattern}
	</h2>
	<PickerPattern
		isPatternColor={false}
		disabled={!$activeClothes || !showPattern}
		{colorTransition}
		{person}
		activeClothes={$activeClothes}
		bind:this={patternPicker}
		onClick={() => {
			clothes[$activeClothes].patternSelected = patternPicker.selectedPattern;
		}} />
	<h2
		class="label"
		class:disabled={!$activeClothes || !showPattern || !patternSelected}
		transition:fly={colorTransition}>
		{label_color_2}
	</h2>
	<PickerColor
		isPatternColor={true}
		disabled={!$activeClothes ||
			!showPattern ||
			!clothes?.[$activeClothes]?.patternSelected}
		{person}
		{colorTransition}
		activeClothes={$activeClothes} />
</div>
