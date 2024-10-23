<script>
	import { SortableList } from '@jhubbardsf/svelte-sortablejs';
	export let tracks;

	function handleSort(e) {
		const { oldIndex, newIndex } = e;
		// Move the item in the array
		if (oldIndex !== newIndex) {
			const movedItem = tracks.splice(oldIndex, 1)[0];
			tracks.splice(newIndex, 0, movedItem);
		}
		console.log('Sorted items:', tracks);
	}
</script>

<track-list-container>
	<ul>
		{#each tracks as track, i}
			<li>{i + 1}.</li>
		{/each}
	</ul>
	<sortable-list-container>
		<SortableList onSort={handleSort} animation={150} ghostClass="ghost-item">
			{#each tracks as track}
				<div class="list-group-item">
					{track.title}
				</div>
			{/each}
		</SortableList>
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

	.ghost-item {
		background-color: #cce5ff !important; /* Change to a noticeable background when dragging */
		border: 1px dashed #007bff;
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
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		list-style: none;
		margin: 4px;
	}
</style>
