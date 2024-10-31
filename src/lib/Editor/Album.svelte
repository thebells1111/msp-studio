<script>
	import ValueBlock from '$lib/Editor/ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from '$lib/Editor/ExplicitToggle.svelte';
	import SmallModal from '$lib/Modals/SmallModal.svelte';
	import UploadFileIcon from '$icons/UploadFile.svelte';
	import ArtUpload from '$lib/Editor/ArtUpload.svelte';

	import { editingFeed, settings } from '$/stores';

	let imageReload;

	function updateFeeds() {
		$editingFeed = $editingFeed;
	}

	let showUpload = false;
	let imageType = 'albumSquare';

	$: if (imageReload) {
		showUpload = false;
		updateFeeds();
	}
</script>

<section>
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
		<album-art
			on:click={() => {
				showUpload = true;
				imageType = 'albumSquare';
			}}
		>
			<h4>Album Art</h4>

			<img
				src={$editingFeed?.['itunes:image']?.['@_href'] + '?t=' + imageReload}
				alt="album art - click to edit"
				class="album"
			/>
			<button class:hide={!$settings?.bunny?.active}><UploadFileIcon size="20" /></button>
		</album-art>
		<banner-art
			on:click={() => {
				showUpload = true;
				imageType = 'albumBanner';
				console.log('yo');
			}}
		>
			<h4>Banner Art</h4>
			<img
				src={$editingFeed?.['podcast:aspectImage']?.find((v) => v?.['@_aspect-ratio'] === '6/1')?.[
					'@_src'
				] +
					'?t=' +
					imageReload}
				alt="banner art - click to edit"
				class="banner"
			/>
			<button class:hide={!$settings?.bunny?.active}><UploadFileIcon size="20" /></button>
		</banner-art>

		<description>
			<h4>Description</h4>
			<textarea bind:value={$editingFeed.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={$editingFeed['podcast:value']['podcast:valueRecipient']} />
		</value>
	</info-2>
</section>

{#if showUpload}
	<SmallModal
		closeModal={() => {
			showUpload = false;
		}}
	>
		<ArtUpload bind:imageReload imageParent="album" {imageType} />
	</SmallModal>
{/if}

<style>
	section {
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
		margin-top: 8px;
		display: grid;
		grid-template-columns: 100px 472px calc(100% - 572px); /* First column fixed, B and C flexible */
		grid-template-rows: 120px 200px; /* Two rows */
		gap: 8px; /* Adjust spacing between items */
		width: 100%; /* Full width of the container */
		height: 320px;
	}

	album-art {
		grid-column: 1; /* First column */
		grid-row: 1; /* First row */
		width: 100%;
		height: 178px;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	img.album {
		cursor: pointer;
		height: 100px;
		width: 100px;
		border: 1px solid black;
		border-radius: 5px;
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

	/* Adjust the banner to maintain a 6:1 ratio */
	img.banner {
		margin-top: 10px;
		height: 78.2px;
		min-height: 78.2px;
		width: calc(78.2px * 6);
		cursor: pointer;
		border: 1px solid black;
		border-radius: 5px;
		justify-self: flex-end;
	}

	h4 {
		margin: 0 8px;
		text-align: left;
		width: 100%;
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

	album-art > button {
		position: absolute;
		bottom: 52px;
		right: -8px;
	}

	banner-art > button {
		position: relative;
		bottom: 30px;
		left: 442px;
	}

	.hide {
		display: none;
	}
</style>
