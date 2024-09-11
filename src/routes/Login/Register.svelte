<script>
	import SmallModal from '../Modals/SmallModal.svelte';

	export let showRegisterModal = false;

	import { remoteServer } from '$/stores';

	let email = '';
	let password = '';
	let registerError = '';

	const saveCredentials = async () => {
		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/msp/register', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data);
		if (data?.status === 'error') {
			registerError = data.message;
		}
	};
</script>

<SmallModal closeModal={() => (showRegisterModal = false)}>
	<p>Please provide a email and password for future log in.</p>
	<p>A valid email is required for password recovery.</p>
	<input type="email" bind:value={email} placeholder="E-mail" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={saveCredentials}>Register</button>
	{#if registerError}
		<h3>{registerError}</h3>
	{/if}
</SmallModal>

<style>
	div {
		display: flex;
		flex-direction: column;
		margin: 20px 128px;
		align-items: center;
	}

	p {
		margin: 0;
		padding: 0;
	}
	input {
		width: calc(100% - 8px);
		margin: 4px 0;
	}
	button {
		width: 100%;
		margin: 4px 0;
	}

	@media (max-width: 799px) {
		div {
			margin: 20px 8px;
		}
	}
</style>
