<script>
	import SmallModal from '../Modals/SmallModal.svelte';

	export let showLoginInputs = false;
	export let isRegistered = false;

	import { remoteServer } from '$/stores';

	let email = '';
	let password = '';
	let registerError = '';

	async function saveCredentials(e) {
		e.preventDefault();
		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/msp/register', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data);
		if (data?.status === 'success') {
			isRegistered = true;
			showLoginInputs = true;
		}
		if (data?.status === 'error') {
			registerError = data.message;
		}
	}
</script>

<p>Please provide an email and password for future log in.</p>
<p>A valid email is required for password recovery.</p>
<form on:submit={saveCredentials}>
	<input type="email" bind:value={email} placeholder="E-mail" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={saveCredentials}>Register</button>
</form>
<button
	class="login"
	on:click={() => {
		showLoginInputs = true;
	}}
>
	--click here to log in--
</button>
{#if registerError}
	<h3>{registerError}</h3>
{/if}

<style>
	p {
		margin: 0;
		padding: 0;
		text-align: center;
	}
	input {
		width: calc(100% - 12px);
		margin: 4px 0;
	}
	button {
		width: 100%;
		margin: 4px 0;
	}

	button.login {
		background-color: transparent;
		font-size: 0.9em;
	}

	h3 {
		text-align: center;
	}
</style>
