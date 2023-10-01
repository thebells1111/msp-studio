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

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<album-modal transition:fade|global={{ duration: 25 }}>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<scroll-container>
			<top-container>
				{#if albumState['itunes:image']['@_href']}
					<img
						class="upload"
						on:click={() => {
							showUpload = true;
						}}
						width="258"
						height="258"
						alt={albumState.title
							? `${`${albumState.title} ` || ''}cover art`
							: 'add Album Image link'}
						src={albumState['itunes:image']['@_href'] + '?t=' + imageReload}
					/>{:else}
					<button
						class="upload"
						on:click={() => {
							showUpload = true;
						}}>Click to upload Album Art<br />(required)</button
					>
				{/if}

				<album-inputs>
					<band-name>
						<label>
							<h4>Band Name (required)</h4>
							<input bind:value={albumState['itunes:author']} />
						</label>
					</band-name>
					<album-name>
						<label>
							<h4>Album Name (required)</h4>
							<input bind:value={albumState.title} />
						</label>
					</album-name>
					<album-link>
						<label>
							<h4>Link to Album Website (required)</h4>
							<input bind:value={albumState.link} />
						</label>
					</album-link>
					<explicit>
						<h4>Explicit Content (required)</h4>
						<explicit-radio>
							<label>
								<input
									type="radio"
									bind:group={albumState['itunes:explicit']}
									name="explicit"
									value={'no'}
								/>
								No
							</label>
							<label>
								<input
									type="radio"
									bind:group={albumState['itunes:explicit']}
									name="explicit"
									value={'yes'}
								/>
								Yes
							</label>
						</explicit-radio>
					</explicit>
					<button
						class="add"
						on:click={() => {
							showUpload = true;
						}}>Add Artwork (required)</button
					>
				</album-inputs>
			</top-container>
			<spacer />
			<bottom-pane>
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
			</bottom-pane>
		</scroll-container>
		<button class="submit" on:click={handleSubmit}>Submit</button>
	</album-modal>
</blurred-background>

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

	album-modal {
		position: relative;
		display: flex;
		flex-direction: column;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow: hidden;
		border-radius: 8px;
		padding: 8px;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
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

	band-name input,
	album-name input,
	album-link input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	button.add {
		background-color: var(--color-bg-add-shade-2);
		margin: 8px;
		width: calc(100% - 32px);
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
	}

	h4 {
		padding: 0;
		margin: 0;
	}
	.close {
		position: fixed;
		top: 16px;
		right: 16px;
		background-color: transparent;
		padding: 8px;
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
	}

	top-container {
		width: 100%;
		display: flex;
		justify-content: center;
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

	@media screen and (max-width: 992px) {
		album-modal {
			width: calc(100% - 16px);
			height: calc(100% - 16px);
			border-radius: 0px;
			padding: 8px;
			overflow: auto;
		}
		top-container {
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
			margin: 16px 16px 0 8px;
		}

		album-inputs {
			width: calc(100% - 8px);
			margin: 0 8px;
		}

		.album-description {
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

		tracks {
			width: 100%;
			position: relative;
		}
	}
</style>
