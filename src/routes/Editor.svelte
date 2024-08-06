<script>
	import MainMenu from './MainMenu.svelte';
	import AlbumsList from './Selectors/Albums.svelte';
	import Album from './Album/Album.svelte';
</script>

<MainMenu />

<main>
	<AlbumsList />
	<Album />
</main>

<style>
	main {
		position: relative;
		height: calc(100% - 66px);
		overflow: auto;
		display: flex;
	}
</style>
