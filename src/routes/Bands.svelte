<script>
	import { library, selectedBand, catalogDB, selectedScreen } from '$/stores';

	let newBandName = '';
	let newBandImage = '';

	async function addNewBand() {
		let band = {};
		band.title = newBandName;
		band.artwork = newBandImage;
		band.albums = [];
		console.log($library);
		$library = $library.concat(band);
		$catalogDB.setItem(band.title, band);
		$selectedBand = band;
		$selectedScreen = 'albums';
	}
</script>

<h3>Band</h3>
<label>
	Band Name
	<input bind:value={newBandName} />
</label>

<label>
	Link to Band Image
	<input bind:value={newBandImage} />
</label>

<button on:click={addNewBand}>Save</button>
