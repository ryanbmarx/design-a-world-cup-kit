<script>
	import ButtonReset from "./ui/ButtonReset.svelte";
	import ButtonShare from "./ui/ButtonShare.svelte";
</script>

<style>
	.download-share-reset {
		grid-column: 1/-1;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: minmax(1px, 3fr) minmax(1px, 1fr);
		gap: var(--gap);
	}

	@media all and (min-width: 1024px) {
		.download-share-reset {
			grid-column: 2;
			grid-row: 2;

			display: grid;
			grid-template-columns: minmax(1px, 2fr) minmax(1px, 1fr);
			padding: var(--gap);
			background-color: var(--color-accent);

			width: calc(100% + 4rem);
			width: 100%;
		}
	}
</style>

<div class="download-share-reset">
	<ButtonShare />
	<ButtonReset />
</div>
