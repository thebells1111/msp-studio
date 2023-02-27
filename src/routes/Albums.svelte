<script>
	import { selectedBand, selectedAlbum, catalogDB } from '$/stores';

	export let selectedScreen;

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
		selectedScreen = 'tracks';
	}

	async function selectAlbum(album) {
		selectedAlbum.set(album);
		selectedScreen = 'tracks';
	}
</script>

<h4>Albums</h4>
<ul>
	{#each $selectedBand?.albums || [] as album}
		<li on:click={selectAlbum.bind(this, album)}>{album.title}</li>
	{/each}
</ul>

<label>
	Album Name
	<input bind:value={newAlbum.title} />
</label>

<label>
	Link to Album Image
	<input bind:value={newAlbum.artwork} />
</label>

<button on:click={addNewAlbum}>Add</button>
