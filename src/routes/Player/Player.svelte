<script>
	import { onMount } from 'svelte';
	import AudioProgressBar from './AudioProgressBar.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import convertTime from '../functions/convertTime';

	export let source;
	let player;

	onMount(setupPlayer);

	function setupPlayer() {
		player.src = source;
		player.ontimeupdate = () => {
			player.currentTime = player.currentTime;
		};
		player.onloadedmetadata = () => {
			player.duration = player.duration;
			console.log(player.duration);
		};
		console.log(source);
		console.log(player);
	}
</script>

<audio playsinline preload="metadata" bind:this={player} />

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
