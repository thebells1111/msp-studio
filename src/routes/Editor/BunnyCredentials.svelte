<script>
	import BunnyToggle from './BunnyToggle.svelte';
	let useBunnyCredentials = false;
</script>

<div>
	<header>
		<h3>Bunny Credentials</h3>
		<BunnyToggle bind:checked={useBunnyCredentials} />
	</header>
	{#if useBunnyCredentials}
		<label>
			Username
			<input />
		</label>
		<label>
			Hostname
			<input />
		</label>
		<label>
			Bunny Password
			<input />
		</label>
		<label>
			Linked Hostnames
			<input />
		</label>
		<button>Submit</button>
	{/if}
</div>

<style>
	div {
		height: calc(100%);
		width: 260px;
		overflow: hidden;
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
		position: relative;
		display: flex;
		flex-direction: column;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 4px 0 4px;
	}

	h3 {
		margin: 8px 0 8px 4px;
	}

	label {
		margin: 4px 8px;
	}

	input {
		margin: 0 4px;
		width: calc(100% - 16px);
	}
	button {
		margin: 8px;
	}
</style>
