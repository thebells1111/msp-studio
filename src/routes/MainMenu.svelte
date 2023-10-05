<script>
	import { slide, fly } from 'svelte/transition';
	import SettingsIcon from './icons/Settings.svelte';
	import SmallModal from '$routes/Modals/SmallModal.svelte';
	import UpdatePassword from '$routes/UpdatePassword/UpdatePassword.svelte';

	let expandMenu = false;
	let showResetModal = false;
</script>

<nav>
	<!-- <button
		on:click={() => {
			expandMenu = true;
		}}
	>
		<SettingsIcon size="24" />
	</button> -->

	{#if expandMenu}
		<container
			on:click={() => {
				expandMenu = false;
			}}
		>
			<menu>
				<account-button-hover />
				<ul transition:slide|global={{ duration: 200 }}>
					<li
						on:click={() => {
							showResetModal = true;
						}}
					>
						Reset Password
					</li>
				</ul>
			</menu>
		</container>
	{/if}
	<a href="https://t.me/self_hosters" target="_blank" rel="noopener noreferrer">Help</a>
</nav>

{#if showResetModal}
	<SmallModal bind:showModal={showResetModal}>
		<UpdatePassword bind:showResetModal />
	</SmallModal>
{/if}

<style>
	container {
		width: 100vw;
		height: 100vh;
		position: fixed;
		overflow: hidden;
		top: 0;
		left: 0;
		z-index: 33;
	}

	nav {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		height: 50px;
	}

	button {
		color: var(--color-text-0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		z-index: 33;
		padding: 0;
		margin: 10px 8px 0 10px;
		position: relative;
		background-color: transparent;
	}

	a {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px 16px;
	}
	account-button-hover {
		display: block;
		width: 56px;
		height: 56px;
		cursor: pointer;
	}
	menu {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		left: -32px;
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
