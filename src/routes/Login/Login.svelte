<script>
	import SmallModal from '../Modals/SmallModal.svelte';
	import Register from './Register.svelte';

	export let showLoginModal = false;

	import { remoteServer, loggedIn } from '$/stores';

	let email = '';
	let password = '';
	let loginError = '';

	let showLoginInputs = true;

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
			<button
				class="register"
				on:click={() => {
					showLoginInputs = false;
				}}
			>
				--click here to register for new account--
			</button>
			{#if loginError}
				<h3>{loginError}</h3>
			{/if}
		{:else}
			<Register bind:showLoginInputs />
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
</style>
