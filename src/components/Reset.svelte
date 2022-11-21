<script>
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";
	import { resetting } from "../stores.js";
	import { fireEvent } from "../utils/analytics.js";
	export let text_reset;
	function handleReset(e) {
		window.dispatchEvent(new Event("kitReset", {}));
	}
	function handleDismiss(e) {
		fireEvent({
			category: "content",
			action: "design-a-kit reset",
			label: "modal dismissed",
		});
		$resetting = false;
	}
</script>

<style>
	.reset {
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: space-between;
		gap: var(--gap);
		height: 100%;
		flex-wrap: wrap;
	}

	.label {
		flex: 1 1 100%;
		font-size: 1.5em;
		text-align: center;
	}

	.reset :global(.reset__btn) {
		flex: 1 1 100px;
		justify-content: center;
	}
	.reset :global(.reset__btn--action) {
		background: var(--color-accent);
		color: var(--color-accent-text);
	}
</style>

<div class="reset">
	<h2 class="label">{text_reset}</h2>
	<ButtonDropShadow class="reset__btn reset__btn--dismiss" on:click={handleDismiss}
		>Cancel</ButtonDropShadow>
	<ButtonDropShadow class="reset__btn reset__btn--action" on:click={handleReset}
		>Reset</ButtonDropShadow>
</div>
