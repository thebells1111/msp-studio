<script>
	import Close from '../icons/Close.svelte';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';

	import {
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		catalogDB,
		selectedScreen,
		MSPValue
	} from '$/stores';

	import { onMount } from 'svelte';

	export let add = false;
	export let showEdit = false;
	let newAlbumName = '';
	let newAlbumImage = '';
	let newAlbumValue = [];

	onMount(() => {
		newAlbumName = $selectedAlbum.title || '';
		newAlbumImage = $selectedAlbum.artwork || '';
		newAlbumValue =
			$selectedAlbum.value && $selectedAlbum.value.length > 0 ? $selectedAlbum.value : [$MSPValue];
	});

	async function addNewAlbum() {
		let album = {};
		album.title = newAlbumName;
		album.artwork = newAlbumImage;
		album.tracks = [];
		album.value = [$MSPValue];
		$selectedAlbum = album;
		$selectedBand.albums = $selectedBand.albums.concat($selectedAlbum);
		$selectedAlbumIndex = $selectedBand.albums.length - 1;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showAddNewButton = true;
	}

	async function saveAlbum() {
		$selectedAlbum.title = newAlbumName;
		$selectedAlbum.artwork = newAlbumImage;
		$selectedAlbum.value = newAlbumValue;
		$selectedBand.albums[$selectedAlbumIndex] = $selectedAlbum;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showEdit = false;
	}

	function closeModal() {
		showEdit = false;
		add ? addNewAlbum() : saveAlbum();
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<album-modal>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>

		<top-container>
			<img
				width="203"
				height="203"
				alt={newAlbumImage ? `${`${newAlbumImage} ` || ''}cover art` : 'add Album Image link'}
				src={newAlbumImage}
			/>
			<album-inputs>
				<label class="album-name">
					<p>Album Name (required)</p>
					<input bind:value={newAlbumName} />
				</label>
				<label>
					<p>Link to Album Image (required)</p>
					<input bind:value={newAlbumImage} />
				</label>
			</album-inputs>
		</top-container>
		<value>
			<ValueBlock bind:valueBlock={newAlbumValue} />
		</value>
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
		width: calc(100% - 100px);
		height: calc(100% - 100px);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		border-radius: 8px;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
	}

	label {
		width: 100%;
		margin: 8px;
	}
	.album-name {
		margin: 32px 8px;
	}

	label input {
		margin: 0 8px;
		width: calc(100% - 40px);
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

	value {
		padding: 16px;
	}
</style>
