<script>
	import { mode, activeClothes } from "../stores.js";
	import { fireEvent } from "../utils/analytics.js";
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";
	import DownloadShareReset from "./DownloadShareReset.svelte";

	export let label_choose;
	export let person = {};

	const buttons = {
		poses: {
			label: "Pose",
			icon: "poses",
		},
		colors: {
			label: "Colors",
			icon: "colors",
		},
		patch: {
			label: "Patch",
			icon: "patch",
		},
		number: {
			label: "Number",
			icon: "number",
		},
	};

	function handleModeSwitch(e, targetMode) {
		$mode = targetMode;
		if (targetMode === "colors") {
			person.setCamera($activeClothes);
		} else {
			person.setCamera(targetMode);
		}
		fireEvent({
			category: "nav",
			action: "design-a-kit controls",
			label: `${$mode} controls toggled on`,
		});
	}
</script>

<style>
	.controls {
		margin: 0;
		display: grid;
		gap: var(--gap);
		grid-template: auto repeat(2, minmax(1px, 1fr)) auto/ repeat(2, minmax(1px, 1fr));
	}
	.label {
		grid-column: 1/-1;
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3rem;
		width: 3rem;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
		stroke: black;
	}
</style>

<div class="controls controls--default">
	<h2 class="label">{label_choose}</h2>
	{#each Object.entries(buttons) as [mode, { label, icon, target }]}
		<ButtonDropShadow
			on:click={e => {
				handleModeSwitch(e, mode, target);
			}}>
			{#if icon}
				<span class="icon">
					<svg><use href="#{icon}" /></svg>
				</span>
			{/if}
			{label}
		</ButtonDropShadow>
	{/each}
	<DownloadShareReset />
</div>
