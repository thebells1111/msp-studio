<script>
	import FileUploader from './FileUploader.svelte';

	import { editingFeed, loggedIn, settings } from '$/stores';

	export let imageReload = '';
	export let imageParent = 'album';
	export let track = null;
	export let trackNumber = 1;
	let imageType;

	let imageProps = {
		albumSquare: {
			filePath: $editingFeed['itunes:image']['@_href'],
			fileName: 'album-art',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Art',
			update: (e) => {
				console.log(e.target.value);
				$editingFeed['itunes:image']['@_href'] = e.target.value;
				imageProps.albumSquare.filePath = $editingFeed['itunes:image']['@_href'];
			}
		},
		albumBanner: {
			filePath: $editingFeed['itunes:image']['@_href'],
			fileName: 'album-banner',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Background Banner'
		},
		trackSquare: track
			? {
					filePath: track?.['itunes:image']['@_href'],
					fileName: 'track-art',
					folderName: $editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid,
					uploadText: `Track ${trackNumber} Art`,
					update: (e) => {
						track['itunes:image']['@_href'] = e.target.value;
						imageProps.trackSquare.filePath = track['itunes:image']['@_href'];
						$editingFeed = $editingFeed;
					}
			  }
			: {},
		trackBanner: track
			? {
					filePath: track['itunes:image']['@_href'],
					fileName: 'track-art',
					folderName: $editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid,
					uploadText: `Track ${trackNumber} Art`,
					update: (e) => {
						track['itunes:image']['@_href'] = e.target.value;
						imageProps.trackSquare.filePath = track['itunes:image']['@_href'];
						console.log(track);
						$editingFeed = $editingFeed;
					}
			  }
			: {}
	};

	$: currentProps = imageProps[imageType];

	$: showFileUpload = $loggedIn && $settings?.bunny?.active;

	$: console.log(imageType);
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
			value={currentProps.filePath}
			on:input={(e) => {
				currentProps.update(e);
			}}
			placeholder="enter link to image file"
		/>
	</label>

	{#if showFileUpload}
		<FileUploader
			bind:filePath={currentProps.filePath}
			bind:fileReload={imageReload}
			fileName={currentProps.fileName}
			folderName={currentProps.folderName}
			handleUpdate={(e) => {
				console.log(currentProps);
				currentProps.update(e);
			}}
			type="image"
		/>
	{/if}
{:else}
	<art-selector>
		<button
			on:click={() => {
				imageType = imageParent === 'album' ? 'albumSquare' : 'trackSquare';
			}}
		>
			Upload {imageParent === 'album' ? 'Album' : 'Song'} Art
		</button>
		<button
			on:click={() => {
				imageType = imageParent === 'album' ? 'albumBanner' : 'trackBanner';
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
