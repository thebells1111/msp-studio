<script>
	import FileUploader from './FileUploader.svelte';

	import { editingFeed, loggedIn, settings } from '$/stores';

	export let imageReload = '';
	export let imageParent = 'album';
	let imageType;

	let imageProps = {
		albumSquare: {
			filePath: $editingFeed['itunes:image']['@_href'],
			fileName: 'album-art',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Art'
		},
		albumBanner: {
			filePath: $editingFeed['itunes:image']['@_href'],
			fileName: 'album-banner',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Background Banner'
		}
	};

	$: currentProps = imageProps[imageType];

	$: showFileUpload = $loggedIn && $settings?.bunny?.active;
</script>

{#if imageType}
	<h1>
		{currentProps.uploadText}
	</h1>
	<label>
		<p>Image Url</p>
		<input
			class="art-upload"
			class:bottom-space={!showFileUpload}
			bind:value={currentProps.filePath}
			placeholder="enter link to image file"
		/>
	</label>

	{#if showFileUpload}
		<FileUploader
			bind:filePath={currentProps.filePath}
			bind:fileReload={imageReload}
			fileName={currentProps.fileName}
			folderName={currentProps.folderName}
			type="image"
		/>
	{/if}
{:else}
	<art-selector>
		<button
			on:click={() => {
				imageType = imageParent === 'album' ? 'albumSquare' : 'songSquare';
			}}
		>
			Upload {imageParent === 'album' ? 'Album' : 'Song'} Art
		</button>
		<button
			on:click={() => {
				imageType = imageParent === 'album' ? 'albumBanner' : 'songBanner';
			}}
		>
			Upload {imageParent === 'album' ? 'Album' : 'Song'} Background Banner
		</button>
	</art-selector>
{/if}

<style>
	art-selector {
		display: flex;
		flex-direction: column;
	}

	art-selector > button {
		margin-bottom: 16px;
	}
	.bottom-space {
		margin-bottom: 16px;
	}
	input {
		width: calc(100% - 14px);
		max-width: calc(100vw - 14px);
		min-width: 320px;
		margin-left: 2px;
	}

	h1 {
		margin-top: 0;
	}

	p {
		margin: 0;
		padding: 0;
	}
</style>
