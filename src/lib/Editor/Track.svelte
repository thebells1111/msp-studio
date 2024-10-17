<script>
	import ValueBlock from '$lib/ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from './ExplicitToggle.svelte';
	import FileUploader from './FileUploader.svelte';
	import SmallModal from '../Modals/SmallModal.svelte';
	import UploadFileIcon from '$icons/UploadFile.svelte';
	import DeleteIcon from '$icons/Delete.svelte';
	import ArtUpload from './ArtUpload.svelte';

	import clone from 'just-clone';

	import { newTrack, editingFeed, feeds, catalogDB } from '$/stores';

	let updateTimeout;

	function updateFeeds() {
		$editingFeed = $editingFeed;
	}

	export let track = clone($newTrack);
	export let trackNumber = 1;

	let imageReload = 1;
	let audioReload = 1;
	let showUpload = false;
	let uploadType = 'image';

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
</script>

<container>
	<track-header class:first={trackNumber === 1}>
		<h3>Track #{trackNumber}</h3>
		<button class="delete" on:click={deleteTrack}>
			<DeleteIcon />
		</button>
	</track-header>
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
		<artwork
			on:click={() => {
				showUpload = true;
				uploadType = 'image';
			}}
		>
			<h4>Track Art</h4>
			<img src={track['itunes:image']['@_href']} alt="track art - click to edit" />
			<button class="image-upload">
				<UploadFileIcon size="20" />
			</button>
		</artwork>
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
			<ArtUpload bind:imageReload imageParent="track" {track} {trackNumber} />
		{/if}
	</SmallModal>
{/if}

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
	}
	ul {
		display: flex;
		justify-content: space-between;
		height: 18px;
		align-items: center;
		padding: 0 8px;
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
		display: flex;
		width: 100%;
		height: 300px;
		margin-top: 8px;
		padding: 0 8px;
		margin-bottom: 8px;
	}

	artwork {
		display: flex;
		flex-direction: column;
		width: 150px;
	}

	img {
		cursor: pointer;
		height: 150px;
		width: 150px;
		border: 1px solid black;
		border-radius: 5px;
	}

	h3 {
		color: var(--color-bg-add-band);
		margin: 0;
	}

	track-header {
		display: flex;
		align-items: center;
		border-top: 1px solid var(--color-text-0);
		padding: 0 8px;
		width: 100%;
	}

	track-header.first {
		border-top: none;
	}
	h4 {
		margin: 0 8px;
		text-align: left;
		width: 100%;
	}

	description {
		display: block;
		width: calc((100% - 150px) / 2);
		display: flex;
		flex-direction: column;
		margin: 0 4px 0 8px;
	}

	textarea {
		resize: none;
		height: 100%;
		border-radius: 5px;
		margin: 0 4px;
	}

	value {
		display: block;
		width: calc((100% - 150px) / 2);
	}

	button {
		width: 30px;
		min-width: 30px;
		height: 30px;
		min-height: 30px;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		background-color: var(--color-bg-add-band);
	}

	button.image-upload {
		bottom: 30px;
		left: 121px;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
	}

	button.audio-upload {
		position: absolute;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
		right: -2px;
	}

	.delete {
		font-size: 1.5em;
		color: var(--color-bg-delete);
		background-color: transparent;
		bottom: 1px;
	}
</style>
