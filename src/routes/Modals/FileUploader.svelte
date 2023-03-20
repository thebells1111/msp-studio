<script>
	let fileInput;
	let files;
	let avatar;
	let results;
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
	<button on:click={() => fileInput.click()}>Upload</button>
</div>

{@html results}
