<script>
	import { uploadFileToWordPress } from './wordpress-utils.js';

	let file;

	async function handleSubmit(event) {
		event.preventDefault();
		const response = await uploadFileToWordPress(file);
		console.log('Uploaded file:', response);
	}
</script>

<form on:submit={handleSubmit}>
	<label>
		Select a file to upload:
		<input type="file" on:change={(event) => (file = event.target.files[0])} />
	</label>
	<button type="submit">Upload</button>
</form>
