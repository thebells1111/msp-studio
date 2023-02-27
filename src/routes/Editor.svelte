<script>
	import { library, selectedBand, selectedAlbum, selectedTrack } from '$/stores';
	let selectedScreen = 'bands';

	import Bands from './Bands.svelte';
	import Albums from './Albums.svelte';
	import Tracks from './Tracks.svelte';

	function handleScreenSelect(screen) {
		selectedScreen = screen;
	}
</script>

<ul>
	<li
		on:click={handleScreenSelect.bind(this, 'bands')}
		on:keypress={handleScreenSelect.bind(this, 'bands')}
	>
		Band - {$selectedBand.title}
	</li>
	<li
		on:click={handleScreenSelect.bind(this, 'albums')}
		on:keypress={handleScreenSelect.bind(this, 'albums')}
	>
		Album - {$selectedAlbum.title}
	</li>
	<li
		on:click={handleScreenSelect.bind(this, 'tracks')}
		on:keypress={handleScreenSelect.bind(this, 'tracks')}
	>
		Track - {$selectedTrack.title}
	</li>
</ul>

{#if selectedScreen === 'bands'}
	<Bands bind:selectedScreen />
{:else if selectedScreen === 'albums'}
	<Albums bind:selectedScreen />
{:else if selectedScreen === 'tracks'}
	<Tracks />
{/if}
