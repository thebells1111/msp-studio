<script>
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import Close from '../icons/Close.svelte';
	import Player from '../Player/Player.svelte';

	import { onMount } from 'svelte';

	import {
		catalogDB,
		selectedBand,
		selectedAlbum,
		selectedTrack,
		selectedTrackIndex,
		MSPValue
	} from '$/stores';

	export let add = false;
	let newTrackName = '';
	let newTrackImage = '';
	let newTrackEnclosure = '';
	let newTrackValue = [];
	export let showEdit = false;

	onMount(() => {
		console.log($selectedTrack);
		newTrackName = $selectedTrack.title || '';
		newTrackImage = $selectedTrack.artwork || '';
		newTrackEnclosure = $selectedTrack.url || '';
		newTrackValue =
			$selectedTrack.value && $selectedTrack.value.length > 0
				? $selectedTrack.value
				: [...$selectedAlbum.value] || [...$MSPValue];
	});

	async function addNewTrack() {
		let track = {
			title: newTrackName,
			artwork: newTrackImage,
			url: newTrackEnclosure,
			value: [...$selectedAlbum.value] || [...$MSPValue]
		};
		$selectedTrack = track;
		$selectedAlbum.tracks = $selectedAlbum.tracks.concat(track);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		showEdit = false;
	}

	async function saveTrack() {
		console.log(newTrackValue);
		$selectedTrack.title = newTrackName;
		$selectedTrack.artwork = newTrackImage;
		$selectedTrack.url = newTrackEnclosure;
		$selectedTrack.value = newTrackValue;
		$selectedAlbum.tracks[$selectedTrackIndex] = $selectedTrack;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		showEdit = false;
	}
	function closeModal() {
		showEdit = false;
		add ? addNewTrack() : saveTrack();
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<track-modal>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<top-pane>
			<image-pane>
				<img
					width="204"
					height="204"
					alt={newTrackImage ? `${`${newTrackImage} ` || ''}cover art` : 'add Track Image link'}
					src={newTrackImage}
				/>
			</image-pane>
			<edit-pane>
				<label>
					<h4>Track Name (required)</h4>
					<input bind:value={newTrackName} />
				</label>

				<label>
					<h4>Link to Track mp3 File (required)</h4>
					<input bind:value={newTrackEnclosure} />
				</label>
				<label>
					<h4>Link to Track Image (optional)</h4>
					<input bind:value={newTrackImage} />
				</label>
			</edit-pane>
		</top-pane>
		<Player source={newTrackEnclosure} />
		<bottom-pane>
			<label class="track-description">
				<h4>Track Description</h4>
				<textarea />
			</label>
			<value>
				<ValueBlock bind:valueBlock={newTrackValue} />
			</value>
		</bottom-pane>
	</track-modal>
</blurred-background>

<style>
	top-pane {
		display: flex;
	}
	image-pane {
		display: flex;
		flex-direction: column;
	}

	edit-pane {
		width: 100%;
		margin: 8px 0 0 8px;
	}

	bottom-pane {
		display: flex;
		align-items: flex-start;
	}

	.track-description {
		width: 33%;
	}

	.track-description textarea {
		width: 100%;
		height: 200px;
		resize: none;
	}

	label {
		display: block;
		margin: 0 16px 16px 0;
	}

	input {
		width: 100%;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	value {
		margin-left: 8px;
		flex-grow: 1;
	}

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

	track-modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		border-radius: 8px;
		padding: 8px;
		overflow: auto;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
	}

	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}
</style>
