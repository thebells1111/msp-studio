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

<!-- <tutorial class:show={$showTutorial} class:hide={!tutorialClicked}>
	<Tutorial />
</tutorial> -->

<style>
	nav {
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
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
</style>
