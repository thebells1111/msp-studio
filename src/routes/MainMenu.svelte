<script>
	import { slide, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import AccountIcon from './icons/Account.svelte';
	import Tutorial from './Tutorial/Tutorial.svelte';
	import { dev } from '$app/environment';

	import { user, showTutorial } from '$/stores';

	let expandMenu = false;
	$showTutorial = false;
	let tutorialClicked = false; //change to false

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

	$: if ($showTutorial) {
		tutorialClicked = true;
	}
</script>

<nav>
	<a href="/">Home</a>
	<a href="/importfeed">Import Feed</a>
	<button
		on:click={() => {
			$showTutorial = true;
		}}>Tutorial</button
	>

	<a href="https://t.me/self_hosters" target="_blank" rel="noopener noreferrer">Help</a>

	<!-- <button
		on:click={() => {
			expandMenu = true;
		}}
	>
		<AccountIcon size="40" />
	</button> -->
</nav>

{#if expandMenu}
	<container
		on:click={() => {
			expandMenu = false;
		}}
	>
		<menu>
			<account-button-hover />
			<ul transition:slide|global={{ duration: 200 }}>
				{#if $user.loggedIn}
					<li on:click={logout}>Log Out</li>
				{:else}
					<li on:click={gotoAlby}>Log In</li>
				{/if}
			</ul>
		</menu>
	</container>
{/if}

<tutorial class:show={$showTutorial} class:hide={!tutorialClicked}>
	<Tutorial />
</tutorial>

<style>
	nav {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 44px;
	}
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
		color: var(--color-text-0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		z-index: 33;
		position: relative;
		background-color: transparent;
	}

	a {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 16px;
		text-decoration: none;
		font-weight: 600;
		color: var(--color-text-0);
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

	tutorial {
		display: block;
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0;
		right: 0;
		z-index: 50;
		overflow: hidden;
		animation: slide-out 0.333s forwards;
		z-index: 40;
	}

	tutorial.show {
		animation: slide-in 0.333s;
	}

	tutorial.hide {
		display: none;
	}

	@keyframes slide-in {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0);
		}
	}

	@keyframes slide-out {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
