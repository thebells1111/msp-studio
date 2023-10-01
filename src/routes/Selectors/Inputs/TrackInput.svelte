<script>
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ValueBlock from '$routes/ValueBlock/ValueBlock.svelte';
	import Close from '$icons/Close.svelte';
	import Player from '$routes/Player/Player.svelte';
	import FileUploader from '$routes/Modals/FileUploader.svelte';
	import SmallModal from '$routes/Modals/SmallModal.svelte';
	import CheckCircleFilled from '$icons/CheckCircleFilled.svelte';
	import postFeeds from '$routes/functions/postFeeds.js';

	import { selectedTrack, selectedTrackIndex, editingFeed, feeds } from '$/stores';

	export let showEdit;

	let trackState = {
		guid: {
			'#text': '',
			'@_isPermaLink': 'false'
		},
		title: '',
		'itunes:image': { '@_href': '' },
		enclosure: { '@_url': '', '@_length': '', '@_type': '' },
		description: '',
		'itunes:explicit': 'no',
		'podcast:chapters': { '@_url': '', '@_type': 'application/json' },
		'podcast:transcript': { '@_url': '', '@_type': 'application/srt' },
		'podcast:value': {
			'@_type': 'lightning',
			'@_method': 'keysend',
			'podcast:valueRecipient': []
		}
	};

	let showUpload = { audio: false, art: false, lyrics: false, chapters: false };
	let showHints = { audio: false, art: false, lyrics: false, chapters: false };
	let imageReload = '';
	let audioReload = '';

	onMount(() => {
		const {
			guid,
			title,
			'itunes:image': img,
			enclosure,
			description,
			'podcast:value': value,
			'podcast:chapters': chapters,
			'podcast:transcript': transcript,
			'itunes:explicit': explicit
		} = $selectedTrack || {};
		trackState = {
			guid: {
				'#text': guid?.['#text'] ? guid['#text'] : uuidv4(),
				'@_isPermaLink': 'false'
			},
			title: title || '',
			'itunes:image': { '@_href': img?.['@_href'] || '' },
			enclosure: enclosure || { '@_url': '', '@_length': '', '@_type': '' },
			description: description || '',
			'itunes:explicit': explicit || 'no',
			'podcast:chapters': {
				'@_url': chapters?.['@_url'] ? chapters['@_url'] : '',
				'@_type': 'application/json'
			},
			'podcast:transcript': {
				'@_url': transcript?.['@_url'] ? transcript['@_url'] : '',
				'@_type': 'application/srt'
			},
			'podcast:value': {
				'@_type': 'lightning',
				'@_method': 'keysend',
				'podcast:valueRecipient': value?.['podcast:valueRecipient']?.length
					? value['podcast:valueRecipient']
					: []
			}
		};
	});

	function toggleShow(key, type) {
		showUpload[key] = type === 'upload';
		showHints[key] = type === 'hints';
	}

	function saveTrack() {
		Object.assign($selectedTrack, trackState);
		$editingFeed.item[$selectedTrackIndex] = $selectedTrack;
		$feeds[$editingFeed['podcast:guid']] = $editingFeed;
		postFeeds($feeds);
		showEdit = false;
	}

	function closeModal() {
		showEdit = false;
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<track-modal transition:fade|global={{ duration: 25 }}>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<scroll-container>
			<top-pane>
				<image-pane>
					{#if trackState?.['itunes:image']?.['@_href']}
						<img
							class="upload"
							on:click={() => toggleShow('art', 'upload')}
							width="258"
							height="258"
							alt={trackState.title
								? `${`${trackState.title} ` || ''}cover art`
								: 'add Album Image link'}
							src={trackState?.['itunes:image']?.['@_href'] + '?t=' + imageReload}
						/>{:else}
						<button class="upload" on:click={() => toggleShow('art', 'upload')}
							>Click to upload Track Art<br />(optional)</button
						>
					{/if}
				</image-pane>
				<edit-pane>
					<label class="track-name">
						<h4>Track Name (required)</h4>
						<input bind:value={trackState.title} />
					</label>

					<explicit>
						<h4>Explicit Content (optional)</h4>
						<explicit-radio>
							<label>
								<input
									type="radio"
									bind:group={trackState['itunes:explicit']}
									name="explicit"
									value={'no'}
								/>
								No
							</label>
							<label>
								<input
									type="radio"
									bind:group={trackState['itunes:explicit']}
									name="explicit"
									value={'yes'}
								/>
								Yes
							</label>
						</explicit-radio>
					</explicit>
					<button-group>
						<button-container>
							<button class="add audio" on:click={() => toggleShow('audio', 'upload')}>
								Add mp3 (required)
								{#if trackState?.enclosure?.['@_url']}
									<span>
										<CheckCircleFilled size="27" />
									</span>
								{/if}
							</button>
							<button class="question" on:click={() => toggleShow('audio', 'hints')}>?</button>
						</button-container>
						<button-container>
							<button class="add art" on:click={() => toggleShow('art', 'upload')}>
								Add Artwork (optional)
								{#if trackState?.['itunes:image']['@_href']}
									<span>
										<CheckCircleFilled size="27" />
									</span>
								{/if}
							</button>
							<button class="question" on:click={() => toggleShow('art', 'hints')}>?</button>
						</button-container>
						<button-container>
							<button class="add lyrics" on:click={() => toggleShow('lyrics', 'upload')}>
								Add Lyrics (optional)
								{#if trackState?.['podcast:transcript']['@_url']}
									<span>
										<CheckCircleFilled size="27" />
									</span>
								{/if}
							</button>
							<button class="question" on:click={() => toggleShow('lyrics', 'hints')}>?</button>
						</button-container>
						<button-container>
							<button class="add chapters" on:click={() => toggleShow('chapters', 'upload')}>
								Add Chapters (optional)
								{#if trackState?.['podcast:chapters']['@_url']}
									<span>
										<CheckCircleFilled size="27" />
									</span>
								{/if}
							</button>
							<button class="question" on:click={() => toggleShow('chapters', 'hints')}>?</button>
						</button-container>
					</button-group>
					<!-- <ChaptersTranscripts /> -->
				</edit-pane>
			</top-pane>
			<player-container>
				<Player bind:playerEnclosure={trackState.enclosure['@_url']} />
			</player-container>
			<bottom-pane>
				<label class="track-description">
					<h4>Track Liner Notes (optional - but recommended)</h4>
					<textarea bind:value={trackState.description} />
				</label>
				<value>
					<ValueBlock bind:valueBlock={trackState['podcast:value']['podcast:valueRecipient']} />
				</value>
			</bottom-pane>
		</scroll-container>
		<button class="submit" on:click={saveTrack}>Submit</button>
	</track-modal>
</blurred-background>

{#if showUpload.audio}
	<FileUploader
		bind:showModal={showUpload.audio}
		bind:filePath={trackState.enclosure}
		bind:fileReload={audioReload}
		fileName="audio"
		folderName={`${$editingFeed['podcast:guid']}/${trackState.guid['#text']}`}
		type="audio"
	/>
{/if}

{#if showUpload.art}
	<FileUploader
		bind:showModal={showUpload.art}
		bind:filePath={trackState['itunes:image']['@_href']}
		bind:fileReload={imageReload}
		fileName="artwork"
		folderName={`${$editingFeed['podcast:guid']}/${trackState.guid['#text']}`}
		type="image"
	/>
{/if}

{#if showUpload.lyrics}
	<FileUploader
		bind:showModal={showUpload.lyrics}
		bind:filePath={trackState['podcast:transcript']['@_url']}
		fileName="lyrics"
		folderName={`${$editingFeed['podcast:guid']}/${trackState.guid['#text']}`}
		type="lyrics"
	/>
{/if}

{#if showUpload.chapters}
	<FileUploader
		bind:showModal={showUpload.chapters}
		bind:filePath={trackState['podcast:chapters']['@_url']}
		fileName="chapters"
		folderName={`${$editingFeed['podcast:guid']}/${trackState.guid['#text']}`}
		type="chapters"
	/>
{/if}

{#if showHints.audio}
	<SmallModal bind:showModal={showHints.audio}>
		<p>Upload the mp3 audio for your track.</p>
	</SmallModal>
{/if}

{#if showHints.art}
	<SmallModal bind:showModal={showHints.art}>
		<p>Upload a square image for your track art.</p>
		<p>This is entirely optional, and if not done, the track art will default to your album art.</p>
	</SmallModal>
{/if}

{#if showHints.chapters}
	<SmallModal bind:showModal={showHints.chapters}>
		<p>
			Use this to upload a chapters file. To learn more about chapters files, <a
				href="https://github.com/Podcastindex-org/podcast-namespace/blob/main/chapters/jsonChapters.md"
				target="_blank"
				rel="noopener noreferrer"
			>
				click here.
			</a>
		</p>
		<p>
			Due to the short length of a song, chapters may not make sense, but the option is being
			provided if you so desire.
		</p>
	</SmallModal>
{/if}

{#if showHints.lyrics}
	<SmallModal bind:showModal={showHints.lyrics}>
		<p>Use this to update the transcripts of your lyrics.</p>
		<p>It's the same type of file a podcast would use for transcripts.</p>
		<p>
			Although other formats are available, currently Music Side Project only provides support for
			.srt files.
		</p>
		<p>
			If you're interested in generating lyrics, check out the excellent
			<a href="https://transcribe.fm/" target="_blank" rel="noopener noreferrer">transcribe.fm</a>,
			an excellent v4v transcriber.
		</p>
	</SmallModal>
{/if}

<style>
	top-pane {
		display: flex;
		margin-top: 8px;
	}
	image-pane {
		display: flex;
		flex-direction: column;
	}

	edit-pane {
		width: 100%;
		margin: 8px 0 0 8px;
	}

	bottom-pane {
		display: flex;
		align-items: flex-start;
	}

	button-group {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		grid-column-gap: 16px;
		grid-row-gap: 8px;
		width: calc(100% - 24px);
		margin: 16px 8px;
	}

	button-container {
		display: flex;
		width: 100%;
		align-items: center;
	}

	button-container:nth-of-type(2) {
		grid-area: 2 / 1 / 3 / 2;
	}

	button-container:nth-of-type(3) {
		grid-area: 1 / 2 / 2 / 3;
	}

	.question {
		display: flex;
		align-self: flex-end;
		align-items: center;
		justify-content: center;
		width: 27px;
		height: 27px;
		border-radius: 50%;
		background-color: #999;
		color: white;
		font-size: 16px;
		cursor: pointer;
		padding: 0;
		margin-left: 2px;
	}

	.add {
		flex: 1;
		background-color: var(--color-bg-add-shade-1);
	}

	.art {
		background-color: var(--color-bg-add-shade-2);
	}
	.lyrics {
		background-color: var(--color-bg-add-shade-3);
	}
	.chapters {
		background-color: var(--color-bg-add-shade-4);
	}

	scroll-container {
		display: block;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		flex: 1;
	}

	.submit {
		width: calc(100% - 16px);
		margin: 8px;
	}

	.track-description {
		min-width: 33%;
		display: block;
		margin: 0 16px 16px 0;
	}

	.track-description textarea {
		width: 100%;
		height: 218px;
		resize: none;
	}

	label {
		display: block;
		margin: 0 16px 16px 0;
	}

	input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	value {
		margin-left: 8px;
		width: 33%;
		min-width: 33%;
	}

	explicit {
		display: flex;
		flex-direction: column;
	}

	explicit-radio {
		display: block;
		margin: 0 8px;
	}

	explicit-radio label {
		display: inline-block;
		width: 100px;
		cursor: pointer;
		margin: 0;
	}

	explicit-radio input {
		width: initial;
	}

	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 34;
		backdrop-filter: blur(5px);
	}

	track-modal {
		position: relative;
		display: flex;
		flex-direction: column;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		padding: 8px;
		overflow: auto;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	.close {
		position: fixed;
		top: 16px;
		right: 16px;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
	}

	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	input::placeholder {
		color: red;
		font-weight: bold;
	}

	button.upload {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
		min-width: 258px;
		min-height: 258px;
		background-color: transparent;
	}
	button-container > button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	button-container > button > span {
		position: absolute;
		right: 3px;
		top: 4px;
		color: hsla(198, 100%, 80%, 0.75);
	}

	@media screen and (max-width: 992px) {
		track-modal {
			width: calc(100% - 16px);
			height: calc(100% - 16px);
			border-radius: 0px;
			padding: 8px;
			overflow: auto;
		}
		top-pane {
			width: calc(100% - 8px);
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin: 16px 0 0 8px;
		}
		img {
			width: 100px;
			min-width: 100px;
			height: 100px;
			margin-bottom: 4px;
		}

		edit-pane {
			width: 100%;
			margin: 8px 0 0 0;
		}

		button-group {
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			grid-template-rows: repeat(4, 1fr);
			grid-column-gap: 8px;
			grid-row-gap: 8px;
			width: calc(100% - 24px);
			margin: 16px 8px 0 8px;
		}

		player-container {
			display: block;
			position: absolute;
			top: 42px;
			width: calc(100% - 100px);
			right: 0;
		}

		button.upload {
			width: 100px;
			min-width: 100px;
			height: 100px;
			min-height: 100px;
			margin-bottom: 4px;
			font-size: 0.8em;
		}

		bottom-pane {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin: 8px 16px 0 8px;
		}

		.track-description {
			width: calc(100% - 16px);
			margin: 8px 0 8px 8px;
		}

		value {
			width: 100%;
		}

		.close {
			top: 4px;
			right: 4px;
		}

		button-container:nth-of-type(2) {
			grid-area: 2 / 1 / 3 / 2;
		}

		button-container:nth-of-type(3) {
			grid-area: 3 / 1 / 4 / 2;
		}
	}
</style>
