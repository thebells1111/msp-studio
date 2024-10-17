<script>
	import clone from 'just-clone';
	import SmallModal from '../Modals/SmallModal.svelte';
	import Register from './Register.svelte';

	export let showLoginModal = false;

	import { remoteServer, loggedIn, _settings, settings } from '$/stores';

	let email = '';
	let password = '';
	let loginError = '';

	let showLoginInputs = true;
	let isRegistered = false;

	async function sendCredentials(e) {
		e.preventDefault();

		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/msp/login', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data);
		if (data?.status === 'error') {
			loginError = data.message;
		}

		if (data?.status === 'success') {
			$loggedIn = true;
			showLoginModal = false;

			$settings = data.settings || clone(_settings);
		}
	}
</script>

<SmallModal closeModal={() => (showLoginModal = false)}>
	<div>
		{#if showLoginInputs}
			<form on:submit={sendCredentials}>
				<!-- Form element -->
				<input type="email" bind:value={email} name="email" placeholder="E-mail" />
				<input type="password" bind:value={password} name="password" placeholder="Password" />
				<button type="submit">Log In</button>
			</form>
			{#if isRegistered}
				<p>--you are registered, log in to continue--</p>
			{:else}
				<button
					class="register"
					on:click={() => {
						showLoginInputs = false;
					}}
				>
					--click here to register for new account--
				</button>
			{/if}
			{#if loginError}
				<h3>{loginError}</h3>
			{/if}
		{:else}
			<Register bind:showLoginInputs bind:isRegistered />
		{/if}
	</div>
</SmallModal>

<style>
	div {
		width: 400px;

		max-width: calc(100vw - 32px);
	}
	input {
		width: calc(100% - 12px);
		margin: 4px 0;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	button {
		width: calc(100% - 4px);
		margin: 4px auto;
	}

	button.register {
		background-color: transparent;
		font-size: 0.9em;
	}

	h3 {
		text-align: center;
	}

	p {
		margin: 9px auto;
		width: calc(100% - 4px);
		text-align: center;
		font-size: 0.9em;
		font-weight: bold;
		height: 22px;
	}
</style>
