<script>
	import {
		selectedBand,
		newBand,
		selectedAlbum,
		newAlbum,
		selectedTrack,
		selectedScreen
	} from '$/stores';

	function handleScreenSelect(screen) {
		$selectedScreen = screen;
		if (screen === 'bands') {
			$selectedBand = $newBand;
		} else if (screen === 'albums') {
			$selectedAlbum = $newAlbum;
		}
	}
</script>

<div>
	{#if $selectedBand.title}
		<button on:click={handleScreenSelect.bind(this, 'bands')}> Select Different Band </button>
		{#if $selectedAlbum.title}
			<button on:click={handleScreenSelect.bind(this, 'albums')}> Select Different Album </button>
			{#if $selectedTrack.title}
				<button on:click={handleScreenSelect.bind(this, 'tracks')}> Select Different Track </button>
			{/if}
		{/if}
	{/if}
</div>
