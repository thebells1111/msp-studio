<script>
	import BunnyToggle from '$lib/Editor/Bunny/BunnyToggle.svelte';
	let enableLowBandwidth = $settings?.lowBandwidth || false;
	import { remoteServer, settings } from '$/stores';

	async function saveSettings() {
		console.log($settings);
		const response = await fetch(remoteServer + '/api/msp/savesettings', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify($settings)
		});

		const data = await response.json();
		console.log(data);
		if (data.status === 'success') {
		}
	}

	function changeLowBandwidth() {
		$settings.lowBandwidth = enableLowBandwidth;
		saveSettings();
	}
</script>

<div>
	<header>
		<h3>Low Bandwidth:</h3>
		<BunnyToggle bind:checked={enableLowBandwidth} handleInput={changeLowBandwidth} />
	</header>
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

	p,
	a {
		text-align: center;
	}

	p {
		margin: 8px 0;
		padding: 0;
		line-height: 1;
	}
</style>
