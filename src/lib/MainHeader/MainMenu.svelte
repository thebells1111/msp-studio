<script>
	import { slide } from 'svelte/transition';
	import clone from 'just-clone';
	import HamburgerIcon from '$icons/Hamburger.svelte';
	import Login from '$lib/Login/Login.svelte';

	import { showTutorial, menuPanel, loggedIn, remoteServer, settings, _settings } from '$/stores';

	let expandMenu = false;
	$showTutorial = false;
	let tutorialClicked = false; //change to false
	let showLoginModal = false;

	function logout() {
		$loggedIn = false;
		$menuPanel = 'albums';
		$settings = clone(_settings);
		fetch(remoteServer + '/api/msp/logout', { method: 'GET', credentials: 'include' });
	}

	$: if ($showTutorial) {
		tutorialClicked = true;
	}

	function selectMenuPanel(menu) {
		$menuPanel = menu;
	}
</script>

<nav>
	<button
		class="menu-icon"
		on:click={() => {
			expandMenu = !expandMenu;
		}}
	>
		<HamburgerIcon size="32" />
	</button>
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
				{#if $loggedIn}
					<li on:click={logout}>Log Out</li>
					<li on:click={selectMenuPanel.bind(this, 'albums')}>Select Albums</li>
					<li on:click={selectMenuPanel.bind(this, 'bunnyCredentials')}>Bunny Credentials</li>
				{:else}
					<li on:click={() => (showLoginModal = true)}>Log In</li>
				{/if}
				<li
					on:click={() => {
						$showTutorial = true;
					}}
				>
					Tutorial
				</li>
				<li>
					<a href="https://t.me/self_hosters" target="_blank" rel="noopener noreferrer">Help</a>
				</li>
			</ul>
		</menu>
	</container>
{/if}

<!-- <tutorial class:show={$showTutorial} class:hide={!tutorialClicked}>
	<Tutorial />
</tutorial> -->

{#if showLoginModal}
	<Login bind:showLoginModal />
{/if}

<style>
	nav {
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	a {
		width: 100%;
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
	button {
		background-color: transparent;
		margin: 0 8px;
		padding: 0;
	}

	menu-icon {
	}

	container {
		display: block;
		z-index: 100;
		width: 100vw;
		height: 100vh;
		background-color: transparent;
		position: absolute;
		top: 0;
	}

	menu {
		position: absolute;
		top: 36px;
		padding: 0;
		margin: 0;
		right: 4px;
	}

	a {
		text-decoration: none;
	}
</style>
