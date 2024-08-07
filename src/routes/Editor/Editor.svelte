<script>
	import MainMenu from '../MainMenu.svelte';
	import AlbumsList from './AlbumsList.svelte';
	import Album from './Album.svelte';
	import Track from './Track.svelte';

	import { MSPValue, editingFeed, feeds } from '$/stores';

	$: trackLength = $editingFeed.item.length;
</script>

<MainMenu />

<main>
	<AlbumsList />
	<editors>
		<Album />
		<h2>Tracks {trackLength > 0 ? `(${trackLength} Total)` : ''}</h2>
		{#each $editingFeed.item as track, i}
			<Track bind:track trackNumber={i + 1} />
		{/each}
	</editors>
</main>

<style>
	main {
		position: relative;
		height: calc(100% - 66px);
		overflow: hidden;
		display: flex;
	}

	editors {
		display: flex;
		flex-direction: column;
		overflow: auto;
		width: calc(100% - 260px);
	}

	h2 {
		margin-bottom: 0;
		text-align: center;
	}
</style>
