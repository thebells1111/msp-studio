<script>
	import { library, selectedBand, selectedAlbum } from '$/stores';

	export let selectedScreen;
	let newAlbumName = '';
	let newAlbumImage = '';

	async function addNewAlbum() {
		let album = {};
		album.title = newAlbumName;
		album.artwork = newAlbumImage;
		album.tracks = [];
		console.log($library);
		$selectedBand.albums = $selectedBand.albums.concat(album);
		$selectedAlbum = album;
		selectedScreen = 'tracks';
	}

	async function selectAlbum(album) {
		console.log(album);
		$selectedAlbum = album;
		selectedScreen = 'tracks';
	}
</script>

<h4>Albums</h4>
<ul>
	{#each $selectedBand.albums as album}
		<li on:click={selectAlbum.bind(this, album)}>{album.title}</li>
	{/each}
</ul>

<label>
	Album Name
	<input bind:value={newAlbumName} />
</label>

<label>
	Link to Album Image
	<input bind:value={newAlbumImage} />
</label>

<button on:click={addNewAlbum}>Add</button>
