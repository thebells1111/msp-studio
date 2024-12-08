<script>
	import { onMount } from 'svelte';
	import AudioProgressBar from './AudioProgressBar.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';
	import convertTime from '$lib/functions/convertTime';

	import { remoteServer } from '$/stores';

	export let track;
	let player;
	let trackSrc = '';
	let trackInitalized = false;

	onMount(setupPlayer);

	function setupPlayer() {
		player.ontimeupdate = () => {
			player.currentTime = player.currentTime;
		};
		player.onloadedmetadata = () => {
			player.duration = player.duration;
			track['itunes:duration'] = player.duration;

			if (trackSrc !== player.src) {
				trackSrc = player.src;
				if (trackInitalized) {
					fetch(`${remoteServer}/api/msp/enclosure?url=${track.enclosure['@_url']}`)
						.then((response) => response.json())
						.then(({ length, mimeType }) => {
							console.log(length);
							console.log(mimeType);
							// Extract and store length and mimeType from response
							track.enclosure['@_length'] = length;
							track.enclosure['@_type'] = mimeType;

							// Clean up any deprecated properties
							delete track.enclosure['@_enclosureLength'];
							console.log('Fetched enclosure length and type');
						})
						.catch((error) => console.error('Failed to fetch enclosure metadata:', error));
				} else {
					trackInitalized = true;
				}
			}
		};
	}
</script>

<audio
	playsinline
	preload="metadata"
	class:hide={!track?.['itunes:duration'] || !track?.enclosure?.['@_url']}
	bind:this={player}
	src={track.enclosure['@_url']}
/>

{#if track?.['itunes:duration'] && track?.enclosure?.['@_url']}
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
