<script>
	import { onMount } from 'svelte';
	import AudioProgressBar from './AudioProgressBar.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import convertTime from '../functions/convertTime';

	export let playerEnclosure;
	export let newTrackEnclosure;
	import { selectedTrack } from '$/stores';
	let player;

	onMount(setupPlayer);

	function setupPlayer() {
		player.src = playerEnclosure;
		player.ontimeupdate = () => {
			player.currentTime = player.currentTime;
		};
		player.onloadedmetadata = async () => {
			player.duration = player.duration;
			$selectedTrack.duration = player.duration;
			const response = await fetch('/api/enclosureproxy?url=' + newTrackEnclosure.url);
			let { enclosureLength, enclosureType } = await response.json();
			newTrackEnclosure.enclosureLength = enclosureLength;
			newTrackEnclosure.type = enclosureType;
		};
	}
</script>

<audio playsinline preload="metadata" bind:this={player} src={playerEnclosure} />

<player>
	<PlayPauseButton {player} size="30" />
	{#if player}
		<time>
			{convertTime(player.currentTime, player.duration) || '0:00'} / {convertTime(
				player.duration
			) || '0:00'}
		</time>
	{/if}
	<AudioProgressBar
		{player}
		handleColor={'var(--color-progressbar-0)'}
		elapsedColor={'var(--color-progressbar-0)'}
		trackerColor={'var(--color-progressbar-1)'}
	/>
</player>

<style>
	player {
		display: flex;
		margin: 8px;
		width: calc(100% - 32px);
	}

	time {
		display: flex;
		width: 120px;
		align-items: center;
		justify-content: center;
	}
</style>
