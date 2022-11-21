<script>
	import throttle from "lodash.throttle";
	import { onMount } from "svelte";
	import { fireEvent } from "../utils/analytics.js";
	import { jerseyNumber } from "../stores.js";

	export let label_jersey_number;
	export let label_jersey_number_instructions;

	export let person;
	let numberInput;

	const MAX_NUMBER_LENGTH = 2;
	$: label = label_jersey_number.replace("{{MAX}}", MAX_NUMBER_LENGTH);
	$: instructions = label_jersey_number_instructions.replace(
		"{{MAX}}",
		MAX_NUMBER_LENGTH
	);

	let throttledFireEvent = fireEvent;

	// https://www.adl.org/resources/hate-symbols/search
	const blocked = ["69", "14", "88"];
	function validateNumber(num) {
		// Make sure num is a string, so we are comparing apples to apples,
		// and only two digits long, because that is our limit.
		num = String(num).slice(0, MAX_NUMBER_LENGTH);
		if (blocked.includes(String(num))) return "";
		return num.replace(/[^0-9]/g, "").slice(0, MAX_NUMBER_LENGTH);
	}

	onMount(() => {
		throttledFireEvent = throttle(fireEvent, 500, { leading: true });
	});
</script>

<style>
	.number {
		--jersey-number: 10rem;
		width: 100%;
		height: var(--jersey-number);
		color: var(--color-font);
		background: transparent;
		border: none;
		border-bottom: 2px solid var(--grey-medium);
		text-align: center;
		font-size: var(--jersey-number);
		padding: 0;
		font-family: "Bebas Neue", monospace;
	}
</style>

<label class="label">
	{label}
	<span class="sublabel">{instructions}</span>
	<input
		class="number"
		type="tel"
		min="0"
		max="99"
		placeholder="99"
		bind:value={$jerseyNumber}
		on:input={e => {
			person.setCamera("number");
			$jerseyNumber = validateNumber($jerseyNumber);
			person.changeNumber($jerseyNumber);
			throttledFireEvent({
				category: "content",
				action: "design-a-kit customization",
				label: `Number changed to ${$jerseyNumber}`,
			});
		}}
		bind:this={numberInput}
		maxlength="5" />
</label>
