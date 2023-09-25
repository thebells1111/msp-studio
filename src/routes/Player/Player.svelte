<script>
	import { onMount } from 'svelte';
	import AudioProgressBar from './AudioProgressBar.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import convertTime from '../functions/convertTime';

	export let playerEnclosure;
	import { selectedTrack } from '$/stores';
	let player;

	onMount(setupPlayer);

	function setupPlayer() {
		player.src = playerEnclosure;
		player.ontimeupdate = () => {
			player.currentTime = player.currentTime;
		};
		player.onloadedmetadata = async () => {
			console.log('loaded');
			player.duration = player.duration;
			$selectedTrack.duration = player.duration;
		};
	}
</script>

<audio playsinline preload="metadata" bind:this={player} src={playerEnclosure} />
{#if player?.duration}
	<player>
		<player-a>
			<play-button>
				<PlayPauseButton {player} size="30" />
			</play-button>
			{#if player}
				<time>
					{convertTime(player.currentTime, player.duration) || '0:00'} / {convertTime(
						player.duration
					) || '0:00'}
				</time>
			{/if}
		</player-a>
		<player-b>
			<AudioProgressBar
				{player}
				handleColor={'var(--color-progressbar-0)'}
				elapsedColor={'var(--color-progressbar-0)'}
				trackerColor={'var(--color-progressbar-1)'}
			/>
		</player-b>
	</player>
{:else}
	<spacer />
{/if}

<style>
	player,
	spacer {
		display: flex;
		margin: 8px;
		width: calc(100% - 32px);
		height: 48px;
	}

	player-a {
		display: flex;
		align-items: center;
	}

	player-b {
		width: 100%;
		z-index: 4px;
	}

	time {
		display: flex;
		width: 120px;
		align-items: center;
		justify-content: center;
	}

	@media screen and (max-width: 992px) {
		player {
			display: flex;
			width: calc(100% - 16px);
			position: relative;
			margin: 8px 0;
		}

		player-a {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		play-button {
			margin-right: 4px;
		}
		time {
			position: absolute;
			bottom: -8px;
			left: calc(50% - 16px);
			margin: 0;
			padding: 0;
			width: auto;
		}
	}
</style>
