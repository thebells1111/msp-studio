<script>
	import { remoteServer } from '$/stores';
	export let showResetModal;

	let username = '';
	let oldPassword = '';
	let newPassword = '';
	let newPasswordCheck = '';

	const updatePassword = async () => {
		const response = await fetch(remoteServer + '/api/update-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, oldPassword, newPassword, newPasswordCheck })
		});

		const data = await response.text();
		alert(data);
		if (data === 'Password updated successfully') {
			showResetModal = false;
		}
	};
</script>

<form on:submit|preventDefault={updatePassword}>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={oldPassword} placeholder="Old Password" />
	<input type="password" bind:value={newPassword} placeholder="New Password" />
	<input type="password" bind:value={newPasswordCheck} placeholder="Confirm New Password" />
	<button type="submit">Update Password</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 600px;
		margin: 0 0 16px 0;
	}

	input {
		margin: 8px;
	}

	button {
		margin: 8px;
	}

	@media screen and (max-width: 992px) {
		form {
			width: 100%;
		}
	}
</style>
