<script>
	import { library, selectedBand, selectedAlbum, selectedTrack } from '$/stores';

	export let selectedScreen;
	let newBandName = '';
	let newBandImage = '';

	async function addNewBand() {
		let band = {};
		band.title = newBandName;
		band.artwork = newBandImage;
		band.albums = [];
		console.log($library);
		$library = $library.concat(band);
		$selectedBand = band;
		selectedScreen = 'albums';
	}

	async function selectBand(band) {
		console.log(band);
		$selectedBand = band;
		$selectedAlbum = '';
		$selectedTrack = '';
		selectedScreen = 'albums';
	}
</script>

<ul>
	{#each $library as band}
		<li on:click={selectBand.bind(this, band)}>{band.title}</li>
	{/each}
</ul>

<label>
	Band Name
	<input bind:value={newBandName} />
</label>

<label>
	Link to Band Image
	<input bind:value={newBandImage} />
</label>

<button on:click={addNewBand}>Add</button>
