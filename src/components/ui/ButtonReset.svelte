<script>
	import ButtonDropShadow from "./ButtonDropShadow.svelte";
</script>

<style>
	.lbl {
		display: none;
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.25rem;
		width: 2.25rem;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	:global(.reset) {
		justify-content: center;
	}

	@media all and (min-width: 768px) {
		.lbl {
			display: block;
		}
		:global(.reset) {
			justify-content: start;
		}
	}
</style>

<ButtonDropShadow
	class="reset"
	ariaLabel="Reset all choices"
	on:click={e => {
		window.dispatchEvent(new Event("kitReset", {}));
	}}>
	<span class="icon">
		<svg><use href="#reset" /></svg>
	</span>
	<span class="lbl">Reset</span>
</ButtonDropShadow>
