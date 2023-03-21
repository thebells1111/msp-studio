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

	import { uploadCB, currentModal } from '$/stores';

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

	function uploadFile() {
		const file = files[0];
		console.log(files[0]);
		const allowedExtensions = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'audio/mp3',
			'audio/mpeg'
		];

		if (allowedExtensions.includes(file.type)) {
			displayText = 'Uploading File';
			isUploading = true;
			startTime = new Date().getTime();
			setTimeout(setTimerText, 1000);
			warning = false;
			const formData = new FormData();
			formData.append('file', file);

			fetch('api/fileupload')
				.then((response) => response.json())
				.then(async (result) => {
					const mediaEndpoint = result.url.replace(/\/+$/, '') + '/wp-json/wp/v2/media';
					let filename;

					for (const entry of formData.entries()) {
						if (entry[0] === 'file') {
							filename = entry[1].name;
							break;
						}
					}

					const response = await fetch(mediaEndpoint, {
						method: 'POST',
						body: formData,
						headers: {
							Authorization:
								'Basic ' + window.btoa(`${result.name}:${result.secret}`).toString('base64'),
							'Content-Disposition': `form-data; filename="${filename}"`
						}
					});

					if (response.ok) {
						const jsonData = await response.json();
						$uploadCB(jsonData.source_url);
						console.log(jsonData);
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
			displayText = 'Invalid file type. Please upload an image or an mp3 file.';
			warning = true;
		}
	}

	function handleDrop(e) {
		isHighlighted = false;
		files = e.dataTransfer.files;
		uploadFile();
	}
</script>

{#if isUploading}
	<uploading>
		<LinearProgress indeterminate class="upload-progress-bar" />
		<h2>Uploading File</h2>
		<h3>upload time: {timerText}</h3>
		<p>depending on the size of the file, this can take a few minutes</p>
	</uploading>
{:else}
	<input
		id="file-to-upload"
		type="file"
		accept=".png,.jpg, .mp3"
		bind:files
		on:change={uploadFile}
	/>
	<div
		class="dropzone"
		id="dropzone"
		class:highlight={isHighlighted}
		on:dragenter|preventDefault={() => (isHighlighted = true)}
		on:dragover|preventDefault={() => (isHighlighted = true)}
		on:dragleave|preventDefault={() => (isHighlighted = false)}
		on:drop|preventDefault={handleDrop}
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
		justify-content: center;
		position: relative;
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
	}

	.highlight {
		background-color: rgba(0, 135, 247, 0.1);
	}

	.warning {
		color: red;
		font-weight: 600;
	}
</style>
