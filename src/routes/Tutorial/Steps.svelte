<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let activeIndex = writable(0);
	let Component;
	export let folder;
	export let max = 0;

	async function loadComponent(index) {
		const module = await import(`./${folder}/${index}.svelte`);
		Component = module.default;
	}

	// initial load
	onMount(() => loadComponent($activeIndex));

	const incrementIndex = () => {
		if ($activeIndex < max) {
			activeIndex.update((n) => n + 1);
			loadComponent($activeIndex);
		}
	};

	const decrementIndex = () => {
		if ($activeIndex > 0) {
			activeIndex.update((n) => n - 1);
			loadComponent($activeIndex);
		}
	};
</script>

<step>
	<svelte:component this={Component} />
</step>

<nav-buttons>
	{#if $activeIndex > 0}
		<button on:click={decrementIndex}>Previous</button>
	{:else}
		<spacer />
	{/if}

	{#if $activeIndex < max}
		<button on:click={incrementIndex}>Next</button>
	{:else}
		<spacer />
	{/if}
</nav-buttons>

<style>
	step {
		display: block;
		height: calc(100% - 46px);
	}
	nav-buttons {
		display: flex;
		justify-content: space-between;
		max-width: 720px;
		margin: 8px auto 0 auto;
	}
</style>
