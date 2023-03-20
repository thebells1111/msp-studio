<script>
	let fileInput;
	let files;

	let fileLocation;

	import { uploadCB, currentModal } from '$/stores';

	function upload() {
		const formData = new FormData();
		formData.append('file', files[0]);

		console.log(files[0]);

		fetch(`api/fileupload?`, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				$uploadCB(result.source_url);
				fileLocation = result.source_url;
				$currentModal = '';
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

<div class="container">
	<input
		class="hidden"
		id="file-to-upload"
		type="file"
		accept=".png,.jpg, .mp3"
		bind:files
		bind:this={fileInput}
		on:change={upload}
	/>
</div>

<p>{fileLocation}</p>
