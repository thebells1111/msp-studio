<script>
	import SelectBandScreen from './SelectedScreens/SelectBandScreen.svelte';
	import SelectAlbumScreen from './SelectedScreens/SelectAlbumScreen.svelte';
	import SelectTrackScreen from './SelectedScreens/SelectTrackScreen.svelte';
	import SelectTrackEditorScreen from './SelectedScreens/SelectTrackEditorScreen.svelte';
	import { selectedScreen } from '$/stores';
</script>

<main>
	<header />
	{#if $selectedScreen === 'bands'}
		<SelectBandScreen />
	{:else if $selectedScreen === 'albums'}
		<SelectAlbumScreen />
	{:else if $selectedScreen === 'tracks'}
		<SelectTrackScreen />
	{:else if $selectedScreen === 'trackEditor'}
		<SelectTrackEditorScreen />
	{/if}
</main>

<style>
	main {
		padding: 8px;
		position: relative;
		height: calc(100% - 16px);
		overflow: auto;
	}
	header {
		margin-top: 60px;
	}
</style>
