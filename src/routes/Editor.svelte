<script>
	import MainMenu from './MainMenu.svelte';
	import SelectBandScreen from './SelectedScreens/SelectBandScreen.svelte';
	import SelectAlbumScreen from './SelectedScreens/SelectAlbumScreen.svelte';
	import SelectTrackScreen from './SelectedScreens/SelectTrackScreen.svelte';
	import Modals from './Modals/Modals.svelte';
	import { selectedScreen } from '$/stores';
</script>

<MainMenu />
<main>
	{#if $selectedScreen === 'bands'}
		<SelectBandScreen />
	{:else if $selectedScreen === 'albums'}
		<SelectAlbumScreen />
	{:else if $selectedScreen === 'tracks'}
		<SelectTrackScreen />
	{/if}
</main>

<style>
	main {
		padding: 8px;
		position: relative;
		height: calc(100% - 106px);
		overflow: auto;
	}
</style>
