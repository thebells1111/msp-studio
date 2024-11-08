<script>
	import ValueBlock from '$lib/Editor/ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from '$lib/Editor/ExplicitToggle.svelte';
	import FileUploader from '$lib/Editor/FileUploader.svelte';
	import SmallModal from '$lib/Modals/SmallModal.svelte';
	import UploadFileIcon from '$icons/UploadFile.svelte';
	import DeleteIcon from '$icons/Delete.svelte';
	import ArtUpload from '$lib/Editor/ArtUpload.svelte';
	import Player from '$lib/Editor/Tracks/Player/Player.svelte';

	import clone from 'just-clone';

	import { newTrack, editingFeed, settings } from '$/stores';

	function updateFeeds() {
		$editingFeed = $editingFeed;
	}

	export let track = clone($newTrack);
	export let trackNumber = 1;

	let imageReload = 1;
	let audioReload = 1;
	let showUpload = false;
	let uploadType = 'image';
	let imageType = 'trackSquare';

	$: if (imageReload || audioReload) {
		showUpload = false;
		updateFeeds();
	}

	function deleteTrack() {
		const confirmed = window.confirm(
			`Are you sure you want to delete Track #${trackNumber}${
				track.title ? ` - ${track.title}?` : '?'
			}`
		);
		if (confirmed) {
			$editingFeed.item = $editingFeed.item.filter(
				(v) => !(v.guid === track.guid || v.guid['#text'] === track.guid['#text'])
			);
		}
	}

	const onImageLoad = (event) => {
		const image = event.target; // 'this' is the image element
		const spinner = image.closest('image-container').querySelector('spinner'); // find the spinner within the parent container

		spinner.style.display = 'none'; // Hide the spinner when the image has loaded
	};

	const onImageError = (event) => {
		const image = event.target;
		const spinner = image.closest('image-container').querySelector('spinner');
		spinner.style.display = 'none'; // Hide the spinner on error
	};
</script>

<container>
	<track-header class:first={trackNumber === 1}>
		<h3>Track #{trackNumber}</h3>
		<button class="delete" on:click={deleteTrack}>
			<DeleteIcon />
		</button>
	</track-header>
	{#if track?.enclosure?.['@_url']}
		<Player bind:track />
	{/if}
	<ul>
		<li><h4>Title</h4></li>
		<li><h4>Link to mp3</h4></li>
		<li><h4>Explicit</h4></li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={track.title} /></li>
		<li>
			<input bind:value={track.enclosure['@_url']} />
			<button
				class="audio-upload"
				class:hide={!$settings?.bunny?.active}
				on:click={() => {
					showUpload = true;
					uploadType = 'audio';
				}}
			>
				<UploadFileIcon size="18" />
			</button>
		</li>
		<li><ExplicitToggle bind:checked={track.explicit} /></li>
	</ul>
	<info-2>
		<track-art
			on:click={() => {
				showUpload = true;
				uploadType = 'image';
				imageType = 'trackSquare';
			}}
		>
			<h4>Track Art</h4>
			<image-container class="track">
				<img
					data-track={trackNumber}
					src={track['itunes:image']['@_href']}
					alt="track art - click to edit"
				/>
			</image-container>

			<button class:hide={!$settings?.bunny?.active}><UploadFileIcon size="20" /></button>
		</track-art>

		<banner-art
			on:click={() => {
				showUpload = true;
				uploadType = 'image';
				imageType = 'trackBanner';
			}}
		>
			<h4>Banner Art</h4>
			<image-container class="track-banner">
				<img
					src={track?.['podcast:aspectImages']?.find((v) => v?.['@_aspect-ratio'] === '6/1')?.[
						'@_src'
					] +
						'?t=' +
						imageReload}
					alt="banner art - click to edit"
				/>
			</image-container>

			<button class:hide={!$settings?.bunny?.active}><UploadFileIcon size="20" /></button>
		</banner-art>

		<description>
			<h4>Description</h4>
			<textarea bind:value={track.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={track['podcast:value']['podcast:valueRecipient']} />
		</value>
	</info-2>
</container>

{#if showUpload}
	<SmallModal
		closeModal={() => {
			showUpload = false;
		}}
	>
		{#if uploadType === 'audio'}
			<FileUploader
				bind:filePath={track.enclosure['@_url']}
				bind:fileReload={audioReload}
				fileName="audio"
				folderName={$editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid}
				type={uploadType}
				uploadText="Track #{trackNumber} Audio"
			/>
		{:else}
			<ArtUpload bind:imageReload imageParent="track" {track} {trackNumber} {imageType} />
		{/if}
	</SmallModal>
{/if}

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		padding: 0 8px;
		margin-bottom: 8px;
	}
	ul {
		display: flex;
		justify-content: space-between;
		height: 18px;
		align-items: center;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	li {
		list-style: none;
		height: 100%;
		width: 100%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		cursor: initial;
		margin: 0 4px;
		position: relative;
	}
	li:last-of-type {
		min-width: 80px;
		max-width: 80px;
	}

	.inputs {
		height: 30px;
	}

	input {
		border-radius: 30px;
		width: calc(100%);
	}

	info-2 {
		margin-top: 8px;
		display: grid;
		grid-template-columns: 100px 472px calc(100% - 572px); /* First column fixed, B and C flexible */
		grid-template-rows: 120px 200px; /* Two rows */
		gap: 8px; /* Adjust spacing between items */
		width: 100%; /* Full width of the container */
		height: 320px;
	}

	track-art {
		grid-column: 1; /* First column */
		grid-row: 1; /* First row */
		width: 100%;
		height: 178px;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	image-container.track {
		cursor: pointer;
		height: 100px;
		width: 100px;
		border: 1px solid black;
		border-radius: 5px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	image-container.track-banner {
		margin-top: 10px;
		height: 78.2px;
		min-height: 78.2px;
		width: calc(78.2px * 6);
		cursor: pointer;
		border: 1px solid black;
		border-radius: 5px;
		justify-self: flex-end;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	image-container > img {
		height: 100%;
		width: 100%;
		border-radius: 5px;
		position: absolute;
	}

	banner-art {
		grid-column: 2;
		grid-row: 1;
		width: calc ((100% - 150px) / 2);
		height: 102px;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	spinner {
		display: block;
		position: absolute;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	h4 {
		margin: 0 8px;
		text-align: left;
		width: 100%;
	}

	description {
		grid-column: 1 / span 2;
		grid-row: 2;
		height: calc(100% - 8px); /* Adjust height as needed */
		display: flex;
		flex-direction: column;
	}

	textarea {
		resize: none;
		width: calc(100% - 10px);
		height: 100%;
		border-radius: 5px;
	}

	value {
		grid-column: 3;
		grid-row: 1 / span 2;
		height: calc(100% - 8px);
		margin-right: 8px;
		overflow: auto;
	}
	h3 {
		color: var(--color-bg-add-band);
		margin: 0;
	}

	track-header {
		display: flex;
		align-items: center;
		border-top: 1px solid var(--color-text-0);
		padding: 0;
		width: 100%;
	}

	track-header.first {
		border-top: none;
	}

	button {
		background-color: var(--color-bg-add-band);
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
		width: 30px;
		height: 30px;
		min-width: 30px;
		min-height: 30px;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	track-art > button {
		position: absolute;
		bottom: 52px;
		right: -8px;
	}

	banner-art > button {
		position: relative;
		bottom: 30px;
		left: 442px;
	}

	button.audio-upload {
		position: absolute;
		right: -2px;
	}

	.delete {
		font-size: 1.5em;
		color: var(--color-bg-delete);
		background-color: transparent;
		box-shadow: none;
		bottom: 1px;
	}

	.hide {
		display: none;
	}
</style>
