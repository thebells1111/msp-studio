<script>
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';

	import { onMount } from 'svelte';

	import { MSPValue, editingFeed, feeds } from '$/stores';

	$: console.log($editingFeed);
</script>

<container>
	<ul>
		<li><h4>Band/Artist</h4></li>
		<li><h4>Album</h4></li>
		<li><h4>Website</h4></li>
		<li><h4>Explicit</h4></li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={$editingFeed['itunes:author']} /></li>
		<li><input bind:value={$editingFeed.title} /></li>
		<li><input bind:value={$editingFeed.link} /></li>
		<li><input bind:value={$editingFeed.explicit} /></li>
	</ul>
	<info-2>
		<artwork>
			<h4>Album Art</h4>
			<img src={$editingFeed['itunes:image']['@_href']} alt="album art - click to edit" />
			<p>Click Image<br /> to <br />Change Artwork</p>
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

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100vw - 260px);
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

	h4 {
		margin: 0;
		text-align: center;
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
