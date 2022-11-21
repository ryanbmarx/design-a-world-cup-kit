<script>
	import Image from "./ui/Image.svelte";
	import { isInternal } from "../utils/is-internal";
	import { inView } from "../utils/watch-for-element.js";
	import { fireEvent } from "../utils/analytics.js";

	export let pageURL, headline, index;
	export let image = {};

	function handleClick(e) {
		fireEvent({
			category: `${isInternal(this.href) ? "internal" : "outbound"} links`,
			action: "design-a-kit recirculation",
			label: `to: ${this.href}`,
		});
	}
	function initInview(node) {
		if (index > 0) return;
		inView({
			element: node,
			once: true,
			cb: () => {
				fireEvent({
					category: "scroll tracking",
					action: "design-a-kit recirc in view",
					label: "in view",
				});
			},
		});
	}
</script>

<style>
	.article {
		display: flex;
		flex-flow: row-reverse nowrap;
		gap: var(--gap);
		align-items: center;
	}

	.article__headline {
		font: bold var(--font-size) / 1.3em var(--fonts-sans-serif);
		flex: 1 1;
		margin: 0;
	}
	.article .article__headline a {
		color: var(--color-font);
		text-decoration-color: var(--color-accent);
	}

	.article :global(.article__image) {
		flex: 0 0 100%;
		width: 100%;
		max-width: clamp(100px, 25vw, 200px);
	}
</style>

<article aria-labelledby="article{index}__headline" class="article" use:initInview>
	<h1 id="article{index}__headline" class="article__headline">
		<a on:click={handleClick} href={pageURL} rel="noopener noreferrer">{headline}</a>
	</h1>
	{#if image.src}
		<Image
			class="article__image"
			{...image}
			decorative={true}
			lazy={true}
			widths={[100, 200, 300, 400, 500, 600]}
			sizes="(min-width: 768px) 25vw, 45vw" />{/if}
</article>
