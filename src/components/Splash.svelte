<script>
	import { afterUpdate, createEventDispatcher } from "svelte";
	import { fireEvent } from "../utils/analytics.js";
	import { loaded } from "../stores.js";

	import AnimationSoccerPow from "./AnimationSoccerPow.svelte";
	import Timestamp from "./ui/Timestamp.svelte";
	import Byline from "./ui/Byline.svelte";

	export let headline;
	export let intro;
	export let explanation_header;
	export let explanation;
	export let label_button_start;
	export let kicker;
	export let byline, organization, published, updated;
	export let person;

	const dispatch = createEventDispatcher();

	let animate = false;
	let duration = 600;
	let doneLoading = false;
	$: label = doneLoading && $loaded >= 100 ? label_button_start : "Loading ...";

	function begin(e) {
		animate = true;
		person.resize();
		setTimeout(function () {
			dispatch("begin");
			fireEvent({
				category: "nav",
				action: "design-a-kit started",
				label: "start",
			});
		}, duration - 100);
	}

	afterUpdate(() => {
		doneLoading = doneLoading || $loaded >= 100;
	});
</script>

<style>
	.splash {
		display: flex;
		gap: var(--gap);
		flex-flow: column nowrap;
		height: 100%;
	}

	.credits {
		margin-top: auto;
	}
	.credits :global(.byline) {
		margin: 0;
	}
	.credits :global(.timestamp) {
		--color-font-muted: var(--grey-light);
	}

	.splash :global(:is(p, .label, .headline)) {
		margin: 0;
	}

	.splash > :global(*:first-child) {
		margin-top: auto;
	}

	.start {
		padding: 0 1rem;
		min-height: 4.5rem;
		margin: 1rem 0 0 0;
		background: transparent;
		border: 1px solid var(--color-accent);
		color: var(--color-accent-text);
		width: 100%;
		text-align: center;
		font-weight: bold;
		font-size: var(--font-size-large);
		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;

		cursor: pointer;
		transition: transform var(--speed-transition) ease-in-out;
	}

	.start[disabled] {
		cursor: not-allowed;
	}

	.start::before {
		content: "";
		display: block;
		height: 100%;
		width: var(--loaded);
		background-color: var(--color-accent);
		position: absolute;
		top: 0;
		left: 0;
		transition: width 50ms ease-out;
	}

	.start:not([disabled]):hover {
		transform: scale(1.07) rotate(-1.5deg);
		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.56);
	}
	.start__label {
		position: relative;
	}
	.kicker {
		color: var(--color-accent);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1em;
	}

	.kicker :global(svg) {
		height: 2rem;
		width: 2rem;
		margin: 0;
		/* A little nudge to align with the text better */
		transform: translate(0, -2px);
	}

	@media all and (min-width: 500px) {
		.start {
			justify-content: center;
		}
	}
</style>

<div class="splash" style:--loaded="{$loaded}%">
	<span class="kicker label">
		<svg><use href="#sports-plus" /></svg>
		{kicker}
	</span>
	<h1 class="headline">{headline}</h1>
	{@html intro}
	{#if explanation_header}<h2 class="label label--large">{explanation_header}</h2>{/if}
	{#if explanation}{@html explanation}{/if}
	<button class="start" on:click={begin} disabled={!doneLoading && $loaded < 100}>
		<AnimationSoccerPow {duration} {animate} visible={doneLoading && $loaded >= 100} />
		<span class="start__label">{label}</span>
	</button>
	<div class="credits">
		<Byline {organization} {byline} />
		<Timestamp {published} {updated} />
	</div>
</div>
