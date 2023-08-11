<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let activeIndex = writable(0);
	let Component;
	export let directories;
	export let chapter;

	$: console.log(directories[chapter]);

	async function loadComponent(index) {
		const module = await import(`${directories[chapter].folder}/${index}.svelte`);
		Component = module.default;
	}

	// initial load
	onMount(() => loadComponent($activeIndex));

	const incrementIndex = () => {
		if ($activeIndex < directories[chapter].max) {
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
	{:else if directories[chapter].previous}
		<button
			on:click={() => {
				chapter = directories[chapter].previous;
				$activeIndex = directories[chapter].max || 0;
				loadComponent($activeIndex);
			}}>Previous</button
		>
	{:else}
		<spacer />
	{/if}

	{#if $activeIndex < directories[chapter].max}
		<button on:click={incrementIndex}>Next</button>
	{:else if directories[chapter].next}
		<button
			on:click={() => {
				chapter = directories[chapter].next;
				$activeIndex = 0;
				loadComponent($activeIndex);
			}}>Next</button
		>
	{:else}
		<spacer />
	{/if}
</nav-buttons>

<style>
	step {
		display: flex;
		height: calc(100% - 46px);
		overflow: auto;
		width: 100%;
		flex-direction: column;
	}
	nav-buttons {
		display: flex;
		justify-content: space-between;
		max-width: 720px;
		margin: 8px auto 0 auto;
	}

	@media screen and (max-width: 992px) {
		step {
			height: calc(100% - 92px);
		}
	}
</style>
