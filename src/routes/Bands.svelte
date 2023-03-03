<script>
	import { library, selectedBand, selectedBandIndex, catalogDB, selectedScreen } from '$/stores';

	export let add = false;
	let newBandName = '';
	let newBandImage = '';
	$: if ($selectedBand) {
		newBandName = $selectedBand.title;
		newBandImage = $selectedBand.artwork;
	}

	async function addNewBand() {
		let band = {};
		band.title = newBandName;
		band.artwork = newBandImage;
		band.albums = [];
		$library = $library.concat(band);
		$selectedBandIndex = $library.length - 1;
		$catalogDB.setItem(band.title, band);
		$selectedBand = band;
		$selectedScreen = 'albums';
	}

	async function saveBand() {
		$selectedBand.title = newBandName;
		$selectedBand.artwork = newBandImage;
		$library[$selectedBandIndex] = $selectedBand;
		$library = $library.concat(band);
		$catalogDB.setItem(band.title, band);
		$selectedBand = band;
		$selectedScreen = 'albums';
	}
</script>

{#if !add}
	<h3>Band</h3>
{/if}
<label>
	Band Name
	<input bind:value={newBandName} placeholder="band name" />
</label>

<label>
	Link to Band Image
	<input bind:value={newBandImage} placeholder="link to band art" />
</label>

<button on:click={() => (add ? addNewBand() : saveBand())}>{add ? 'Add' : 'Save'}</button>
