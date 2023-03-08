<script>
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import { onMount } from 'svelte';

	import {
		library,
		catalogDB,
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		selectedTrack,
		selectedTrackIndex,
		selectedScreen
	} from '$/stores';

	export let add = false;
	let showAddNewButton = true;
	let newTrackName = '';
	let newTrackImage = '';
	let newTrackEnclosure = '';
	let newTrackValue = [];
	let showValueBlock = false;
	export let showEdit = false;

	onMount(() => {
		console.log($selectedTrack);
		newTrackName = $selectedTrack.title || '';
		newTrackImage = $selectedTrack.artwork || '';
		newTrackEnclosure = $selectedTrack.url || '';
		newTrackValue = $selectedTrack.value || [];
	});

	async function addNewTrack() {
		let track = {
			title: newTrackName,
			artwork: newTrackImage,
			url: newTrackEnclosure,
			value: []
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

	$: console.log(newTrackValue);
</script>

<blurred-background
	on:click|self={() => {
		showEdit = false;
	}}
>
	<track-modal>
		<top-pane>
			<image-pane>
				<img
					width="160"
					height="160"
					alt={$selectedTrack.artwork
						? `${`${$selectedTrack.title} ` || ''}cover art`
						: 'add Track Image link'}
					src={$selectedTrack.artwork}
				/>
			</image-pane>
			<edit-pane>
				<label>
					<p>Track Name (required)</p>
					<input bind:value={newTrackName} />
				</label>

				<label>
					<p>Link to Track mp3 File (required)</p>
					<input bind:value={newTrackEnclosure} />
				</label>
				<label>
					<p>Link to Track Image (optional)</p>
					<input bind:value={newTrackImage} />
				</label>
			</edit-pane>
		</top-pane>
		<audio src={$selectedTrack.url} controls />
		<bottom-pane>
			<label class="track-description">
				<p>Track Description</p>
				<textarea />
				<button class="save" on:click={() => (add ? addNewTrack() : saveTrack())}>
					{add ? 'Add Track' : 'Save Track'}
				</button>
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

	edit-pane {
		flex-grow: 1;
	}

	image-pane {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
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

	p {
		padding: 0;
		margin: 0;
	}

	.save {
		margin-top: 8px;
	}

	value {
		margin-left: 8px;
		flex-grow: 1;
	}

	audio {
		margin: 8px 64px;
		width: calc(100% - 128px);
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
		z-index: 3;
	}

	track-modal {
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		background-color: black;
		border-radius: 8px;
		padding: 8px;
		overflow: auto;
	}
</style>
