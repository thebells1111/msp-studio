<script>
	// Script
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	export let form;

	async function handleSubmit(event) {
		const data = new FormData(event.currentTarget);
		const requestOptions = {
			method: 'POST',
			body: data,
			headers: new Headers()
		};
		const upload = fetch('?/login', requestOptions);

		upload.then(async (response) => {
			const result = deserialize(await response.text());
			console.log(result);
			// Handle server response
		});
	}
</script>

<!-- HTML -->
<form action="?/login" method="post" on:submit|preventDefault={handleSubmit}>
	<input type="file" name="file" />
	<button type="submit">Send</button>
</form>

<style>
	progress {
		width: 100%;
	}
</style>
