<script>
	import { fly } from "svelte/transition";
	import { base, urlFor } from "../utils/links.js";
	import { fireEvent } from "../utils/analytics";
	export let disabled = true;
	export let colorTransition;
	export let activeClothes;
	export let person;

	export let selectedPattern = null;
	export let onClick = () => {};

	const { ASSET_PATH } = base();
	const patterns = {
		none: {
			shorts: true,
			jersey: true,
			socks: true,
			label: "No pattern",
		},
		diagonal_split: {
			shorts: true,
			jersey: true,
			socks: true,
			label: "Diagonal Split",
		},
		diagonal_grad: {
			shorts: false,
			jersey: false,
			socks: true,
			label: "Diagonal Grad",
		},
		diagonal_half_grad: {
			shorts: true,
			jersey: false,
			socks: false,
			label: "Diagonal Half Grad",
		},
		double_chevron: {
			shorts: true,
			jersey: true,
			socks: true,
			label: "Double Chevron",
		},
		flames: { shorts: true, jersey: true, socks: true, label: "Flames" },
		flowers: { shorts: true, jersey: true, socks: true, label: "Flowers" },
		hashes: { shorts: true, jersey: true, socks: true, label: "Flowers" },
		horizontal_half: {
			shorts: true,
			jersey: true,
			socks: false,
			label: "Horizontal Half",
		},
		horizontal_grad: {
			shorts: false,
			jersey: false,
			socks: true,
			label: "Horizontal Grad",
		},
		horizontal_split: {
			shorts: false,
			jersey: false,
			socks: true,
			label: "Horizontal Split",
		},
		horizontal_half_grad: {
			shorts: true,
			jersey: false,
			socks: false,
			label: "Horizontal Half Grad",
		},
		horizontal_mid_grad: {
			shorts: false,
			jersey: true,
			socks: false,
			label: "Horizontal Mid Grad",
		},
		polkadots: { shorts: true, jersey: true, socks: true, label: "Polka Dots" },
		scales: { shorts: true, jersey: true, socks: false, label: "Scales" },
		side_stripe: { shorts: true, jersey: false, socks: false, label: "Side Stripe" },
		stripe_grad: { shorts: true, jersey: false, socks: false, label: "Stripe Grad" },
		single_vertical_line: {
			shorts: false,
			jersey: true,
			socks: false,
			label: "Single Vertical Line",
		},
		tiger_stripes: { shorts: true, jersey: true, socks: false, label: "Tiger Stripes" },
		vertical_grad: {
			shorts: false,
			jersey: true,
			socks: false,
			label: "Vertical Grad",
		},
		vertical_half: {
			shorts: false,
			jersey: true,
			socks: false,
			label: "Vertical Half",
		},
		vertical_half_grad: {
			shorts: true,
			jersey: false,
			socks: false,
			label: "Vertical Half Grad",
		},
		vertical_mid_grad: {
			shorts: false,
			jersey: true,
			socks: false,
			label: "Vertical Mid Grad",
		},
		vertical_split: {
			shorts: true,
			jersey: false,
			socks: true,
			label: "Vertical Split",
		},
		vertical_stripes: {
			shorts: true,
			jersey: true,
			socks: true,
			label: "Vertical Stripes",
		},
	};

	$: patternsToUse = disabled
		? Object.entries(patterns)
		: Object.entries(patterns).filter(([_, pattern]) => pattern[activeClothes]);
</script>

<style>
	.swatch {
		background-color: var(--grey-medium);
	}
</style>

<svelte:options accessors />

<ul class="swatches" class:disabled transition:fly={colorTransition}>
	{#each patternsToUse as [patternID, { label }]}
		<li>
			<button
				aria-label="Select the {label} pattern"
				class="swatch"
				on:click={e => {
					if (patternID === "none") {
						selectedPattern = null;
					} else {
						selectedPattern = patternID;
					}
					person.changePattern(activeClothes, patternID);
					onClick();
					fireEvent({
						category: "content",
						action: "design-a-kit customization",
						label: `${activeClothes} pattern changed to ${patternID}`,
					});
				}}
				{disabled}>
				<span
					class="swatch__inner"
					style:background-image="url({urlFor(
						`thumbnails/patterns/${patternID}.jpg`,
						ASSET_PATH
					)})" /></button>
		</li>
	{/each}
</ul>
