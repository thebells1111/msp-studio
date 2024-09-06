<script>
	import { SortableList } from '@jhubbardsf/svelte-sortablejs';
	let exampleItems = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'];

	function handleSort(e) {
		const { oldIndex, newIndex } = e;
		// Move the item in the array
		if (oldIndex !== newIndex) {
			const movedItem = exampleItems.splice(oldIndex, 1)[0];
			exampleItems.splice(newIndex, 0, movedItem);
		}
		console.log('Sorted items:', exampleItems);
	}
</script>

<SortableList onSort={handleSort} animation={150} ghostClass="ghost-item">
	{#each exampleItems as item}
		<div class="list-group-item">
			{item}
		</div>
	{/each}
</SortableList>

<style>
	.list-group-item {
		padding: 8px;
		margin: 4px;
		border: 1px solid white;
		transition: background-color 0.2s;
	}

	.list-group-item:hover {
		cursor: grab;
		background-color: black;
	}

	.ghost-item {
		background-color: #cce5ff !important; /* Change to a noticeable background when dragging */
		border: 1px dashed #007bff;
	}
</style>
