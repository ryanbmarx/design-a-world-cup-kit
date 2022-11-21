<script>
	export let title = "";
</script>

<style>
	line {
		stroke: currentColor;
		stroke-width: 10px;
	}
</style>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 341.53 341.53">
	{#if title}
		<title>{title}</title>
	{/if}
	<line class="x-cls-1" x1="341.18" y1="-0.65" x2="0.35" y2="340.18" />
	<line class="x-cls-1" x1="341.18" y1="340.18" x2="0.35" y2="-0.65" />
</svg>
