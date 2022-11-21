<script>
	import { getContext } from "svelte";
	import ButtonDropShadow from "./ButtonDropShadow.svelte";

	const { share } = getContext("design-a-kit");
</script>

<style>
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.25rem;
		width: 2.25rem;
		border-radius: 0.4rem;
		background-color: black;
		margin-left: auto;
	}

	.icon :global(svg) {
		height: 75%;
		width: 75%;
		fill: white;
	}

	.share__text {
		padding: 0;
		text-align: left;
		font-weight: bold;
		font-size: 1.6rem;
		text-transform: uppercase;
	}
	.share__text em {
		font-style: normal;
		color: var(--grey-medium);
	}

	@media all and (min-width: 1024px) {
		:global(#design-a-kit .share) {
			flex-flow: row nowrap;
			justify-content: flex-end;
		}
		/* Hide all but the first icon, for spacing*/
		.icon {
			flex-flow: row-reverse nowrap;
		}
	}
</style>

<ButtonDropShadow class="share" on:click={share}>
	<span class="share__text">Download<br /><em>and</em>share</span>
	<!-- <span class="icon icon--download">
		<svg><use href="#download" /></svg>
	</span> -->
	<span class="icon icon--share">
		<svg><use href="#share" /></svg>
	</span>
</ButtonDropShadow>
