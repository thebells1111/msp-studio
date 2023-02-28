<script>
	import { selectedBand, selectedAlbum, selectedTrack, catalogDB } from '$/stores';

	let newTrackName = '';
	let newTrackImage = '';

	async function addNewTrack() {
		let track = {
			title: newTrackName,
			artwork: newTrackImage
		};

		$selectedTrack = track;
		$selectedAlbum.tracks = [...$selectedAlbum.tracks, track];

		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}
</script>

<h3>Track</h3>
<label>
	Track Name
	<input bind:value={newTrackName} />
</label>

<label>
	Link to Track Image
	<input bind:value={newTrackImage} />
</label>

<button on:click={addNewTrack}>Save</button>
