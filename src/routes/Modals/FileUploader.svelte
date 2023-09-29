<script>
	import { remoteServer } from '$/stores';
	import Close from '../icons/Close.svelte';
	import { deserialize } from '$app/forms';

	export let filePath;
	export let fileName = '';
	export let folderName = '';
	export let type = '';
	export let showModal;
	export let fileReload;
	let warning = '';

	function getFileType(fileType) {
		if (fileType.startsWith('image/') && type === 'image') return 'image';
		if (fileType.startsWith('audio/') && type === 'audio') return 'audio';
		if ((fileType === 'application/xml' || fileType === 'text/xml') && type === 'xml') return 'xml';

		if (
			(fileType === 'application/x-subrip' || fileType === 'application/srt') &&
			type === 'lyrics'
		)
			return 'lyrics';

		if (fileType === 'application/json' && type === 'chapters') return 'chapters';

		if (type === 'image') warning = 'Please upload an image.';
		if (type === 'audio') warning = 'Please upload an mp3.';
		if (type === 'lyrics') warning = 'Please upload an srt file.';
		if (type === 'chapters') warning = 'Please upload a chapters json file.';

		return null;
	}

	async function uploadFile(file) {
		const fileExtension = file.name.split('.').pop();
		let fileType;
		if (fileExtension === 'srt' && !file.type) {
			fileType = getFileType('application/x-subrip');
		} else {
			fileType = getFileType(file.type);
		}

		const data = new FormData();
		data.append('file', file);

		if (!fileType) return;
		const baseUrl = remoteServer ? remoteServer + '/api/upload' : '/api/upload';
		const queryParams = new URLSearchParams({
			fileName: fileName,
			folderName: folderName,
			fileType: fileType
		}).toString();

		const fullUrl = `${baseUrl}?${queryParams}`;

		const response = await fetch(fullUrl, {
			method: 'POST',
			body: data
		});
		const result = await response.json();
		if (type === 'audio') {
			filePath = {
				'@_url': result.path,
				'@_type': file.type,
				'@_length': file.size
			};
		} else {
			filePath = result.path;
		}
		fileReload = Date.now();
		showModal = false;
	}

	async function handleDrop(event) {
		event.preventDefault();
		const files = event.dataTransfer.files;
		for (const file of files) {
			await uploadFile(file);
		}
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	async function handleFileInput(event) {
		const files = event.target.files;
		for (const file of files) {
			await uploadFile(file);
		}
	}
</script>

<blurred-background
	on:click={() => {
		showModal = false;
	}}
>
	<button
		class="close upload-modal"
		on:click={() => {
			showModal = false;
		}}
	>
		<Close size="24" />
	</button>
	<warning-modal>
		<div on:drop={handleDrop} on:dragover={handleDragOver}>
			<h3>{warning}</h3>
			<p>Drop file here</p>
			<p>-or-</p>
			<input type="file" on:change={handleFileInput} multiple />
		</div>
	</warning-modal>
</blurred-background>

<style>
	h3 {
		color: red;
		position: absolute;
		top: 40px;
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

	warning-modal {
		backdrop-filter: blur(50px);
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		width: calc(100% - 100px);
		height: calc(100% - 100px);
	}

	div {
		border: 2px dashed #ccc;
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	p:first-of-type {
		font-size: 1.2em;
		font-weight: 600;
	}

	.close {
		position: fixed;
		margin: 0;
		background-color: var(--color-bg-select-band);
		color: rgba(255, 255, 255, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		top: 32px;
		right: 32px;
		z-index: 33;
	}

	@media screen and (max-width: 992px) {
		.close {
			top: 4px;
			right: 4px;
		}

		warning-modal {
			width: calc(100%);
			height: calc(100%);
		}
	}
</style>
