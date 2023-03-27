<script>
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import AccountIcon from './icons/Account.svelte';
	import { dev } from '$app/environment';

	import { user, currentModal } from '$/stores';

	let expandMenu = false;

	function gotoAlby() {
		if (dev) {
			goto(
				'https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000/api/alby/auth&scope=account:read'
			);
		} else {
			goto(
				'https://getalby.com/oauth?client_id=srl5nfxtlh&response_type=code&redirect_uri=https://studio.musicsideproject.com/api/alby/auth&scope=account:read'
			);
		}
	}

	function logout() {
		$user = { loggedIn: false };
		fetch('/api/alby/logout');
	}
</script>

<button
	on:click={() => {
		expandMenu = true;
	}}
>
	<AccountIcon size="40" />
</button>

{#if expandMenu}
	<container
		on:click={() => {
			expandMenu = false;
		}}
	>
		<menu>
			<account-button-hover />
			<ul transition:slide={{ duration: 200 }}>
				{#if $user.loggedIn}
					<li on:click={logout}>Log Out</li>
					<li
						on:click={() => {
							$currentModal = 'preferences';
							expandMenu = false;
						}}
					>
						Preferences
					</li>
				{:else}
					<li on:click={gotoAlby}>Log In</li>
				{/if}
			</ul>
		</menu>
	</container>
{/if}

<style>
	container {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		z-index: 33;
	}

	button {
		background-color: transparent;
		color: var(--color-text-0);
		padding: 0 8px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 8px;
		right: 0;
		z-index: 33;
	}

	account-button-hover {
		display: block;
		width: 56px;
		height: 56px;
		cursor: pointer;
	}
	menu {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		right: 8px;
		margin: 0;
	}

	ul {
		width: 150px;
		background-color: blue;
		padding: 0;
		margin: 0;
		overflow: hidden;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(180deg, var(--color-poster-bg-0) 33%);
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
	}

	li {
		padding: 8px;
		list-style: none;
		width: calc(100% - 16px);
		text-align: end;
		cursor: pointer;
	}
	li:hover {
		background-color: var(--color-poster-bg-1);
	}
</style>
