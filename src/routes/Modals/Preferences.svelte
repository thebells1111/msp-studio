<script>
	import { currentModal } from '$/stores';
	let url = '';
	let name = '';
	let secret = '';
	let displayText = '';

	async function saveWP() {
		let res = await fetch('/api/database/save-wp', {
			method: 'POST',
			body: JSON.stringify({ url: url, name: name, secret: secret })
		});
		let data = await res.json();
		console.log(data);

		if (data.wpCreds) {
			displayText = 'Credentials Successfully Added';
			setTimeout(() => {
				$currentModal = '';
			}, 1500);
		}
	}
</script>

{#if displayText}
	<h1>{displayText}</h1>
{:else}
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
{/if}

<style>
	h1 {
		color: red;
		text-align: center;
	}
</style>
