<script>
	import { onMount } from 'svelte';
	import AudioProgressBar from './AudioProgressBar.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import convertTime from '$lib/functions/convertTime';

	export let track;
	let player;

	onMount(setupPlayer);

	function setupPlayer() {
		player.ontimeupdate = () => {
			player.currentTime = player.currentTime;
		};
		player.onloadedmetadata = async () => {
			console.log('loaded');
			player.duration = player.duration;
			track['itunes:duration'] = player.duration;
			if (track.enclosure['@_length'] === 33) {
				const response = await fetch('/api/enclosureproxy?url=' + track.enclosure['@_url']);
				let { enclosureLength, enclosureType } = await response.json();
				track.enclosure['@_length'] = enclosureLength;
				track.enclosure['@_type'] = enclosureType;
				console.log('got enclosure length');
				console.log(track.enclosure);
			}
		};
	}
</script>

<audio
	playsinline
	preload="metadata"
	class:hide={!track?.['itunes:duration']}
	bind:this={player}
	src={track.enclosure['@_url']}
/>

{#if track?.['itunes:duration']}
	<player>
		<h2>{track.title || 'Track Audio'}</h2>
		<player-a>
			<play-button>
				<PlayPauseButton {player} size="30" />
			</play-button>
		</player-a>
		<player-b>
			<AudioProgressBar
				{player}
				handleColor={'var(--color-progressbar-0)'}
				elapsedColor={'var(--color-progressbar-0)'}
				trackerColor={'var(--color-progressbar-1)'}
			/>
		</player-b>
		{#if player}
			<time>
				{convertTime(player.currentTime, player.duration) || '0:00'} / {convertTime(
					player.duration
				) || '0:00'}
			</time>
		{/if}
	</player>
{/if}

<style>
	player {
		display: flex;
		margin: 8px;
		width: calc(100% - 32px);
		height: 48px;
		position: relative;
	}

	player-a {
		display: flex;
		align-items: center;
	}

	player-b {
		width: 100%;
		z-index: 4px;
		position: relative;
	}

	h2,
	time {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 0;
	}
	h2 {
		top: -8px;
		margin: 0;
		bottom: initial;
		color: var(--color-bg-add-track);
	}
</style>
