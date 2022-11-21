<script>
	import { onMount } from "svelte";
	import { fireEvent } from "../utils/analytics.js";
	import { base, urlFor } from "../utils/links.js";

	export let label_patch;
	export let person;

	let dpr = 2;
	const { ASSET_PATH } = base();
	const patches = [
		"none",
		"badge_a",
		"badge_b",
		"circle",
		"diamond",
		"shield_a",
		"shield_b",
		"shield_c",
		"shield_d",
		"shield_e",
		"square",
	];
	onMount(() => {
		dpr = window.devicePixelRatio;
	});
</script>

<style>
	.swatch,
	.swatch__inner {
		border: none;
		background-color: transparent;
		background-color: transparent;
		background-size: contain;
	}

	:global(.patch--none) .swatch__inner {
		border-radius: 50%;
		width: 87%;
		height: 87%;
		border: 1px solid black;
	}
</style>

<h2 class="label">{label_patch}</h2>
<ul class="swatches">
	{#each patches as patch}
		<li class="patch patch--{patch}">
			<button
				class="swatch"
				aria-label="Select patch style TKTKTK"
				on:click={e => {
					fireEvent({
						category: "content",
						action: "design-a-kit customization",
						label: `Jersey patch changed to ${patch}`,
					});
					if (patch === "none") {
						person.changePatch(null);
					} else {
						person.changePatch(patch);
					}
				}}>
				<span
					class="swatch__inner"
					style:background-image="url({urlFor(
						`thumbnails/patches/${patch}.png?width=100&dpr=${dpr}`,
						ASSET_PATH
					)})" />
			</button>
		</li>
	{/each}
</ul>
