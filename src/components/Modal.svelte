<script>
	import { onMount, createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import ButtonDone from "./ui/ButtonDone.svelte";

	export let closeButton = false;
	export let closeLabel = "Back to editing";

	let clazz = "";
	export { clazz as class };

	const dispatch = createEventDispatcher();

	onMount(() => {
		document.body.classList.add("scroll-lock");

		return () => {
			document.body.classList.remove("scroll-lock");
		};
	});
	function keyup(evt) {
		switch (evt.key) {
			case "Escape":
				dispatch("close");
				break;
		}
	}
</script>

<style>
	.overlay {
		position: fixed;
		top: var(--agent-nav-height, 0);
		left: 0;
		width: 100%;
		height: calc(100% - var(--agent-nav-height, 0));
		z-index: 100000;

		background-color: rgba(0, 0, 0, 0.92);

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overlay--close-btn {
		padding-top: calc(2 * var(--gap));
	}

	.overlay__content {
		padding: var(--gap);
		height: 100%;
		width: 100%;
		max-width: 35rem;
		position: relative;
		overflow: scroll;
	}
</style>

<svelte:window on:keyup={keyup} />
<div
	class="overlay {clazz}"
	transition:fade={{ duration: 200 }}
	class:overlay--close-btn={closeButton}>
	<div class="overlay__content">
		<slot />
	</div>
	{#if closeButton}
		<ButtonDone
			on:click={e => {
				dispatch("close");
			}}
			label={closeLabel}
			visible={true} />
	{/if}
</div>
