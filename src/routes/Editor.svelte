<script>
	import MainMenu from './MainMenu.svelte';
	import AlbumsList from './Selectors/Albums.svelte';
</script>

<MainMenu />

<main>
	<AlbumsList />
</main>

<style>
	main {
		padding: 8px;
		position: relative;
		height: calc(100% - 66px);
		overflow: auto;
	}
</style>
