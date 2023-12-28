<script>
	import MainMenu from './MainMenu.svelte';
	import SelectBandScreen from './SelectedScreens/SelectBandScreen.svelte';
	import SelectAlbumScreen from './SelectedScreens/SelectAlbumScreen.svelte';
	import SelectTrackScreen from './SelectedScreens/SelectTrackScreen.svelte';

	import { selectedScreen } from '$/stores';
</script>

{#if $selectedScreen === 'bands'}
	<SelectBandScreen />
{:else if $selectedScreen === 'albums'}
	<SelectAlbumScreen />
{:else if $selectedScreen === 'tracks'}
	<SelectTrackScreen />
{/if}

<style>
</style>
