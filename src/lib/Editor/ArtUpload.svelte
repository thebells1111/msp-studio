<script>
	import FileUploader from './FileUploader.svelte';

	import { editingFeed, loggedIn, settings } from '$/stores';

	export let imageReload = '';
	export let imageParent = 'album';
	export let track = null;
	export let trackNumber = 1;
	export let imageType = null;

	let imageProps = {
		albumSquare: {
			filePath: $editingFeed['itunes:image']['@_href'],
			fileName: 'album-art',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Art',
			update: (e) => {
				$editingFeed['itunes:image']['@_href'] = e.target.value;
				imageProps.albumSquare.filePath = e.target.value;
			}
		},
		albumBanner: {
			filePath: $editingFeed['podcast:aspectImages'].find((v) => v['@_aspect-ratio'] === '6/1')[
				'@_src'
			],
			fileName: 'album-banner',
			folderName: $editingFeed['podcast:guid'],
			uploadText: 'Album Banner 6:1',
			update: (event) => {
				let image = $editingFeed['podcast:aspectImages'].find((v) => v['@_aspect-ratio'] === '6/1');
				console.log(image);
				image['@_src'] = event.target.value;
				console.log(image);
				imageProps.albumBanner.filePath = event.target.value;
				console.log(imageProps);

				$editingFeed = $editingFeed;
			}
		},
		trackSquare: track
			? {
					filePath: track?.['itunes:image']['@_href'],
					fileName: 'track-art',
					folderName: $editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid,
					uploadText: `Track ${trackNumber} Art`,
					update: (e) => {
						track['itunes:image']['@_href'] = e.target.value;
						imageProps.trackSquare.filePath = e.target.value;
						$editingFeed = $editingFeed;
					}
			  }
			: {},
		trackBanner: track
			? {
					filePath: track['podcast:aspectImages'].find((v) => v['@_aspect-ratio'] === '6/1')[
						'@_src'
					],
					fileName: 'track-banner',
					folderName: $editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid,
					uploadText: `Track ${trackNumber} Banner 6:1`,
					update: (event) => {
						let image = track['podcast:aspectImages'].find((v) => v['@_aspect-ratio'] === '6/1');
						image['@_src'] = event.target.value;
						imageProps.trackBanner.filePath = event.target.value;

						$editingFeed = $editingFeed;
						console.log($editingFeed);
						// updateBanner({ event, propObj: imageProps.trackBanner, parent: track });
					}
			  }
			: {}
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
{/if}

<style>
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
