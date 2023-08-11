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
			next: 'msp',
			previous: 'setupFolders'
		},
		msp: { name: 'MSP Build', folder: './MSP', max: 5, previous: 'setupWP' }
	};
</script>

{#if !chapter}
	{#each Object.keys(directories) as chap}
		<button on:click={() => (chapter = chap)}> {directories[chap].name}</button>
	{/each}
{:else}
	<Steps {directories} bind:chapter />
{/if}
