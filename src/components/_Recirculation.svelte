<script>
	import RecirculationArticle from "./RecirculationArticle.svelte";

	export let recirculation = [];
	export let label_recirculation = "More great World Cup content";
	export let contributing;
</script>

<style>
	.recirc {
		padding: 1rem;
	}
	.contributing :global(:is(*, p)) {
		font: var(--font-size-small) / 1.3em var(--fonts-sans-serif);
		color: var(--grey-medium);
		margin: var(--gap) 0 0 0;
		padding: 1rem;
	}

	.links {
		list-style: none;
		margin: var(--gap) 0;
		padding: 0;
		display: grid;
		gap: var(--gap) calc(2 * var(--gap));
		/* grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); */
		grid-auto-flow: row;
	}

	.link {
		font: var(--font-size) / 1.3em var(--fonts-sans-serif);
		color: white;
	}

	@media all and (min-width: 768px) {
		.links {
			grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		}
	}
</style>

<section class="recirc" aria-labelledby="recirc-label">
	<h2 class="label" id="recirc-label">{label_recirculation}</h2>
	<ul class="links">
		{#each recirculation.filter(r => r?.headline && r?.pageURL) as r, index}
			<li class="link">
				<RecirculationArticle {index} {...r} />
			</li>
		{/each}
	</ul>
</section>
{#if contributing}
	<div class="contributing">
		{@html contributing}
	</div>
{/if}
