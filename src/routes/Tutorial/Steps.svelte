<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import SF0 from './SetupFolders/0.svelte';
	import SF1 from './SetupFolders/1.svelte';
	import SF2 from './SetupFolders/2.svelte';
	import SF3 from './SetupFolders/3.svelte';
	import SWP0 from './WP/SetupWP/0.svelte';
	import SWP1 from './WP/SetupWP/1.svelte';
	import SWP2 from './WP/SetupWP/2.svelte';
	import SWP3 from './WP/SetupWP/3.svelte';
	import SWP4 from './WP/SetupWP/4.svelte';
	import SWP5 from './WP/SetupWP/5.svelte';
	import MSPA0 from './MSP/Album/0.svelte';
	import MSPA1 from './MSP/Album/1.svelte';
	import MSPA2 from './MSP/Album/2.svelte';
	import MSPA3 from './MSP/Album/3.svelte';
	import MSPA4 from './MSP/Album/4.svelte';
	import MSPA5 from './MSP/Album/5.svelte';
	import MSPA6 from './MSP/Album/6.svelte';
	import MSPA7 from './MSP/Album/7.svelte';
	import MSPA8 from './MSP/Album/8.svelte';
	import MSPA9 from './MSP/Album/9.svelte';
	import MSPA10 from './MSP/Album/10.svelte';
	import MSPT0 from './MSP/Track/0.svelte';
	import MSPT1 from './MSP/Track/1.svelte';
	import MSPT2 from './MSP/Track/2.svelte';
	import MSPT3 from './MSP/Track/3.svelte';
	import MSPT4 from './MSP/Track/4.svelte';
	import MSPT5 from './MSP/Track/5.svelte';
	import MSPT6 from './MSP/Track/6.svelte';
	import MSPT7 from './MSP/Track/7.svelte';
	import MSPT8 from './MSP/Track/8.svelte';
	import MSPT9 from './MSP/Track/9.svelte';
	import PUB0 from './Publish/0.svelte';
	import PUB1 from './Publish/1.svelte';
	import PUB2 from './Publish/2.svelte';
	import PUB3 from './Publish/3.svelte';
	import PUB4 from './Publish/4.svelte';
	import PUB5 from './Publish/5.svelte';

	let activeIndex = writable(0);
	let Component;
	export let directories;
	export let chapter;

	$: console.log(chapter);

	directories = {
		setupFolders: {
			name: 'Setup Album Folder',
			folders: [SF0, SF1, SF2, SF3],
			max: 3,
			next: 'setupWP'
		},
		setupWP: {
			name: 'Setup WordPress',
			folders: [SWP0, SWP1, SWP2, SWP3, SWP4, SWP5],
			max: 5,
			next: 'mspAlbum',
			previous: 'setupFolders'
		},
		mspAlbum: {
			name: 'Build Album',
			folders: [MSPA0, MSPA1, MSPA2, MSPA3, MSPA4, MSPA5, MSPA6, MSPA7, MSPA8, MSPA9, MSPA10],
			max: 10,
			next: 'mspTrack',
			previous: 'setupWP'
		},
		mspTrack: {
			name: 'Build Track',
			folders: [MSPT0, MSPT1, MSPT2, MSPT3, MSPT4, MSPT5, MSPT6, MSPT7, MSPT8, MSPT9],
			max: 9,
			next: 'publish',
			previous: 'mspAlbum'
		},
		publish: {
			name: 'Publish Album',
			folders: [PUB0, PUB1, PUB2, PUB3, PUB4, PUB5],
			max: 5,
			next: '',
			previous: 'mspTrack'
		}
	};

	async function loadComponent(index) {
		Component = directories[chapter].folders[index];
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
