<script>
	import LinearProgress from '@smui/linear-progress';
	import 'svelte-material-ui/bare.css';

	export let filePath;
	export let fileReload;
	export let folderName;
	export let fileName;
	export let type;
	export let uploadText;
	export let handleUpdate = () => {};
	let files;
	let isHighlighted = false;
	let warning = false;
	let isUploading = false;
	let displayText = 'Drag and drop a file here or click to select a file';
	let timerText = '0:00';
	let startTime = '';
	let fileInput;

	import { onMount } from 'svelte';

	let selectedFile = null;
	let uploadProgress = 0;
	let uploadStatus = '';

	// Function to upload the selected image to the server
	async function uploadFile(event) {
		const selectedFile = event.target.files[0];
		if (!selectedFile) {
			uploadStatus = 'Please select an image to upload.';
			return;
		}

		const formData = new FormData();
		const extension = getFileExtension(selectedFile.name);
		let allowedExtensions = [];

		// Ensure folderName, fileName, and type are defined and valid
		if (!folderName) {
			console.error('Folder name is undefined.');
			return;
		}

		if (!fileName) {
			console.error('File name is undefined.');
			return;
		}

		('https://songs-for-young-lovers.b-cdn.net/210f0659-fc61-5211-8a15-73729f19d55d%2F5fbdcc1b-21ac-5e21-981c-ccdc377c4475%2Ftrack-art.jpg');

		if (!type) {
			console.error('File type is undefined.');
			return;
		}

		// Append common fields
		formData.append('folderName', folderName); // Make sure `folderName` is defined
		formData.append('user', 'StevenB'); // You might want to make this dynamic
		formData.append('fileName', `${fileName}.${extension}`); // Constructed file name

		// Determine allowed extensions and set `file` field
		if (type === 'audio') {
			allowedExtensions = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'];
		} else if (type === 'image') {
			allowedExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		} else if (type === 'feed') {
			allowedExtensions = ['application/xml', 'text/xml'];
		} else {
			uploadStatus = 'Unsupported file type.';
			return;
		}

		// Validate file type
		if (!allowedExtensions.includes(selectedFile.type)) {
			uploadStatus = `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`;
			return;
		}

		// Log the file name for debugging
		console.log('Uploading file with name:', formData.get('fileName'));

		uploadStatus = 'Uploading...';
		uploadProgress = 0; // Assuming `uploadProgress` is used elsewhere to show progress

		try {
			// Add the file field last
			formData.append('file', selectedFile); // Use a generic `file` field for all types

			const response = await fetch(`${remoteServer}/api/bunny/uploadimage`, {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Upload failed.');
			}

			const result = await response.json();
			uploadStatus = 'Upload successful!';
			console.log('Uploaded:', result);
			if (result.url) {
				filePath = result.url;
				fileReload = new Date().getTime();
				handleUpdate({ target: { value: result.url } });
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadStatus = 'Upload failed. Please try again.';
		}
	}

	// Function to handle real-time progress updates from the server
	onMount(() => {});

	import { uploadFileText, wpFeedUrl, remoteServer } from '$/stores';

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

	// function uploadFile() {

	// 		displayText = 'Uploading File';
	// 		isUploading = true;
	// 		startTime = new Date().getTime();
	// 		setTimeout(setTimerText, 1000);
	// 		warning = false;
	// 		const formData = new FormData();
	// 		formData.append('file', file, fileName);
	// 		console.log($wpFeedUrl);
	// 		fetch('api/fileupload', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({ url: $wpFeedUrl })
	// 		})
	// 			.then((response) => response.json())
	// 			.then(async (result) => {
	// 				const mediaEndpoint = result.url.replace(/\/+$/, '') + '/wp-json/wp/v2/media';

	// 				// Check if the file already exists in WordPress
	// 				return fetch(`${mediaEndpoint}?search=${fileName}`)
	// 					.then((response) => response.json())
	// 					.then((data) => {
	// 						console.log(data);
	// 						if (data.length > 0) {
	// 							const mediaId = data[0].id;
	// 							return fetch(`${mediaEndpoint}/${mediaId}`, {
	// 								method: 'PUT',
	// 								body: formData,
	// 								headers: {
	// 									Authorization:
	// 										'Basic ' + window.btoa(`${result.name}:${result.secret}`).toString('base64'),
	// 									'Content-Disposition': `attachment; filename="${fileName}"`
	// 								}
	// 							});
	// 						} else {
	// 							return fetch(mediaEndpoint, {
	// 								method: 'POST',
	// 								body: formData,
	// 								headers: {
	// 									Authorization:
	// 										'Basic ' + window.btoa(`${result.name}:${result.secret}`).toString('base64'),
	// 									'Content-Disposition': `form-data; filename="${fileName}"`
	// 								}
	// 							});
	// 						}
	// 					});
	// 			})
	// 			.then(async (response) => {
	// 				if (response.ok) {
	// 					const jsonData = await response.json();
	// 					$uploadCB(jsonData.source_url);
	// 					$currentModal = '';
	// 					isUploading = false;
	// 				} else {
	// 					isUploading = false;
	// 					displayText = `Failed to upload file to WordPress: ${response.status} ${
	// 						response.statusText
	// 					} ${JSON.stringify(response)}`;
	// 					warning = true;
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				isUploading = false;
	// 				console.error('Error:', error);
	// 				displayText = 'Error: ' + error;
	// 			});
	// 	} else {
	// 		displayText = `Invalid file type. Please upload an ${type} file.`;
	// 		warning = true;
	// 	}
	// }

	// function handleDrop(e) {
	// 	isHighlighted = false;
	// 	files = e.dataTransfer.files;
	// 	uploadFile();
	// }

	// if (type === 'feed') {
	// 	const blob = new Blob([$feedFile], { type: 'application/xml' });
	// 	const file = new File([blob], `${$selectedAlbum.title}.xml`, { type: 'application/xml' });
	// 	files = [file];
	// 	uploadFile();
	// }

	function handleDrop() {}
</script>

{#if uploadText}
	<h1>
		{uploadText}
	</h1>
{/if}

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
		padding: 200px 20px;
		text-align: center;
		margin: 16px 0;
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

	.feed-url {
		cursor: pointer;
	}
</style>
