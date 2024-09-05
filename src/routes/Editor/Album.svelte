<script>
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import FileUploader from './FileUploader.svelte';
	import ExplicitToggle from './ExplicitToggle.svelte';
	import SmallModal from '../Modals/SmallModal.svelte';
	import UploadFileIcon from '../icons/UploadFile.svelte';

	import { editingFeed, feeds, catalogDB } from '$/stores';

	let updateTimeout;

	function updateFeeds() {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			$feeds = $feeds;
			$catalogDB.setItem($editingFeed['podcast:guid'], $editingFeed);
		}, 500);
	}
	$: console.log($feeds);

	let showUpload = false;
	let imageReload = '';
	$: if (imageReload) {
		showUpload = false;
		updateFeeds();
	}
</script>

<container>
	<ul>
		<li><h4>Band/Artist</h4></li>
		<li><h4>Album</h4></li>
		<li><h4>Website</h4></li>
		<li><h4>Explicit</h4></li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={$editingFeed['itunes:author']} on:input={updateFeeds} /></li>
		<li><input bind:value={$editingFeed.title} on:input={updateFeeds} /></li>
		<li><input bind:value={$editingFeed.link} /></li>
		<li><ExplicitToggle bind:checked={$editingFeed.explicit} handleInput={updateFeeds} /></li>
	</ul>
	<info-2>
		<artwork
			on:click={() => {
				showUpload = true;
			}}
		>
			<h4>Album Art</h4>

			<img
				src={$editingFeed?.['itunes:image']?.['@_href'] + '?t=' + imageReload}
				alt="album art - click to edit"
			/>
			<button><UploadFileIcon size="20" /></button>
		</artwork>
		<description>
			<h4>Description</h4>
			<textarea bind:value={$editingFeed.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={$editingFeed['podcast:value']['podcast:valueRecipient']} />
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
			bind:filePath={$editingFeed['itunes:image']['@_href']}
			bind:fileReload={imageReload}
			fileName="album-art"
			folderName={$editingFeed['podcast:guid']}
			type="image"
			uploadText="Album Art"
		/>
	</SmallModal>
{/if}

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		padding: 0 8px;
		margin: 8px 0;
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
		justify-content: center;
		padding: 0;
		cursor: initial;
		margin: 0 4px;
	}
	li:last-of-type {
		min-width: 60px;
		max-width: 60px;
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
		display: flex;
		width: 100%;
		height: 300px;
		margin-top: 8px;
	}

	artwork {
		display: flex;
		flex-direction: column;
		width: 150px;
	}

	img {
		cursor: pointer;
		height: 150px;
		width: 150px;
		border: 1px solid black;
		border-radius: 5px;
	}

	h4 {
		margin: 0 8px;
		text-align: left;
		width: 100%;
	}

	description {
		display: block;
		width: calc((100% - 150px) / 2);
		display: flex;
		flex-direction: column;
		margin: 0 4px 0 8px;
	}

	textarea {
		resize: none;
		height: 100%;
		border-radius: 5px;
		margin: 0 4px;
	}

	value {
		display: block;
		width: calc((100% - 150px) / 2);
	}

	button {
		width: 30px;
		height: 30px;
		border-radius: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		bottom: 30px;
		left: 121px;
		background-color: var(--color-bg-add-band);
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
	}
</style>
