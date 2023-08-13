<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import Close from '../icons/Close.svelte';
	import Player from '../Player/Player.svelte';
	import clone from 'just-clone';

	import {
		catalogDB,
		selectedBand,
		selectedAlbum,
		selectedTrack,
		selectedTrackIndex,
		MSPValue,
		showTutorial
	} from '$/stores';

	let newTrackName = '';
	let newTrackImage = '';
	let newTrackEnclosure = { url: '', enclosureLength: '', type: '' };
	let playerEnclosure;
	let newTrackValue = [];
	let newTrackDescription = '';
	let explicit = 'no';
	let uploadWarning = '';
	export let showEdit = false;

	onMount(() => {
		newTrackName = $selectedTrack.title || '';
		newTrackImage = $selectedTrack.artwork || '';
		newTrackEnclosure = {
			url: $selectedTrack?.enclosure?.url || '',
			enclosureLength: $selectedTrack?.enclosure?.enclosureLength || '',
			type: $selectedTrack?.enclosure?.type || ''
		};
		playerEnclosure = $selectedTrack?.enclosure?.url;
		newTrackDescription = $selectedTrack.description || '';
		explicit = $selectedTrack.explicit || 'no';
		newTrackValue =
			$selectedTrack.value && $selectedTrack.value.length > 0
				? $selectedTrack.value
				: $selectedAlbum.value
				? clone($selectedAlbum.value)
				: clone($MSPValue);
	});

	async function saveTrack() {
		$selectedTrack.title = newTrackName;
		$selectedTrack.artwork = newTrackImage;
		$selectedTrack.enclosure = newTrackEnclosure;
		$selectedTrack.value = newTrackValue;
		$selectedTrack.description = newTrackDescription;
		$selectedTrack.explicit = explicit;
		$selectedAlbum.tracks[$selectedTrackIndex] = $selectedTrack;
		$selectedAlbum = $selectedAlbum;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		showEdit = false;
	}
	function closeModal() {
		showEdit = false;
	}

	function handleSubmit() {
		showEdit = false;
		saveTrack();
	}

	function closeWarning() {
		uploadWarning = '';
	}

	$: playerEnclosure = newTrackEnclosure?.url;
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<track-modal transition:fade|global={{ duration: 25 }}>
		<button
			on:click={() => {
				$showTutorial = true;
			}}>Tutorial</button
		>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<scroll-container>
			<top-pane>
				<image-pane>
					<img
						width="238"
						height="238"
						alt={newTrackImage ? `${`${newTrackImage} ` || ''}cover art` : 'add Track Image link'}
						src={newTrackImage}
					/>
				</image-pane>
				<edit-pane>
					<label class="track-name">
						<h4>Track Name (required)</h4>
						<input bind:value={newTrackName} />
					</label>

					<label>
						<h4>Link to Track mp3 File (required)</h4>
						<input bind:value={newTrackEnclosure.url} class="track-mp3" class:uploadable={false} />
					</label>
					<label>
						<h4>Link to Track Image (optional)</h4>
						<input bind:value={newTrackImage} class="track-img" class:uploadable={false} />
					</label>
					<explicit>
						<h4>Explicit Content (optional)</h4>
						<explicit-radio>
							<label>
								<input type="radio" bind:group={explicit} name="explicit" value={'no'} />
								No
							</label>
							<label>
								<input type="radio" bind:group={explicit} name="explicit" value={'yes'} />
								Yes
							</label>
						</explicit-radio>
					</explicit>
				</edit-pane>
			</top-pane>
			<Player bind:playerEnclosure bind:newTrackEnclosure />
			<bottom-pane>
				<label class="track-description">
					<h4>Track Description</h4>
					<textarea bind:value={newTrackDescription} />
				</label>
				<value>
					<ValueBlock bind:valueBlock={newTrackValue} />
				</value>
			</bottom-pane>
		</scroll-container>
		<button class="submit" on:click={handleSubmit}>Submit</button>
	</track-modal>
</blurred-background>

{#if uploadWarning}
	<blurred-background on:click={closeWarning}>
		<warning-modal>
			<h1>{uploadWarning}</h1>
		</warning-modal>
	</blurred-background>
{/if}

<style>
	top-pane {
		display: flex;
		margin-top: 8px;
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

	scroll-container {
		display: block;
		overflow-y: auto;
		overflow-x: hidden;
		height: calc(100% - 136px);
		padding-bottom: 48px;
	}

	.submit {
		width: calc(100% - 16px);
		margin: 8px;
	}

	.track-description {
		min-width: 33%;
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
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	value {
		margin-left: 8px;
		flex-grow: 1;
	}

	explicit {
		display: flex;
		flex-direction: column;
	}

	explicit-radio {
		display: block;
		margin: 0 8px;
	}

	explicit-radio label {
		display: inline-block;
		width: 100px;
		cursor: pointer;
		margin: 0;
	}

	explicit-radio input {
		width: initial;
	}

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

	track-modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow-y: auto;
		overflow-x: hidden;
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
		position: fixed;
		top: 16px;
		right: 16px;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
	}

	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	.track-img.uploadable,
	.track-mp3.uploadable {
		margin: 0 8px;
		width: calc(100% - 84px);
	}

	upload {
		display: inline-flex;
		position: relative;
		height: 12px;
		width: 12px;
	}

	upload button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.7em;
		padding: 0;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		position: absolute;
		top: -25px;
		right: -50px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}

	upload.img button {
		background-color: var(--color-bg-button-upload-0);
	}

	input::placeholder {
		color: red;
		font-weight: bold;
	}

	warning-modal {
		backdrop-filter: blur(50px);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 8px 16px;
		border-radius: 8px;
	}

	warning-modal h1 {
		color: red;
		font-weight: 700;
		text-align: center;
	}

	@media screen and (max-width: 992px) {
		track-modal {
			width: calc(100% - 16px);
			height: calc(100% - 16px);
			border-radius: 0px;
			padding: 8px;
			overflow: auto;
		}
		top-pane {
			width: calc(100% - 8px);
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin: 16px 0 0 8px;
		}
		img {
			width: 100px;
			min-width: 100px;
			height: 100px;
			margin-bottom: 4px;
		}

		edit-pane {
			width: 100%;
			margin: 8px 0 0 0;
		}

		bottom-pane {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin: 16px 16px 0 8px;
		}

		.track-description {
			width: calc(100% - 16px);
			margin: 8px 0 8px 8px;
		}

		value {
			width: 100%;
		}

		.close {
			top: 4px;
			right: 4px;
		}
	}
</style>
