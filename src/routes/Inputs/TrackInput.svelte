<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ChaptersTranscripts from './ChaptersTranscripts.svelte';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import Close from '../icons/Close.svelte';
	import Player from '../Player/Player.svelte';
	import clone from 'just-clone';
	import ToolTip from '$lib/Shared/ToolTip.svelte';

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
						<label-head>
							<h4>Track Name (required)</h4>
							<ToolTip>
								<p.tooltip>Enter the name this track</p.tooltip>
							</ToolTip>
						</label-head>
						<input bind:value={newTrackName} />
					</label>

					<label>
						<label-head>
							<h4>Link to Track mp3 File (required)</h4>
							<ToolTip>
								<p.tooltip>The URL where your track's mp3 file resides on the internet</p.tooltip>
							</ToolTip>
						</label-head>
						<input bind:value={newTrackEnclosure.url} class="track-mp3" class:uploadable={false} />
					</label>
					<label>
						<label-head>
							<h4>Link to Track Image (optional)</h4>
							<ToolTip>
								<p.tooltip
									>The URL of an image file that represents your track <br />
									If left empty most players will display your album art.
								</p.tooltip>
							</ToolTip>
						</label-head>
						<input bind:value={newTrackImage} class="track-img" class:uploadable={false} />
					</label>
					<explicit>
						<label-head>
							<h4>Explicit Content (optional)</h4>
							<ToolTip>
								<p.tooltip
									>Are there any F bombs or inappropriate language used in this album?</p.tooltip
								>
							</ToolTip>
						</label-head>
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
					<label-head>
						<h4>Track Liner Notes (optional - but recommended)</h4>
						<ToolTip>
							<p.tooltip
								>Interesting facts about this track. <br />
								Could be anything such as list of performers, <br />
								fun facts about the track. <br />
								Whatever you want to share with the audience.</p.tooltip
							>
						</ToolTip>
					</label-head>
					<textarea bind:value={newTrackDescription} />
				</label>
				<pane-2>
					<ChaptersTranscripts />
					<value>
						<ValueBlock bind:valueBlock={newTrackValue} />
					</value>
				</pane-2>
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

	label-head {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}

	label-head > p,
	label-head > h4 {
		margin-right: 8px;
	}

	input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	h4 {
		padding: 0;
		margin: 0;
	}
	pane-2 {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		width: 100%;
		align-items: center;
	}

	value {
		margin-left: 8px;

		width: 100%;
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
