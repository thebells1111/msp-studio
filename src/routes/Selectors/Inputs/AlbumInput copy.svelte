<script>
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Close from '$icons/Close.svelte';
	import Tracks from '../Tracks.svelte';
	import ValueBlock from '$routes/ValueBlock/ValueBlock.svelte';
	import FileUploader from '$routes/Modals/FileUploader.svelte';
	import postFeeds from '$routes/functions/postFeeds.js';

	import { MSPValue, editingFeed, feeds } from '$/stores';

	export let add;

	export let showEdit = false;
	let podcastGuid = '';

	let newAlbumImage = '';

	let albumState = {
		'podcast:guid': '',
		title: '',
		'itunes:author': '',
		'itunes:image': { '@_href': '' },
		link: '',
		description: '',
		'itunes:owner': {
			'@_itunes:name': '',
			'@_itunes:email': ''
		},
		'itunes:explicit': 'no',
		'podcast:value': {
			'@_type': 'lightning',
			'@_method': 'keysend',
			'podcast:valueRecipient': []
		},
		item: []
	};

	let showUpload = false;
	let hideTracks = false;
	let imageReload;

	onMount(async () => {
		if (add) {
			let res = await fetch('/blankFeed.json');
			$editingFeed = await res.json();
		}
		if (!$editingFeed['podcast:guid']) {
			$editingFeed['podcast:guid'] = await createNewPodcastGuid();
		}

		const {
			'podcast:guid': guid,
			'itunes:author': author,
			title,
			'itunes:image': img,
			link,
			description,
			'itunes:explicit': explicit,
			'podcast:value': value,
			item,
			'itunes:owner': owner
		} = $editingFeed || {};

		albumState = {
			'podcast:guid': guid,
			'itunes:author': author || '',
			title: title || '',
			'itunes:image': { '@_href': img?.['@_href'] || '' },
			link: link || '',
			description: description || '',
			'itunes:explicit': explicit || 'no',
			'itunes:owner': {
				'@_itunes:name': author || '',
				'@_itunes:email': ''
			},
			'podcast:value': {
				'@_type': 'lightning',
				'@_method': 'keysend',
				'podcast:valueRecipient': value?.['podcast:valueRecipient']?.length
					? value['podcast:valueRecipient']
					: [],
				item: item || []
			}
		};

		console.log(albumState);
	});

	async function saveAlbum() {
		Object.assign($editingFeed, albumState);
		$feeds[albumState['podcast:guid']] = $editingFeed;
		await postFeeds($feeds);
	}

	function closeModal() {
		showEdit = false;
		$editingFeed = {};
	}

	function handleSubmit() {
		showEdit = false;
		saveAlbum();
	}

	async function createNewPodcastGuid() {
		let guid = await generateValidGuid();
		return guid;
	}

	function checkValidGuid(input) {
		const regex = new RegExp(
			'^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$'
		);
		return regex.test(input);
	}

	async function generateValidGuid() {
		const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
		const inputString = uuidv4();
		const uniqueId = uuidv5(inputString, namespace);

		return uniqueId;
	}


</script>


<Grid data={data} />

<top-container>
	<title-bar>
		<h4>Band Name</h4>
		<h4>Album Name</h4>
		<h4>Website Link</h4>
		<h4>Explicit Content</h4>
		<h4>Artwork Link</h4>
	</title-bar>

	<album-inputs>
		<input bind:value={albumState['itunes:author']} />

		<input bind:value={albumState.title} />
		<input bind:value={albumState.link} />

		<input type="checkbox" bind:group={albumState['itunes:explicit']} />

		<input bind:value={albumState['itunes:image']['@_href']} />
	</album-inputs></top-container
>
<spacer />
{#if albumState['itunes:image']['@_href']}
	<img
		class="upload"
		on:click={() => {
			showUpload = true;
		}}
		width="258"
		height="258"
		alt={albumState.title ? `${`${albumState.title} ` || ''}cover art` : 'add Album Image link'}
		src={albumState['itunes:image']['@_href'] + '?t=' + imageReload}
	/>{:else}
	<button
		class="upload"
		on:click={() => {
			showUpload = true;
		}}>Click to upload Album Art<br />(required)</button
	>
{/if}
<!-- <bottom-pane>
			<label class="album-description">
				<h4>Album Liner Notes (required)<br /> Tell the audience the story of this album</h4>
				<textarea bind:value={albumState.description} />
			</label>
			<value>
				<ValueBlock
					bind:valueBlock={albumState['podcast:value']['podcast:valueRecipient']}
					bind:hideTracks
				/>
			</value>
			<tracks class:hide={hideTracks}>
				<Tracks albumValueBlock={albumState['podcast:value']} />
			</tracks>
		</bottom-pane> -->

{#if showUpload}
	<FileUploader
		bind:showModal={showUpload}
		bind:filePath={albumState['itunes:image']['@_href']}
		bind:fileReload={imageReload}
		fileName="artwork"
		folderName={albumState['podcast:guid']}
		type="image"
	/>
{/if}

<style>
	scroll-container {
		display: block;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		flex: 1;
	}

	bottom-pane {
		display: flex;
		align-items: flex-start;
	}

	.album-description {
		min-width: 33%;
		display: block;
		margin: 0 16px 16px 0;
	}

	.album-description textarea {
		width: 100%;
		height: 200px;
		resize: none;
	}

	label {
		display: block;
		margin: 0 16px 16px 0;
	}

	spacer {
		display: flex;
		margin: 8px;
		width: calc(100% - 32px);
		height: 12px;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	top-container {
		width: 100%;
	}

	album-inputs,
	title-bar {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		margin: 8px 0 0 0;
	}

	album-inputs {
		width: 100%;
		margin: 8px 0 0 8px;
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

	tracks {
		display: block;
		width: 33%;
		right: 0;
		height: 100%;
	}

	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
		min-width: 258px;
	}

	input::placeholder {
		color: red;
		font-weight: bold;
	}

	button.upload {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
		min-width: 258px;
		min-height: 258px;
		height: 258px;
		background-color: transparent;
	}


