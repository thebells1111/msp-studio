<script>
	import ValueBlock from '$lib/Editor/ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from '$lib/Editor/ExplicitToggle.svelte';
	import FileUploader from '$lib/Editor/FileUploader.svelte';
	import SmallModal from '$lib/Modals/SmallModal.svelte';
	import UploadFileIcon from '$icons/UploadFile.svelte';
	import DeleteIcon from '$icons/Delete.svelte';
	import Player from '$lib/Editor/Tracks/Player/Player.svelte';
	import Artwork from '$lib/Editor/Artwork/Artwork.svelte';
	import ToolTip from '$lib/Editor/ToolTip.svelte';

	import clone from 'just-clone';

	import { newTrack, editingFeed, settings } from '$/stores';

	export let track = clone($newTrack);
	export let trackNumber = 1;

	let audioReload = 1;
	let showUpload = false;

	function deleteTrack() {
		const confirmed = window.confirm(
			`Are you sure you want to delete Track #${trackNumber}${
				track.title ? ` - ${track.title}?` : '?'
			}`
		);
		if (confirmed) {
			$editingFeed.item = $editingFeed.item.filter(
				(v) => !(v.guid === track.guid || v.guid['#text'] === track.guid['#text'])
			);
		}
	}
</script>

<container>
	<track-header class:first={trackNumber === 1}>
		<h3>Track #{trackNumber}</h3>
		<button class="delete" on:click={deleteTrack}>
			<DeleteIcon />
		</button>
	</track-header>
	{#if track?.enclosure?.['@_url']}
		<Player bind:track />
	{/if}
	<ul>
		<li>
			<h4>Title</h4>
			<ToolTip>
				<p class="tooltip">Enter the name of this track</p>
			</ToolTip>
		</li>
		<li>
			<h4>Link to mp3</h4>
			<ToolTip>
				<p class="tooltip">Enter the name of your Album</p>
			</ToolTip>
		</li>
		<li>
			<h4>Explicit</h4>
			<ToolTip>
				<p class="tooltip">Are there any F bombs or inappropriate language used in this track?</p>
			</ToolTip>
		</li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={track.title} /></li>
		<li>
			<input bind:value={track.enclosure['@_url']} />
			<button
				class="audio-upload"
				class:hide={!$settings?.bunny?.active}
				on:click={() => {
					showUpload = true;
				}}
			>
				<UploadFileIcon size="18" />
			</button>
		</li>
		<li><ExplicitToggle bind:checked={track.explicit} /></li>
	</ul>
	<info-2>
		<track-art>
			<div>
				<h4>Track Art</h4>
				<ToolTip>
					<p class="tooltip">Click the image to change the URL to the artwork for this track</p>
				</ToolTip>
			</div>
			<Artwork
				src={track['itunes:image']['@_href']}
				alt="track art - click to edit"
				parent="track"
				shape="square"
				{track}
			/>
		</track-art>
		<banner-art>
			<div>
				<h4>Banner Art</h4>

				<ToolTip>
					<p class="tooltip">Click the image to change the URL to the banner art for this track</p>
				</ToolTip>
			</div>
			<Artwork
				src={track?.['podcast:aspectImages']?.find((v) => v?.['@_aspect-ratio'] === '6/1')?.[
					'@_src'
				]}
				alt="banner art - click to edit"
				parent="track"
				shape="banner"
				{track}
			/>
		</banner-art>

		<description>
			<div>
				<h4>Description</h4>
				<ToolTip>
					<p class="tooltip">
						Interesting facts about this album. Could be anything <br />
						such as list of band members, genre of music, date album was recorded,<br />
						fun facts about the album. Whatever you want to share with the audience.
					</p>
				</ToolTip>
			</div>
			<textarea bind:value={track.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={track['podcast:value']['podcast:valueRecipient']} />
		</value>
	</info-2>
</container>

{#if showUpload}
	<SmallModal
		closeModal={() => {
			showUpload = false;
		}}
	>
		<FileUploader
			bind:filePath={track.enclosure['@_url']}
			bind:fileReload={audioReload}
			fileName="audio"
			folderName={$editingFeed['podcast:guid'] + '/' + track.guid['#text'] || track.guid}
			type="audio"
			uploadText="Track #{trackNumber} Audio"
		/>
	</SmallModal>
{/if}

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		padding: 0 8px;
		margin-bottom: 8px;
	}
	ul {
		display: flex;
		justify-content: space-between;
		height: 18px;
		align-items: center;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	li {
		list-style: none;
		height: 100%;
		width: 100%;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0;
		cursor: initial;
		margin: 0 4px;
		position: relative;
	}
	li:last-of-type {
		min-width: 90px;
		max-width: 90px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.inputs {
		height: 30px;
	}

	input {
		border-radius: 30px;
		width: calc(100%);
	}

	info-2 {
		margin-top: 8px;
		display: grid;
		grid-template-columns: 110px 472px calc(100% - 582px); /* First column fixed, B and C flexible */
		grid-template-rows: 120px 200px; /* Two rows */
		gap: 8px; /* Adjust spacing between items */
		width: 100%; /* Full width of the container */
		height: 320px;
	}

	track-art {
		grid-column: 1; /* First column */
		grid-row: 1; /* First row */
		width: 100%;
		height: 178px;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	banner-art {
		grid-column: 2;
		grid-row: 1;
		width: calc ((100% - 150px) / 2);
		height: 102px;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	track-art > div,
	banner-art > div,
	description > div {
		display: flex;
	}

	h4 {
		margin: 0 8px;
		text-align: left;
		display: inline-block;
	}
	description {
		grid-column: 1 / span 2;
		grid-row: 2;
		height: calc(100% - 8px); /* Adjust height as needed */
		display: flex;
		flex-direction: column;
	}
	textarea {
		resize: none;
		width: calc(100% - 10px);
		height: 100%;
		border-radius: 5px;
	}

	value {
		grid-column: 3;
		grid-row: 1 / span 2;
		height: calc(100% - 8px);
		margin-right: 8px;
		overflow: auto;
	}
	h3 {
		color: var(--color-bg-add-band);
		margin: 0;
	}

	track-header {
		display: flex;
		align-items: center;
		border-top: 1px solid var(--color-text-0);
		padding: 0;
		width: 100%;
	}

	track-header.first {
		border-top: none;
	}

	button {
		background-color: var(--color-bg-add-band);
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
		width: 30px;
		height: 30px;
		min-width: 30px;
		min-height: 30px;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	button.audio-upload {
		position: absolute;
		right: -2px;
	}

	.delete {
		font-size: 1.5em;
		color: var(--color-bg-delete);
		background-color: transparent;
		box-shadow: none;
		bottom: 1px;
	}

	.hide {
		display: none;
	}

	p.tooltip {
		padding: 0%;
		color: white;
		margin: 0;
	}
</style>
