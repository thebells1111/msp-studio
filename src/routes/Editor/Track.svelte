<script>
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';

	import clone from 'just-clone';

	import { onMount } from 'svelte';

	import { newTrack, editingFeed } from '$/stores';

	export let track = clone($newTrack);
	export let trackNumber = 1;
</script>

<container>
	<h3>Track #{trackNumber}</h3>
	<ul>
		<li><h4>Title</h4></li>
		<li><h4>Link to mp3</h4></li>
		<li><h4>Explicit</h4></li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={track.title} /></li>
		<li><input bind:value={track.enclosure['@_url']} /></li>
		<li><input bind:value={track.explicit} /></li>
	</ul>
	<info-2>
		<artwork>
			<h4>Track Art</h4>
			<img src={track['itunes:image']['@_href']} alt="track art - click to edit" />
			<p>Click Image<br /> to <br />Change Artwork</p>
		</artwork>
		<description>
			<h4>Description</h4>
			<textarea bind:value={track.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={track['podcast:value']['podcast:valueRecipient']} />
		</value>
	</info-2>
</container>

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 8px);
	}
	ul {
		display: flex;
		justify-content: space-between;
		border: 2px solid black;
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
		border-right: 1px solid black;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0;
		cursor: initial;
	}
	li:last-of-type {
		min-width: 80px;
		max-width: 80px;
	}

	.inputs {
		height: 30px;
		border-top: none;
		border-bottom: none;
	}

	input {
		width: calc(100% - 4px);
		border-radius: 0;
	}

	info-2 {
		display: flex;
		width: 100%;
		height: 300px;
		border: 2px solid black;
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
		border-top: 2px solid black;
		border-bottom: 1px solid black;
	}

	h3 {
		margin-bottom: 0;
	}

	h4 {
		margin: 0;
		text-align: center;
		background-color: aqua;
		width: 100%;
	}
	description {
		display: block;
		width: calc((100% - 150px) / 2);
		border-left: 1px solid black;
		display: flex;
		flex-direction: column;
	}

	textarea {
		resize: none;
		height: 100%;
		border-top: 2px solid black;
	}

	value {
		display: block;
		width: calc((100% - 150px) / 2);
		border-left: 1px solid black;
	}
</style>
