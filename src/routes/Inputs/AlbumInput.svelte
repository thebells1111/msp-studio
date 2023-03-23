<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Close from '../icons/Close.svelte';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import UploadFile from '../icons/UploadFile.svelte';

	import {
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		catalogDB,
		selectedScreen,
		MSPValue,
		currentModal,
		uploadCB,
		uploadFileType,
		uploadFileText,
		user
	} from '$/stores';

	export let showEdit = false;
	let newAlbumName = '';
	let newAlbumImage = '';
	let newAlbumLink = '';
	let newAlbumValue = [];
	let newAlbumDescription = '';
	let explicit = 'no';

	onMount(() => {
		newAlbumName = $selectedAlbum.title || '';
		newAlbumImage = $selectedAlbum.artwork || '';
		newAlbumLink = $selectedAlbum.link || '';
		newAlbumValue =
			$selectedAlbum.value && $selectedAlbum.value.length > 0 ? $selectedAlbum.value : [$MSPValue];
		newAlbumDescription = $selectedAlbum.description || '';
		explicit = $selectedAlbum.explicit || 'no';
	});

	async function saveAlbum() {
		$selectedAlbum.title = newAlbumName;
		$selectedAlbum.artwork = newAlbumImage;
		$selectedAlbum.value = newAlbumValue;
		$selectedAlbum.description = newAlbumDescription;
		$selectedAlbum.explicit = explicit;
		$selectedAlbum.link = newAlbumLink;
		$selectedBand.albums[$selectedAlbumIndex] = $selectedAlbum;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showEdit = false;
	}

	function closeModal() {
		showEdit = false;
		saveAlbum();
	}

	function setImage(url) {
		newAlbumImage = url;
	}

	function handleImageUpload() {
		if (newAlbumName) {
			$currentModal = 'fileUploader';
			$uploadCB = setImage;
			$uploadFileType = 'image';
			$uploadFileText = 'Upload Album Image';
			$selectedAlbum.title = newAlbumName;
		}
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<album-modal transition:fade={{ duration: 25 }}>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>

		<top-container>
			<img
				width="258"
				height="258"
				alt={newAlbumImage ? `${`${newAlbumImage} ` || ''}cover art` : 'add Album Image link'}
				src={newAlbumImage}
			/>
			<album-inputs>
				<album-name>
					<label>
						<p>Album Name (required)</p>
						<input
							bind:value={newAlbumName}
							placeholder={$user.wpCreds ? 'Add an Album Name before uploading files.' : ''}
						/>
					</label>
				</album-name>
				<album-image class:uploadable={$user.wpCreds}>
					<label>
						<p>Link to Album Image (required)</p>
						<input bind:value={newAlbumImage} />
						{#if $user.wpCreds}
							<upload>
								<button on:click={handleImageUpload}>
									<UploadFile size="24" />
									upload <br /> image
								</button>
							</upload>
						{/if}
					</label>
				</album-image>
				<album-link>
					<label>
						<p>Link to Album Website (optional)</p>
						<input bind:value={newAlbumLink} />
					</label>
				</album-link>
				<explicit>
					<p>Explicit Content (required)</p>
					<explicit-radio>
						<label>
							<input type="radio" bind:group={explicit} name="explicit" value={'no'} />
							No
						</label>
						<label>
							<input type="radio" bind:group={explicit} name="explicit" value={'yes'} />
							Yes
						</label>
					</explicit-radio>
				</explicit>
			</album-inputs>
		</top-container>
		<bottom-pane>
			<label class="album-description">
				<h4>Album Description (required)</h4>
				<textarea bind:value={newAlbumDescription} />
			</label>
			<value>
				<ValueBlock bind:valueBlock={newAlbumValue} />
			</value>
		</bottom-pane>
	</album-modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	album-modal {
		position: relative;
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

	bottom-pane {
		display: flex;
		align-items: flex-start;
		margin: 16px 16px 0 8px;
	}

	.album-description {
		min-width: 33%;
		margin: 8px 0 0 8px;
	}

	.album-description textarea {
		width: calc(100% - 16px);
		height: 200px;
		resize: none;
		margin: 8px 0 0 8px;
	}

	album-image {
		display: block;
		margin: 16px 0;
	}
	album-name label,
	album-image label,
	album-link label {
		width: 100%;
	}

	album-name input,
	album-image input,
	album-link input {
		margin: 0 8px;
		width: calc(100% - 40px);
	}

	album-image.uploadable input {
		margin: 0 8px;
		width: calc(100% - 116px);
	}
	upload {
		display: inline-flex;
		position: relative;
		height: 12px;
		width: 12px;
	}

	upload button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.7em;
		padding: 0;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		position: absolute;
		top: -25px;
		right: -50px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}

	explicit {
		margin-top: 16px;
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

	p {
		padding: 0;
		margin: 0;
	}
	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
	}

	top-container {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: 16px 0 0 16px;
	}

	album-inputs {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	value {
		margin-left: 8px;
		flex-grow: 1;
	}
	img {
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
		min-width: 258px;
	}

	input::placeholder {
		color: red;
		font-weight: bold;
	}
</style>
