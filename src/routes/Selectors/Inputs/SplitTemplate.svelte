<script>
	import Split from 'split.js';
	import { onMount } from 'svelte';

	let input0, input1, input2, input3, input4;

	onMount(() => {
		const split = Split(['#split-0', '#split-1', '#split-2', '#split-3'], {
			gutterSize: 6,
			minSize: 20,

			onDrag: () => {
				const sizes = split.getSizes();
				[input0, input1, input2, input3].forEach((input, i) => {
					input.style.width = sizes[i] + '%';
				});
			}
		});
		return () => split.destroy();
	});
</script>

<album-input>
	<div class="split">
		<div id="split-0">Band</div>
		<div id="split-1">Album</div>
		<div id="split-2">Website</div>
		<div id="split-3">Artwork</div>
		<div id="split-4">Explicit</div>
	</div>
	<input-container>
		<div bind:this={input0}><input /></div>
		<div bind:this={input1}><input /></div>
		<div bind:this={input2}><input /></div>
		<div bind:this={input3}><input /></div>
		<div bind:this={input4} />
	</input-container>
</album-input>

<style>
	:global(.gutter) {
		position: relative;
		background-color: transparent;
	}

	:global(.gutter.gutter-horizontal) {
		cursor: col-resize;
	}
	album-input {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-right: 4px;
	}
	.split {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		height: 24px;
		border: 2px solid black;
		border-bottom: none;
	}

	.split > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#split-4 {
		min-width: 60px;
		max-width: 60px;
	}

	input-container {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	input-container > div {
		width: calc(100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		border-radius: 0px;
		box-sizing: border-box;
		border: 2px solid black;
		border-right: none;
		position: relative;
	}

	input-container > div::after {
		content: '';
		position: absolute;
		bottom: 0%;
		right: -2px;
		height: calc(200% + 8px);
		border-left: 2px solid black;
	}

	input-container > div:last-of-type {
		min-width: 59px;
		max-width: 59px;
		margin: 0;
		padding: 0;
		border-radius: 0px;
		display: inline-block;
		border: 2px solid black;
	}

	input {
		width: 100%;
		height: 100%;
		padding: 0;
	}
</style>
