<script>
	import { onMount } from 'svelte';

	import { remoteServer } from '$/stores';

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
	};
</script>

<form on:submit|preventDefault={updatePassword}>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={oldPassword} placeholder="Old Password" />
	<input type="password" bind:value={newPassword} placeholder="New Password" />
	<input type="password" bind:value={newPasswordCheck} placeholder="Confirm New Password" />
	<button type="submit">Update Password</button>
</form>
