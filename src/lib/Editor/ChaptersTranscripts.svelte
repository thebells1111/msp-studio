<script>
	import Modals from '$routes/Modals/Modals.svelte';
	import SmallModal from '$routes/Modals/SmallModal.svelte';
	import { onMount } from 'svelte';

	import { selectedAlbum, selectedTrack, selectedTrackIndex } from '$/stores';

	let showChaptersUpload = false;
	let chaptersUrl;
	let transcriptsUrl;
	let showChaptersHints = false;
	let showTranscriptsHints = false;

	onMount(() => {
		chaptersUrl = $selectedTrack.chapters || '';
		transcriptsUrl = $selectedTrack.transcripts || '';
	});

	async function saveTrack() {
		$selectedTrack.chapters = chaptersUrl;
		$selectedTrack.transcripts = transcriptsUrl;

		$selectedAlbum.tracks[$selectedTrackIndex] = $selectedTrack;
		$selectedAlbum = $selectedAlbum;
		showChaptersUpload = false;
	}
</script>

<button
	on:click={() => {
		showChaptersUpload = true;
	}}>Add Chapters and Lyrics</button
>

{#if showChaptersUpload}
	<Modals
		closeModal={() => {
			showChaptersUpload = false;
		}}
	>
		<label>
			<title>
				<h4>Link to Chapters File (optional)</h4>
				<button
					on:click={() => {
						showChaptersHints = true;
					}}
					class="question">?</button
				>
			</title>
			<input bind:value={chaptersUrl} />
		</label>
		<label>
			<title>
				<h4>Link to Lyrics File (optional)</h4>
				<button
					on:click={() => {
						showTranscriptsHints = true;
					}}
					class="question">?</button
				>
			</title>

			<input bind:value={transcriptsUrl} />
		</label>

		<button class="submit" on:click={saveTrack}>Submit</button>
	</Modals>
{/if}

{#if showChaptersHints}
	<SmallModal
		closeModal={() => {
			showChaptersHints = false;
		}}
	>
		<p>
			This would be a link to your chapters file. To learn more about chapters files, <a
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

{#if showTranscriptsHints}
	<SmallModal
		closeModal={() => {
			showTranscriptsHints = false;
		}}
	>
		<p>This would be a link to your lyrics file.</p>
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
	button {
		width: 300px;
		background-color: var(--color-bg-download-feed);
	}

	title {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}
	h4 {
		margin: 0;
	}
	input {
		margin: 0 0 16px 8px;
		width: calc(100% - 16px);
	}

	.question {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #999;
		color: white;
		font-size: 16px;
		cursor: pointer;
		padding: 0;
		margin-left: 8px;
	}

	.submit {
		width: calc(100% - 16px);
		margin: 100px 8px 8px 8px;
		color: var(--color-text-0);
		background-color: var(--color-bg-button);
	}
</style>
