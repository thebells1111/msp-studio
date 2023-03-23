<script>
	import LinearProgress from '@smui/linear-progress';
	import 'svelte-material-ui/bare.css';
	let files;
	let isHighlighted = false;
	let warning = false;
	let isUploading = false;
	let displayText = 'Drag and drop a file here or click to select a file';
	let timerText = '0:00';
	let startTime = '';
	let fileName;
	let fileInput;

	import {
		uploadCB,
		currentModal,
		uploadFileType,
		uploadFileText,
		feedFile,
		selectedAlbum,
		selectedTrack
	} from '$/stores';

	function msToTime(ms) {
		// Convert milliseconds to seconds
		let seconds = Math.floor(ms / 1000);

		// Calculate minutes and remaining seconds
		let minutes = Math.floor(seconds / 60);
		let remainingSeconds = seconds % 60;

		// Format the minutes section
		let formattedMinutes = minutes === 0 ? '0' : minutes.toString().replace(/^0+/, '');

		// Pad the remaining seconds with a leading zero if necessary
		let formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

		// Combine minutes and seconds in mm:ss format
		return `${formattedMinutes}:${formattedSeconds}`;
	}

	function setTimerText() {
		let timeNow = new Date().getTime();
		timerText = msToTime(timeNow - startTime);
		setTimeout(setTimerText, 1000);
	}

	function getFileExtension(filename) {
		const dotPosition = filename.lastIndexOf('.');
		if (dotPosition === -1 || dotPosition === 0) {
			return '';
		}
		const extension = filename.substring(dotPosition + 1);
		return extension;
	}

	function uploadFile() {
		const file = files[0];
		const extension = getFileExtension(file.name);
		console.log(file);

		let allowedExtensions = [];
		console.log($uploadFileType);

		if ($uploadFileType === 'audio') {
			allowedExtensions = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'];
			fileName = `${$selectedAlbum.title}_${$selectedTrack.title}.${extension}`;
		}

		if ($uploadFileType === 'image') {
			allowedExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

			if ($uploadFileText === 'Upload Album Image') {
				fileName = `${$selectedAlbum.title}_artwork.${extension}`;
			}
			if ($uploadFileText === 'Upload Track Image') {
				fileName = `${$selectedAlbum.title}_${$selectedTrack.title}_artwork.${extension}`;
			}
		}

		if ($uploadFileType === 'feed') {
			allowedExtensions = ['application/xml', 'text/xml'];
			fileName = `${$selectedAlbum.title}.xml`;
		}

		if (allowedExtensions.includes(file.type)) {
			displayText = 'Uploading File';
			isUploading = true;
			startTime = new Date().getTime();
			setTimeout(setTimerText, 1000);
			warning = false;
			console.log;
			const formData = new FormData();
			formData.append('file', file, fileName);

			fetch('api/fileupload')
				.then((response) => response.json())
				.then(async (result) => {
					const mediaEndpoint = result.url.replace(/\/+$/, '') + '/wp-json/wp/v2/media';

					// Check if the file already exists in WordPress
					return fetch(`${mediaEndpoint}?search=${fileName}`)
						.then((response) => response.json())
						.then((data) => {
							if (data.length > 0) {
								const mediaId = data[0].id;
								return fetch(`${mediaEndpoint}/${mediaId}`, {
									method: 'PUT',
									body: formData,
									headers: {
										Authorization:
											'Basic ' + window.btoa(`${result.name}:${result.secret}`).toString('base64'),
										'Content-Disposition': `attachment; filename="${fileName}"`
									}
								});
							} else {
								return fetch(mediaEndpoint, {
									method: 'POST',
									body: formData,
									headers: {
										Authorization:
											'Basic ' + window.btoa(`${result.name}:${result.secret}`).toString('base64'),
										'Content-Disposition': `form-data; filename="${fileName}"`
									}
								});
							}
						});
				})
				.then(async (response) => {
					if (response.ok) {
						const jsonData = await response.json();
						$uploadCB(jsonData.source_url);
						$currentModal = '';
						isUploading = false;
					} else {
						isUploading = false;
						displayText = `Failed to upload file to WordPress: ${response.status} ${
							response.statusText
						} ${JSON.stringify(response)}`;
						warning = true;
					}
				})
				.catch((error) => {
					isUploading = false;
					console.error('Error:', error);
					displayText = 'Error: ' + error;
				});
		} else {
			displayText = `Invalid file type. Please upload an ${$uploadFileType} file.`;
			warning = true;
		}
	}

	function handleDrop(e) {
		isHighlighted = false;
		files = e.dataTransfer.files;
		uploadFile();
	}

	if ($uploadFileType === 'feed') {
		const blob = new Blob([$feedFile], { type: 'application/xml' });
		const file = new File([blob], `${$selectedAlbum.title}.xml`, { type: 'application/xml' });
		files = [file];
		uploadFile();
	}
</script>

<h1>
	{$uploadFileText}
</h1>

{#if isUploading}
	<uploading>
		<LinearProgress indeterminate class="upload-progress-bar" />
		<h2>Uploading File</h2>
		<h3>upload time: {timerText}</h3>
		<p>depending on the size of the file, this can take a few minutes</p>
	</uploading>
{:else}
	<input
		type="file"
		accept=".png, .jpg, .mp3, .wav, .ogg, .aac, .flac, .gif, .webp"
		bind:files
		bind:this={fileInput}
		on:change={uploadFile}
		hidden
	/>
	<div
		class="dropzone"
		id="dropzone"
		class:highlight={isHighlighted}
		on:dragenter|preventDefault={() => (isHighlighted = true)}
		on:dragover|preventDefault={() => (isHighlighted = true)}
		on:dragleave|preventDefault={() => (isHighlighted = false)}
		on:drop|preventDefault={handleDrop}
		on:click={() => fileInput.click()}
	>
		<span class:warning>{displayText}</span>
	</div>
{/if}

<style>
	uploading {
		display: flex;
		flex-direction: column;
		height: 100%;
		align-items: center;
		position: relative;
		margin-top: 100px;
	}
	h2 {
		text-align: center;
		font-weight: 600;
	}

	h3,
	p {
		font-weight: 500;
		margin: 0;
	}

	input {
		width: calc(100% - 16px);
		border-radius: 5px;
		cursor: pointer;
	}
	.dropzone {
		border: 2px dashed #0087f7;
		border-radius: 5px;
		padding: 200px 0;
		text-align: center;
		margin: 32px;
		cursor: pointer;
	}

	.highlight {
		background-color: rgba(0, 135, 247, 0.1);
	}

	.warning {
		color: red;
		font-weight: 600;
	}

	h1 {
		margin-top: 0;
	}
</style>
