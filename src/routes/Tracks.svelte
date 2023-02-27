<script>
	import { selectedAlbum, selectedTrack } from '$/stores';

	let newTrackName = '';
	let newTrackImage = '';

	async function addNewTrack() {
		let track = {};
		track.title = newTrackName;
		track.artwork = newTrackImage;

		$selectedAlbum.tracks = $selectedAlbum.tracks.concat(track);
		$selectedTrack = track;
	}

	async function selectTrack(Track) {
		console.log(Track);
		$selectedTrack = Track;
	}
</script>

<h4>Tracks</h4>
<ul>
	{#each $selectedAlbum?.tracks || [] as track}
		<li on:click={selectTrack.bind(this, track)}>{track.title}</li>
	{/each}
</ul>

<label>
	Track Name
	<input bind:value={newTrackName} />
</label>

<label>
	Link to Track Image
	<input bind:value={newTrackImage} />
</label>

<button on:click={addNewTrack}>Add</button>
