<script>
	import RecirculationArticle from "./RecirculationArticle.svelte";

	export let recirculation = [];
	export let label_recirculation = "More great World Cup content";
	export let contributing;
</script>

<style>
	.contributing :global(:is(*, p)) {
		font: var(--font-size-small) / 1.3em var(--fonts-sans-serif);
		color: var(--grey-light);
		margin: var(--gap) 0 0 0;
		padding: 1rem;
	}

	.links {
		list-style: none;
		margin: var(--gap) 0;
		padding: 0;
	}

	.link {
		font: var(--font-size) / 1.3em var(--fonts-sans-serif);
		color: white;
		margin: var(--gap) 0;
	}
</style>

<h2 class="label" id="recirc-label">{label_recirculation}</h2>
<ul class="links">
	{#each recirculation.filter(r => r?.headline && r?.pageURL) as r, index}
		<li class="link">
			<RecirculationArticle {index} {...r} />
		</li>
	{/each}
</ul>

{#if contributing}
	<div class="contributing">
		{@html contributing}
	</div>
{/if}
