<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Close from '../icons/Close.svelte';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import ToolTip from '$lib/Shared/ToolTip.svelte';

	import {
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		catalogDB,
		selectedScreen,
		MSPValue,
		showTutorial
	} from '$/stores';

	export let showEdit = false;
	let newAlbumName = '';
	let newAlbumImage = '';
	let newAlbumLink = '';
	let newAlbumValue = [];
	let newAlbumDescription = '';
	let explicit = 'no';
	let uploadWarning = '';

	onMount(() => {
		newAlbumName = $selectedAlbum.title || '';
		newAlbumImage = $selectedAlbum.artwork || '';
		newAlbumLink = $selectedAlbum.link || '';
		newAlbumValue =
			$selectedAlbum.value && $selectedAlbum.value.length > 0 ? $selectedAlbum.value : [$MSPValue];
		newAlbumDescription = $selectedAlbum.description || '';
		explicit = $selectedAlbum.explicit || 'no';
	});

	async function saveAlbum() {
		$selectedAlbum.title = newAlbumName;
		$selectedAlbum.artwork = newAlbumImage;
		$selectedAlbum.value = newAlbumValue;
		$selectedAlbum.description = newAlbumDescription;
		$selectedAlbum.explicit = explicit;
		$selectedAlbum.link = newAlbumLink;
		$selectedBand.albums[$selectedAlbumIndex] = $selectedAlbum;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showEdit = false;
	}

	function closeModal() {
		showEdit = false;
	}

	function closeWarning() {
		uploadWarning = '';
	}

	function handleSubmit() {
		showEdit = false;
		saveAlbum();
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<album-modal transition:fade|global={{ duration: 25 }}>
		<button
			on:click={() => {
				$showTutorial = true;
			}}>Tutorial</button
		>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<scroll-container>
			<top-container>
				<img
					width="258"
					height="258"
					alt={newAlbumImage ? `${`${newAlbumImage} ` || ''}cover art` : 'add Album Image link'}
					src={newAlbumImage}
				/>

				<album-inputs>
					<album-name>
						<label>
							<label-head>
								<p>Album Name (required)</p>
								<ToolTip>
									<p.tooltip>Enter the name of your Album</p.tooltip>
								</ToolTip>
							</label-head>
							<input bind:value={newAlbumName} />
						</label>
					</album-name>
					<album-image class:uploadable={false}>
						<label>
							<label-head>
								<p>Link to Album Image (required)</p>
								<ToolTip>
									<p.tooltip>This the URL to the image cover art for your album</p.tooltip>
								</ToolTip>
							</label-head>
							<input bind:value={newAlbumImage} />
						</label>
					</album-image>
					<album-link>
						<label>
							<label-head>
								<p>Link to Album Website (optional)</p>
								<ToolTip>
									<p.tooltip
										>Where would you like the listener to go to find out more info about the album,<br
										/>
										could be any website, online store, social media page, etc.</p.tooltip
									>
								</ToolTip>
							</label-head>
							<input bind:value={newAlbumLink} />
						</label>
					</album-link>
					<explicit>
						<label-head>
							<p>Explicit Content (required)</p>
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
				</album-inputs>
			</top-container>
			<bottom-pane>
				<label class="album-description">
					<label-head>
						<h4>Album Liner Notes (required)</h4>
						<ToolTip>
							<p.tooltip>
								Interesting facts about this album. Could be anything <br />
								such as list of band members, genre of music, date album was recorded,<br />
								fun facts about the album. Whatever you want to share with the audience.
							</p.tooltip>
						</ToolTip>
					</label-head>
					<textarea bind:value={newAlbumDescription} />
				</label>
				<value>
					<ValueBlock bind:valueBlock={newAlbumValue} />
				</value>
			</bottom-pane>
		</scroll-container>
		<button class="submit" on:click={handleSubmit}>Submit</button>
	</album-modal>
</blurred-background>

{#if uploadWarning}
	<blurred-background on:click={closeWarning}>
		<warning-modal>
			<h1>{uploadWarning}</h1>
		</warning-modal>
	</blurred-background>
{/if}

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

	album-modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow: hidden;
		border-radius: 8px;
		padding: 8px;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
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

	scroll-container {
		display: block;
		overflow-y: auto;
		overflow-x: hidden;
		height: calc(100% - 140px);
		padding-bottom: 48px;
	}

	.submit {
		width: calc(100% - 16px);
		margin: 8px;
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

	bottom-pane {
		display: flex;
		align-items: flex-start;
		margin: 16px 16px 0 8px;
	}

	.album-description {
		min-width: 33%;
		margin: 8px 0 0 8px;
	}

	.album-description textarea {
		width: calc(100% - 16px);
		height: 200px;
		resize: none;
		margin: 8px 0 0 8px;
	}

	album-image {
		display: block;
		margin: 16px 0;
	}
	album-name label,
	album-image label,
	album-link label {
		width: 100%;
	}

	album-name input,
	album-image input,
	album-link input {
		margin: 0 8px;
		width: calc(100% - 40px);
	}

	album-image.uploadable input {
		margin: 0 8px;
		width: calc(100% - 116px);
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
		width: 60px;
		height: 60px;
		border-radius: 50%;
		position: absolute;
		top: -25px;
		right: -50px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}

	explicit {
		margin-top: 16px;
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
	}

	p {
		padding: 0;
		margin: 0;
	}

	p.tooltip {
		padding: 0%;
		color: white;
		margin-left: 0px;
	}

	.close {
		position: fixed;
		top: 16px;
		right: 16px;
		background-color: transparent;
		padding: 8px;
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
	}

	top-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: 16px 0 0 16px;
	}

	album-inputs {
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
	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
		min-width: 258px;
	}

	input::placeholder {
		color: red;
		font-weight: bold;
	}

	@media screen and (max-width: 992px) {
		album-modal {
			width: calc(100% - 16px);
			height: calc(100% - 16px);
			border-radius: 0px;
			padding: 8px;
			overflow: auto;
		}
		top-container {
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

		bottom-pane {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin: 16px 16px 0 8px;
		}

		album-inputs {
			width: calc(100% - 8px);
			margin: 0 8px;
		}

		.album-description {
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
