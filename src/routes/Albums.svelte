<script>
	import { selectedBand, selectedAlbum, catalogDB, selectedScreen } from '$/stores';

	let newAlbum = {
		title: '',
		artwork: '',
		tracks: []
	};

	async function addNewAlbum() {
		const album = {
			title: newAlbum.title,
			artwork: newAlbum.artwork,
			tracks: []
		};
		$selectedAlbum = album;
		$selectedBand.albums = [...$selectedBand.albums, album];
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
	}
</script>

<h3>Album</h3>
<label>
	Album Name
	<input bind:value={newAlbum.title} />
</label>

<label>
	Link to Album Image
	<input bind:value={newAlbum.artwork} />
</label>

<button on:click={addNewAlbum}>Save</button>
