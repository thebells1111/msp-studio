<script>
	import Play from '../icons/PlayArrow.svelte';
	import Pause from '../icons/Pause.svelte';
	export let size = 30;
	export let style;
	export let player;

	function handlePlayButton() {
		if (player && player.paused) {
			player.play();
		} else if (player && player.src) {
			player.pause();
		}
		player.paused = player.paused;
	}
</script>

<button on:click={handlePlayButton} aria-label="Play Pause" {style}>
	{#if !player}
		<Play {size} />
	{:else if player.paused}
		<Play {size} />
	{:else}
		<Pause {size} />
	{/if}
</button>

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
		width: 45px;
		height: 45px;
	}
</style>
