<script>
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from './ExplicitToggle.svelte';

	import clone from 'just-clone';

	import { onMount } from 'svelte';

	import { newTrack, editingFeed } from '$/stores';

	export let track = clone($newTrack);
	export let trackNumber = 1;
</script>

<container>
	<h3 class:first={trackNumber === 1}>Track #{trackNumber}</h3>
	<ul>
		<li><h4>Title</h4></li>
		<li><h4>Link to mp3</h4></li>
		<li><h4>Explicit</h4></li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={track.title} /></li>
		<li><input bind:value={track.enclosure['@_url']} /></li>
		<li><ExplicitToggle bind:checked={track.explicit} /></li>
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
		width: calc(100% - 16px);
	}
	ul {
		display: flex;
		justify-content: space-between;
		height: 18px;
		align-items: center;
		padding: 0 8px;
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
		min-width: 80px;
		max-width: 80px;
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
		padding: 0 8px;
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

	h3 {
		border-top: 1px solid var(--color-text-0);
		padding-top: 8px;
		color: var(--color-bg-add-band);
		margin-top: 8px;
		padding: 8px 8px 0 8px;
	}

	h3.first {
		padding-top: 0;
		border-top: none;
		padding: 0 8px;
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
</style>
