<script>
	import {
		library,
		selectedBand,
		selectedBandIndex,
		newBand,
		selectedAlbum,
		selectedTrack,
		selectedScreen
	} from '$/stores';

	import Bands from './Bands.svelte';
	import Albums from './Albums.svelte';
	import Tracks from './Tracks.svelte';

	function handleScreenSelect(screen) {
		$selectedScreen = screen;
		if (screen === 'bands') {
			$selectedBand = newBand;
		}
	}

	async function selectBand(band, index) {
		$selectedBand = band;
		$selectedAlbum = '';
		$selectedTrack = '';
		$selectedScreen = 'albums';
		$selectedBandIndex = index;
	}

	async function selectAlbum(album) {
		$selectedAlbum = album;
		$selectedScreen = 'tracks';
	}

	async function selectTrack(Track) {
		console.log(Track);
		$selectedTrack = Track;
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

{#if $selectedScreen === 'bands'}
	<h3>Bands</h3>
	<ul>
		{#each $library as band, i}
			<li on:click={selectBand.bind(this, band, i)}>{band.title}</li>
		{/each}
		<Bands add={true} />
	</ul>
{:else if $selectedScreen === 'albums'}
	<Bands />

	<h4>Albums</h4>
	<ul>
		{#each $selectedBand?.albums || [] as album}
			<li on:click={selectAlbum.bind(this, album)}>{album.title}</li>
		{/each}
	</ul>
	<Albums />
{:else if $selectedScreen === 'tracks'}
	<Albums />
	<h4>Tracks</h4>
	<ul>
		{#each $selectedAlbum?.tracks || [] as track}
			<li on:click={selectTrack.bind(this, track)}>{track.title}</li>
		{/each}
	</ul>
	<Tracks />
{/if}
