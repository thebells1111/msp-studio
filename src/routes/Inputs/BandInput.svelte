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
		selectedScreen
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
		showAddNewButton = true;
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
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<band-modal transition:fade={{ duration: 25 }}>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<label class="band-name">
			<p>Band Name</p>
			<input bind:value={newBandName} placeholder="band name" />
		</label>
	</band-modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	band-modal {
		position: relative;
		width: calc(100% - 100px);
		height: calc(100% - 100px);
		display: flex;
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
		width: 100%;
		margin: 32px 8px;
	}

	.band-name input {
		margin: 0 8px;
		width: calc(100% - 24px);
	}

	p {
		padding: 0;
		margin: 0;
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
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
