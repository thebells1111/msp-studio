<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import Close from '../icons/Close.svelte';

	import {
		library,
		selectedBand,
		selectedBandIndex,
		newBand,
		selectedAlbum,
		selectedAlbumIndex,
		newAlbum,
		selectedTrack,
		selectedTrackIndex,
		newTrack,
		catalogDB,
		selectedScreen,
		showTutorial
	} from '$/stores';

	export let add = false;
	export let showEdit = false;
	let newBandName = '';
	let newBandImage = '';

	onMount(() => {
		newBandName = $selectedBand.title || '';
		newBandImage = $selectedBand.artwork || '';
	});

	async function addNewBand() {
		let band = {};
		band.title = newBandName;
		band.artwork = newBandImage;
		band.albums = [];
		$library = $library.concat(band);
		$selectedBandIndex = $library.length - 1;
		$catalogDB.setItem(band.title, band);
		$selectedBand = band;
		$selectedAlbum = $newAlbum;
		$selectedAlbumIndex = -1;
		$selectedTrack = $newTrack;
		$selectedTrackIndex = -1;
		$selectedScreen = 'albums';
	}

	async function saveBand() {
		$selectedBand.title = newBandName;
		$selectedBand.artwork = newBandImage;
		$library[$selectedBandIndex] = $selectedBand;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'albums';
		showEdit = false;
	}

	function closeModal() {
		showEdit = false;
		add ? addNewBand() : saveBand();
	}

	function handleSubmit() {
		add ? addNewBand() : saveBand();
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<band-modal transition:fade={{ duration: 25 }}>
		<button
			class="tutorial"
			on:click={() => {
				$showTutorial = true;
			}}>Tutorial</button
		>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<label class="band-name">
			<p>Band Name</p>
			<input bind:value={newBandName} placeholder="band name" />
		</label>
		<button on:click={handleSubmit}>Submit</button>
	</band-modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 34;
		backdrop-filter: blur(5px);
	}

	band-modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
	}

	.band-name {
		width: calc(100% - 8px);
		margin: 32px 8px 8px 8px;
	}

	.band-name input {
		margin: 0 8px;
		width: calc(100% - 36px);
	}

	p {
		padding: 0;
		margin: 0;
	}

	button {
		width: 96px;
		align-self: flex-end;
		margin-right: 20px;
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		width: initial;
		margin-right: initial;
	}

	.tutorial {
		align-self: flex-start;
		margin: 8px 8px 0 8px;
	}

	@media screen and (max-width: 992px) {
		band-modal {
			width: calc(100% - 16px);
			height: calc(100% - 16px);
			border-radius: 0px;
			padding: 8px;
			overflow: auto;
		}
	}
</style>
