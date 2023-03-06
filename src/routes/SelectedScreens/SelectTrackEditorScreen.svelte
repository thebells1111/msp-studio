<script>
	import EditBand from '../EditHeaders/EditBand.svelte';
	import EditAlbum from '../EditHeaders/EditAlbum.svelte';
	import EditTrack from '../EditHeaders/EditTrack.svelte';
	import TrackInput from '../Inputs/TrackInput.svelte';

	import { selectedBand, selectedAlbum } from '$/stores';
</script>

<EditBand />
<EditAlbum />
<EditTrack />
<TrackInput />
