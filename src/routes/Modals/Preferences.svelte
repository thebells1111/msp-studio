<script>
	let url = '';
	let name = '';
	let secret = '';

	async function saveWP() {
		console.log(url);
		console.log(name);
		console.log(secret);

		fetch('/api/database/save-wp', {
			method: 'POST',
			body: JSON.stringify({ url: url, name: name, secret: secret })
		});
	}
</script>

<label>
	<p>WordPress Website Link:</p>
	<input type="text" bind:value={url} />
</label>

<label>
	<p>WordPress Username:</p>
	<input type="text" bind:value={name} />
</label>
<label>
	<p>WordPress Application Password:</p>
	<input type="text" bind:value={secret} />
</label>

<button on:click={saveWP}>Save WordPress Credentials</button>
