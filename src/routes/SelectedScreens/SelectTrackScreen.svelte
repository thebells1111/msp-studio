<script>
	import EditBand from '../EditHeaders/EditBand.svelte';
	import EditAlbum from '../EditHeaders/EditAlbum.svelte';
	import TrackInput from '../Inputs/TrackInput.svelte';

	import { selectedAlbum, selectedTrack, selectedTrackIndex, selectedScreen } from '$/stores';

	async function selectTrack(track, index) {
		$selectedTrack = track;
		$selectedTrackIndex = index;
		$selectedScreen = 'trackEditor';
	}
</script>

<EditBand />
<EditAlbum />

<h4>Select a Track</h4>
<ul>
	{#each $selectedAlbum?.tracks || [] as track, i}
		<li on:click={selectTrack.bind(this, track, i)}>{track.title}</li>
	{/each}
</ul>
<TrackInput add={true} />
