<script>
	import Steps from '../Steps.svelte';
	export let chapter = '../SetupFolders';
	const maxFileIndex = { setupFolders: 6 };
	$: max = chapter ? maxFileIndex[chapter] : 0;
</script>

{#if !chapter}
	<button on:click={() => (chapter = 'setupFolders')}> Setting up folder for import </button>
{:else}
	<Steps directory={'./SetupFolders'} {max} />
{/if}
