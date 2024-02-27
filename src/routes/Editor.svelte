<script>
	import MainMenu from './MainMenu.svelte';
	import AlbumsList from './Selectors/Albums.svelte';
	import AlbumInput from './/Selectors/Inputs/AlbumInput.svelte';
</script>

<MainMenu />

<main>
	<AlbumsList />
	<AlbumInput />
</main>

<style>
	main {
		position: relative;
		height: calc(100% - 66px);
		overflow: auto;
		display: flex;
	}
</style>
