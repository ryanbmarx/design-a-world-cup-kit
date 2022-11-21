<script>
	import { onMount, setContext } from "svelte";
	import { mode, resetting, jerseyNumber, sharing, recirc } from "./stores.js";
	import * as analytics from "./utils/analytics.js";
	import { createMediaStore } from "./utils/media-store.js";

	// Pickers
	import Controls from "./components/Controls.svelte";
	import ControlsDefault from "./components/ControlsDefault.svelte";
	import Colors from "./components/Colors.svelte";
	import Patches from "./components/Patches.svelte";
	import Poses from "./components/PickerPoses.svelte";
	import Number from "./components/Number.svelte";

	// OTHER THINGS
	import Person from "./components/Person.svelte";
	import Recirculation from "./components/Recirculation.svelte";
	import ButtonFullscreen from "./components/ui/ButtonFullscreen.svelte";
	import DownloadShareReset from "./components/DownloadShareReset.svelte";
	import Modal from "./components/Modal.svelte";
	import Splash from "./components/Splash.svelte";
	import Sharing from "./components/Sharing.svelte";
	import Reset from "./components/Reset.svelte";

	// Top matter & page meta
	export let kicker;
	export let headline;
	export let intro;
	export let explanation_header;
	export let explanation;
	export let label_button_start;
	export let contributing;
	export let byline, organization, published, updated;
	export let presto_id;

	// Various labels and text bits
	export let label_clothes = "";
	export let label_color_1 = "";
	export let label_color_2 = "";
	export let label_pattern = "";
	export let label_jersey_number = "";
	export let label_jersey_number_instructions = "";
	export let label_patch = "";
	export let label_choose = "Customize your player";
	export let label_download;
	export let label_download_sublabel;
	export let label_share;
	export let label_pose = "";
	export let text_reset = "";
	export let label_recirculation = "More great World Cup content";
	export let label_share_recirc = "More great content!";
	export let label_share_recirc_btn = "Complete coverage";
	// Links
	export let recirculation = [];

	// let expand = false; // Controls take priority display
	let fullscreen = false; // Controls shrink away
	let person; // Ref for the instance of our 3D component
	let started = false; // Show the splash?

	// VH fix
	let vh = null;

	const isMobile = createMediaStore("(max-width: 1023px)", true);
	const transitionOut = { y: 250, duration: 150 };
	const transitionIn = { y: 250, duration: 150, delay: 151 };
	const activePose = "Idle2";
	const modes = {
		poses: Poses,
		colors: Colors,
		patch: Patches,
		number: Number,
	};
	function handleFullscreen(e) {
		fullscreen = !fullscreen;
		analytics.fireEvent({
			category: "content",
			action: "design-a-kit fullscreen toggled",
			label: fullscreen ? "toggled on" : "toggled off",
		});
	}

	function start(e) {
		started = true;
	}

	function share(e) {
		$sharing = true;
		analytics.fireEvent({
			category: "nav",
			action: "design-a-kit share modal",
			label: "Modal revealed",
		});
	}

	onMount(() => {
		// LISTEN FOR WHEN IT IS TIME TO FIRE A PAGEVIEW
		if (window?.gciAnalytics?.isReady) {
			// Analytics are ready
			analytics.firePageView({ contentId: presto_id });
		} else {
			// Wait for analytics to load, then fire the pageview
			document.addEventListener("gciAnalyticsReady", () => {
				analytics.firePageView({ contentId: presto_id });
			});
		}
		setVH();
	});
	setContext("design-a-kit", {
		share,
		isMobile,
	});

	function setVH(e) {
		vh = `${window.innerHeight / 100}px`;
	}
</script>

<style>
	:global(#design-a-kit) {
		padding-top: var(--agent-nav-height);
		background-color: black;
	}

	:global(#mainContentSection #design-a-kit) {
		/* For UW. :\ */
		padding-top: 0;
	}

	.design {
		--vh: 1vh;
		--controls-height: calc(40 * var(--vh, 1vh));
		--controls-triangle-height: 2rem;
		--controls-gap: 0.5rem;
		--fullscreen-transition: 150ms;
		/* height: calc((100 * var(--vh)) - var(--agent-nav-height)); */
		max-width: 1700px;
		margin: 0 auto;
		background-color: black;

		position: fixed;
		top: var(--agent-nav-height);
		left: 0;
		width: 100%;
		height: calc(100% - var(--agent-nav-height));
		z-index: 9;
	}

	.design__person {
		height: calc(100% - var(--controls-height));
		transition: height var(--fullscreen-transition) ease-in-out;
	}

	.design__controls {
		overflow: scroll;
		position: relative;
		box-sizing: border-box;
		padding: var(--gap);
		padding-top: calc(2 * var(--gap));
		background-color: var(--color-background);
		transition: max-height var(--fullscreen-transition) ease-in-out;

		/* Make this the height we want plus a little space for the triangle */
		height: calc(var(--controls-height) + var(--controls-triangle-height));
		margin-top: calc(-1 * var(--controls-triangle-height));
		clip-path: polygon(0 var(--controls-triangle-height), 100% 0, 100% 100%, 0 100%);
	}

	.design--expand {
		--controls-height: calc(50 * var(--vh, 1vh));
	}
	.design--fullscreen {
		--controls-height: 1rem;
	}

	:global(.overlay.splash .overlay__content) {
		overflow: unset;
	}

	@media all and (min-width: 1024px) {
		.design {
			position: static;
			display: grid;
			grid-template: minmax(1px, 1fr) auto / minmax(1px, 5fr) fit-content(28rem);
			height: calc((100 * var(--vh)) - var(--agent-nav-height));
		}

		.design__person,
		.design__controls {
			height: 100%;
			margin: 0;
			clip-path: unset;
			max-height: unset;
			padding-top: unset;
		}

		.design__person {
			grid-column: 1;
			grid-row: 1/-1;
		}

		.design__controls {
			padding: calc(2 * var(--gap));
			border-left: 10px solid var(--color-accent);

			display: flex;
			flex-flow: column;
			gap: var(--gap);
		}
	}

	@media all and (prefers-reduced-motion: reduce) {
		.design {
			--fullscreen-transition: 1ms;
		}
	}
</style>

<svelte:window
	on:resize={setVH}
	on:kitReset={e => {
		if ($resetting) {
			person.reset();
			person.resetCamera();
			$resetting = false;
			$jerseyNumber = null;
		} else {
			$resetting = true;
		}
	}} />
<div
	style:--vh={vh}
	class="design"
	class:design--expand={$mode in modes}
	class:design--fullscreen={fullscreen}>
	<div
		class="design__person"
		on:transitionend={e => {
			person.resize();
		}}>
		<Person {activePose} bind:this={person} />
	</div>
	<div class="design__controls">
		{#if $isMobile}
			<Controls visible={!($mode in modes) && !fullscreen} id="default">
				<ControlsDefault {person} {label_choose} {transitionOut} {transitionIn} />
			</Controls>
			{#each Object.entries(modes) as [id, component]}
				<Controls visible={id === $mode && !fullscreen} {id}>
					<svelte:component
						this={component}
						{transitionOut}
						{label_jersey_number_instructions}
						{transitionIn}
						{label_jersey_number}
						{label_patch}
						{person}
						{label_clothes}
						{label_color_1}
						{label_color_2}
						{label_pose}
						{label_pattern}
						{activePose} />
				</Controls>
			{/each}
		{:else}
			{#each Object.values(modes) as mode}
				<svelte:component
					this={mode}
					{label_pose}
					{label_jersey_number_instructions}
					transitionIn={{}}
					transitionOut={{}}
					{label_jersey_number}
					{label_patch}
					{person}
					{label_clothes}
					{label_color_1}
					{label_color_2}
					{label_pattern}
					{activePose} />
			{/each}
		{/if}
	</div>
	{#if !$isMobile}
		<DownloadShareReset />
	{/if}

	<ButtonFullscreen {fullscreen} on:click={handleFullscreen} />
</div>

<!-- <Recirculation {contributing} {recirculation} /> -->
{#if !started}
	<Modal class="splash">
		<Splash
			on:begin={start}
			{kicker}
			{headline}
			{person}
			{intro}
			{explanation_header}
			{explanation}
			{label_button_start}
			{published}
			{updated}
			{byline}
			{organization} />
	</Modal>
{/if}
{#if $recirc && started}
	<Modal
		closeButton={true}
		closeLabel="Back to home"
		on:close={e => {
			analytics.fireEvent({
				category: "content",
				action: "design-a-kit recirc",
				label: "modal dismissed",
			});
			$recirc = false;
		}}>
		<Recirculation {contributing} {recirculation} {label_recirculation} />
	</Modal>
{/if}
{#if $resetting && started}
	<Modal
		closeButton={true}
		closeLabel="Back"
		on:close={e => {
			analytics.fireEvent({
				category: "content",
				action: "design-a-kit reset",
				label: "modal dismissed",
			});
			$resetting = false;
		}}>
		<Reset {text_reset} />
	</Modal>
{/if}
{#if $sharing && started}
	<Modal
		class="sharing"
		closeButton={true}
		on:close={e => {
			$sharing = false;
			analytics.fireEvent({
				category: "nav",
				action: "design-a-kit share modal",
				label: "Modal dismissed",
			});
		}}>
		<Sharing
			{label_share_recirc}
			{label_share_recirc_btn}
			{headline}
			{label_download_sublabel}
			{label_download}
			{label_share}
			{person} />
	</Modal>
{/if}
