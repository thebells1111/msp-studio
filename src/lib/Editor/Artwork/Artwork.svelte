<script>
	import SmallModal from '$lib/Modals/SmallModal.svelte';
	import UploadFileIcon from '$icons/UploadFile.svelte';
	import VisibilityIcon from '$icons/Visibility.svelte';
	import ArtUpload from '$lib/Editor/Artwork/ArtUpload.svelte';

	import { editingFeed, settings, selectedFeed } from '$/stores';

	export let src = '';
	export let alt = '';
	export let parent = 'album';
	export let shape = 'square';
	export let track = null;
	let imageType = `${parent}-${shape}`;

	let imageReload;
	let showArt = false;

	$: if ($selectedFeed) {
		showArt = false;
	}

	function updateFeeds() {
		$editingFeed = $editingFeed;
	}

	let showUpload = false;

	$: if (imageReload) {
		showUpload = false;
		updateFeeds();
	}

	console.log(src);
</script>

<button
	class="artwork {shape}"
	class:low-bandwidth={$settings.lowBandwidth && !showArt && src}
	on:click={() => {
		showUpload = true;
	}}
>
	{#if $settings.lowBandwidth && !showArt && src}
		<p>low bandwidth</p>
		<p>click to edit</p>
		<button
			on:click|stopPropagation={() => {
				showArt = true;
			}}
			class="small show-art"
		>
			<VisibilityIcon size={28} />
		</button>
	{:else if src}
		<img src={`${src}?t=${imageReload}`} {alt} />
	{:else}
		<p>click to edit</p>
	{/if}
	<button class="small" class:hide={!$settings?.bunny?.active}><UploadFileIcon size="20" /></button>
</button>

{#if showUpload}
	<SmallModal
		closeModal={() => {
			showUpload = false;
		}}
	>
		<ArtUpload bind:imageReload {imageType} {track} />
	</SmallModal>
{/if}

<style>
	button.artwork {
		cursor: pointer;
		height: 100px;
		width: 100px;
		border: 1px solid black;
		border-radius: 5px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--color-input-bg-0);
		padding: 0;
		margin: 0;
	}

	button.artwork > p {
		margin: 4px;
		text-align: center;
		line-height: 0.8;
	}

	button.artwork > img {
		height: 100%;
		width: 100%;
		border-radius: 5px;
		position: absolute;
	}

	/* Adjust the banner to maintain a 6:1 ratio */
	button.banner {
		margin-top: 10px;
		height: 78.2px;
		min-height: 78.2px;
		width: calc(78.2px * 6);
		cursor: pointer;
		border: 1px solid black;
		border-radius: 5px;
		justify-self: flex-end;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button.small {
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
		position: absolute;
	}

	.square > button {
		bottom: -8px;
		right: -8px;
	}

	.banner > button {
		bottom: -8px;
		left: 442px;
	}

	.hide {
		display: none;
	}

	button.show-art {
		position: absolute;
		left: -8px;
		top: -8px;
		background-color: var(--color-bg-edit-album);
	}
</style>
