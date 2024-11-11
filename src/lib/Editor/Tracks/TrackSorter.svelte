<script>
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	export let tracks = [];

	function handleSort(e) {
		console.log(e);
		const { oldIndex, newIndex } = e;
		// Move the item in the array
		if (oldIndex !== newIndex) {
			const movedItem = tracks.splice(oldIndex, 1)[0];
			tracks.splice(newIndex, 0, movedItem);
		}
		console.log('Sorted items:', tracks);
	}

	let foo;

	onMount(async function () {
		Sortable.create(foo, {
			group: {
				name: 'foo',
				put: true,
				pull: false
			},
			animation: 200,
			onSort: handleSort
		});
	});
</script>

<track-list-container>
	<ul>
		{#each tracks as track, i}
			<li>{i + 1}.</li>
		{/each}
	</ul>
	<sortable-list-container bind:this={foo}>
		{#each tracks as track}
			<div class="list-group-item">
				{track.title}
			</div>
		{/each}
	</sortable-list-container>
</track-list-container>

<style>
	.list-group-item {
		padding: 0 8px;
		margin: 4px;
		border: 1px solid white;
		transition: background-color 0.2s;
		min-height: 40px;
		display: flex;
		align-items: center;
	}

	.list-group-item:hover {
		cursor: grab;
		background-color: black;
	}

	track-list-container {
		display: flex;
		width: 100%;
	}

	sortable-list-container {
		width: 100%;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	li {
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		list-style: none;
		margin: 4px;
	}
</style>
