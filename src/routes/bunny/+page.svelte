<script>
	import SignUp from '$lib/Bunny//Tutorial/SignUp.svelte';
	import CreateStorageZone from '$lib/Bunny//Tutorial/CreateStorageZone.svelte';
	import CreatePullZone from '$lib/Bunny//Tutorial/CreatePullZone.svelte';
	import SetupCDN from '$lib/Bunny//Tutorial/SetupCDN.svelte';
	import AddCredentials from '$lib/Bunny//Tutorial/Add Credentials.svelte';

	let components = [SignUp, CreateStorageZone, CreatePullZone, SetupCDN, AddCredentials];
	let activePage = 0;
</script>

<main>
	<section>
		<component>
			<svelte:component this={components[activePage]} />
		</component>

		<nav>
			<button on:click={() => (activePage = 0)}> 1. Sign Up </button>

			<button on:click={() => (activePage = 1)}> 2. Create Storage Zone </button>

			<button on:click={() => (activePage = 2)}>3. Create Pull Zone</button>
			<button on:click={() => (activePage = 3)}>4. Setup CDN</button>
			<button on:click={() => (activePage = 4)}>5. Add Credentials</button>
		</nav>
	</section>
</main>

<style>
	main {
		position: relative;
		height: calc(100% - 38px);
		width: 100vw;
		overflow: hidden;
		display: flex;
	}

	section {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	component {
		display: block;
		height: calc(100% - 42px);
		padding: 0 12px;
		overflow: auto;
	}

	nav {
		display: flex;
		justify-content: center;
		height: 42px;
		align-items: center;
	}
</style>
