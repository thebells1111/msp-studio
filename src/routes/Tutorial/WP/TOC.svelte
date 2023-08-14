<script>
	import Steps from '../Steps.svelte';
	export let chapter = 'setupFolders';
	export let chapterName;
	$: chapterName = directories[chapter]?.name;

	let directories = {
		setupFolders: { name: 'Setup Album Folder', folder: './SetupFolders', max: 3, next: 'setupWP' },
		setupWP: {
			name: 'Setup WordPress',
			folder: './WP/SetupWP',
			max: 5,
			next: 'mspAlbum',
			previous: 'setupFolders'
		},
		mspAlbum: {
			name: 'Build Album',
			folder: './MSP/Album',
			max: 10,
			next: 'mspTrack',
			previous: 'setupWP'
		},
		mspTrack: {
			name: 'Build Track',
			folder: './MSP/Track',
			max: 9,
			next: 'publish',
			previous: 'mspAlbum'
		},
		publish: {
			name: 'Publish Album',
			folder: './Publish',
			max: 5,
			next: '',
			previous: 'mspTrack'
		}
	};
</script>

{#if !chapter}
	<div>
		{#each Object.keys(directories) as chap}
			<button on:click={() => (chapter = chap)}> {directories[chap].name}</button>
		{/each}
	</div>
{:else}
	<Steps {directories} bind:chapter />
{/if}

<style>
	div {
		margin-top: 16px;
	}
	button {
		display: block;
		background-color: transparent;
		text-decoration: underline;
	}
</style>
