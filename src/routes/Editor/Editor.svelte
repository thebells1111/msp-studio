<script>
	import MainMenu from '../MainMenu.svelte';
	import AlbumsList from './AlbumsList.svelte';
	import Album from './Album.svelte';
	import Track from './Track.svelte';

	import { MSPValue, editingFeed, feeds } from '$/stores';

	$: trackLength = $editingFeed?.item?.length;
</script>

<MainMenu />

<main>
	<AlbumsList />
	<editors>
		{#if $editingFeed}
			<h2>Album</h2>
			<Album />
			<h2>Tracks {trackLength > 0 ? `(${trackLength} Total)` : ''}</h2>
			{#each $editingFeed.item as track, i}
				<Track bind:track trackNumber={i + 1} />
			{/each}
		{/if}
	</editors>
</main>

<style>
	main {
		position: relative;
		height: calc(100% - 38px);
		width: 100vw;
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
		margin: 0;
		text-align: center;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 10%,
			var(--color-poster-bg-1) 95%
		);
	}
</style>
