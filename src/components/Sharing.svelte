<script>
	import { fireEvent } from "../utils/analytics";
	import ButtonDropShadow from "./ui/ButtonDropShadow.svelte";
	import SocialShare from "./ui/SocialShare.svelte";
	import { sharing, recirc } from "../stores.js";
	export let person = {};
	export let headline;
	export let label_download;
	export let label_share;
	export let label_download_sublabel;
	export let label_share_recirc = "More great content!";
	export let label_share_recirc_btn = "Complete coverage";

	const downloadFormats = [
		{
			id: "png",
			label: "Static image (.png)",
		},
	];

	function handleDownload(e, formatID) {
		switch (formatID) {
			default:
				person.downloadPNG();
		}
		fireEvent({
			category: "content",
			action: "design-a-kit download",
			label: `Download ${formatID}`,
		});
	}
</script>

<style>
	.label {
		font-size: 1.5em;
		margin-top: calc(var(--gap) * 1.5);
	}

	.sublabel {
		display: block;
	}
	.sharing {
		--share-color-default: var(--color-accent);
		--share-color-accent: #009bff;
		display: flex;
		gap: var(--gap);
		flex-flow: column nowrap;
		min-height: 100%;
		padding: 0;
	}

	.sharing :global(.share) {
		display: block !important;
		max-width: unset;
	}
	.sharing :global(.share .share__btns) {
		width: fit-content;
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: repeat(4, minmax(1px, 1fr));
		gap: var(--gap);
	}
	.sharing :global(.share .share-btn),
	.sharing :global(.share .share-btn__inner) {
		height: clamp(3.5rem, 8vw, 7rem);
		width: clamp(3.5rem, 8vw, 7rem);
		aspect-ratio: 1/1;
	}

	.download {
		--color-icon: white;
		--color-icon-fill: black;

		display: flex;
		align-items: center;
		text-align: left;
		gap: 0.5rem;
		background-color: transparent;
		border: none;
		border-radius: 0;
		color: white;
		font: bold var(--font-size) / 1.3em var(--fonts-sans-serif);
		cursor: pointer;
		text-decoration-color: var(--color-accent);
		padding: 0;
	}
	.download__icon-wrap {
		flex: 0 0 4em;
		display: block;
		width: 4em;
		height: 4em;
		background-color: var(--color-icon);
		padding: 0.25rem;
		border-radius: 0.1rem;

		transition: background-color var(--speed-transition) ease-in-out;
	}

	.download__icon {
		transition: fill var(--speed-transition) ease-in-out;
		fill: var(--color-icon-fill);
		width: 70%;
		height: 70%;
		margin: 15%;
	}

	.download:focus,
	.download:hover {
		--color-icon: var(--color-accent);
		--color-icon-fill: var(--color-accent-text);
		text-decoration: underline;
	}
	.download:focus {
		outline: 2px solid var(--color-accent);
	}

	.recirc {
		margin: auto 0;
		padding: var(--gap);
		border: 1px solid var(--grey-medium);
		display: flex;
		flex-flow: column nowrap;
		gap: var(--gap);
		align-items: center;
	}
	.recirc .label {
		text-align: center;
		margin-top: 0;
	}
	.recirc :global(.recirc__btn) {
		text-align: center;
		font-size: 1.1em;
	}
	.sharing :global(.recirc__btn::after) {
		content: none;
	}
</style>

<div class="sharing">
	<h2 class="label">
		{label_download}
		<span class="sublabel">{label_download_sublabel}</span>
	</h2>
	{#each downloadFormats as { id, label }}
		<button
			class="download"
			on:click={e => {
				handleDownload(e, id);
			}}>
			<span class="download__icon-wrap">
				<svg class="download__icon">
					<title>An Arrow pointing down, signifying download</title>
					<use href="#download" />
				</svg>
			</span>
			{label}
		</button>
	{/each}
	<h2 class="label">{label_share}</h2>
	<SocialShare
		linkedin={false}
		label={null}
		project="design-a-kit"
		shareHeadline={headline}
		tiktok={true}
		instagram={true} />
	<aside class="recirc">
		<h2 class="label">{label_share_recirc}</h2>
		<ButtonDropShadow
			class="recirc__btn"
			active={true}
			on:click={e => {
				$sharing = false;
				$recirc = true;
				fireEvent({
					category: "content",
					action: "design-a-kit recirc",
					label: "modal opened",
				});
			}}>
			{label_share_recirc_btn}
		</ButtonDropShadow>
	</aside>
</div>
