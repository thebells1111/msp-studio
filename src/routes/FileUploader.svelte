<script>
	let fileInput;
	let files;
	let avatar;
	let results;
	function upload() {
		const formData = new FormData();
		formData.append('file', files[0]);

		console.log(files[0]);

		const upload = fetch(`api/fileupload?`, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.text())
			.then((result) => {
				console.log('Success:', result);
				// fileUrl = JSON.parse(result);
				// isUploading = false;
				// files = undefined;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	function getBase64(image) {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			console.log(e.target);
			avatar = e.target.result;
			uploadFunction(e.target.result);
		};
	}

	async function uploadFunction(imgBase64) {
		const data = {};
		const imgData = imgBase64.split(',');
		data['image'] = imgData[1];
		console.log(data);
		let res = await fetch(`api/fileupload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(data)
		});
		results = await res.text();
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
