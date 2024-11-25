<script>
	import ValueBlock from '$lib/Editor/ValueBlock/ValueBlock.svelte';
	import ExplicitToggle from '$lib/Editor/ExplicitToggle.svelte';
	import Artwork from '$lib/Editor/Artwork/Artwork.svelte';
	import ToolTip from '$lib/Editor/ToolTip.svelte';

	import { editingFeed } from '$/stores';
</script>

<section>
	<ul>
		<li>
			<h4>Band/Artist</h4>
			<ToolTip>
				<p class="tooltip">Enter the name of the Arist or Band</p>
			</ToolTip>
		</li>
		<li>
			<h4>Album</h4>
			<ToolTip>
				<p class="tooltip">Enter the name of your Album</p>
			</ToolTip>
		</li>
		<li>
			<h4>Website</h4>
			<ToolTip>
				<p class="tooltip">
					Where would you like the listener to go to find out more info about the album,<br />
					could be any website, online store, social media page, etc.
				</p>
			</ToolTip>
		</li>
		<li>
			<h4>Explicit</h4>
			<ToolTip>
				<p class="tooltip">Are there any F bombs or inappropriate language used in this album?</p>
			</ToolTip>
		</li>
	</ul>

	<ul class="inputs">
		<li><input bind:value={$editingFeed['itunes:author']} /></li>
		<li><input bind:value={$editingFeed.title} /></li>
		<li><input bind:value={$editingFeed.link} /></li>
		<li><ExplicitToggle bind:checked={$editingFeed['itunes:explicit']} /></li>
	</ul>
	<info-2>
		<album-art>
			<div>
				<h4>Album Art</h4>
				<ToolTip>
					<p class="tooltip">
						Click the image to change the URL to the image cover art for your album
					</p>
				</ToolTip>
			</div>
			<Artwork src={$editingFeed?.['itunes:image']?.['@_href']} parent="album" shape="square" />
		</album-art>
		<banner-art>
			<div>
				<h4>Banner Art</h4>
				<ToolTip>
					<p class="tooltip">Click the image to change the URL to the banner art for your album</p>
				</ToolTip>
			</div>
			<Artwork
				src={$editingFeed?.['podcast:aspectImages']?.find((v) => v?.['@_aspect-ratio'] === '6/1')?.[
					'@_src'
				]}
				parent="album"
				shape="banner"
			/>
		</banner-art>

		<description>
			<div>
				<h4>Description</h4>
				<ToolTip>
					<p class="tooltip">
						Interesting facts about this album. Could be anything <br />
						such as list of band members, genre of music, date album was recorded,<br />
						fun facts about the album. Whatever you want to share with the audience.
					</p>
				</ToolTip>
			</div>
			<textarea bind:value={$editingFeed.description} />
		</description>
		<value>
			<ValueBlock bind:valueBlock={$editingFeed['podcast:value']['podcast:valueRecipient']} />
		</value>
	</info-2>
</section>

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
		justify-content: flex-start;
		padding: 0;
		cursor: initial;
		margin: 0 4px;
	}
	li:last-of-type {
		min-width: 90px;
		max-width: 90px;
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
		grid-template-columns: 110px 472px calc(100% - 582px); /* First column fixed, B and C flexible */
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

	banner-art {
		grid-column: 2;
		grid-row: 1;
		width: calc ((100% - 150px) / 2);
		height: 102px;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	album-art > div,
	banner-art > div,
	description > div {
		display: flex;
	}

	/* Adjust the banner to maintain a 6:1 ratio */

	h4 {
		margin: 0 8px;
		text-align: left;
		display: inline-block;
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

	p.tooltip {
		padding: 0%;
		color: white;
		margin: 0;
	}
</style>
