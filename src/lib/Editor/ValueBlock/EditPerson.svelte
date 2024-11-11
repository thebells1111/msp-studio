<script>
	import EditSquare from '$icons/EditSquare.svelte';
	import Delete from '$icons/PersonRemove.svelte';

	export let person = {};
	export let showPersonEdit = false;
	export let valueBlock;
	export let index;
	export let selectedIndex;
	export let splitTotal;

	function deletePerson() {
		valueBlock.splice(index, 1);
		valueBlock = valueBlock;
		selectedIndex = -1;
	}
</script>

<person>
	<input class="split" type="text" bind:value={person['@_split']} />

	<person-name
		on:click={() => {
			if (selectedIndex === index) {
				showPersonEdit = !showPersonEdit;
			} else {
				showPersonEdit = true;
				selectedIndex = index;
			}
		}}
	>
		<split>{Math.round((person['@_split'] / splitTotal) * 100 * 100) / 100}%</split>
		<edit>
			<EditSquare />
		</edit>

		<p>{person['@_name'] || 'Blank Person'}</p>
	</person-name>
	<button class="delete" on:click={deletePerson}>
		<Delete size="26" />
	</button>
</person>

<style>
	person {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	split {
		width: 55px;
		padding-left: 4px;
	}

	person-name {
		display: flex;
		align-items: center;
		position: relative;
		flex-grow: 1;
	}

	edit {
		position: relative;
	}

	person-name p {
		margin: 0 0 0 8px;
	}

	.split {
		margin: 0 0 0 8px;
		width: 55px;
	}

	button.delete {
		color: var(--color-bg-delete);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
