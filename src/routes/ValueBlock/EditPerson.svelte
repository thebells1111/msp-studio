<script>
	import EditSquare from '../icons/EditSquare.svelte';
	import Delete from '../icons/PersonRemove.svelte';

	export let person = {};
	export let showPersonEdit = false;
	export let valueBlock;
	export let index;
	export let selectedIndex;

	function deletePerson() {
		valueBlock.splice(index, 1);
		valueBlock = valueBlock;
		selectedIndex = -1;
	}
</script>

<person>
	<input class="split" type="text" bind:value={person['@_split']} /><span>%</span>
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

	person-name {
		display: flex;
		position: relative;
		flex-grow: 1;
	}

	edit {
		position: relative;
		top: 1px;
	}

	person-name p {
		margin: 0 0 0 8px;
	}

	.split {
		margin: 0 0 0 8px;
		width: 30px;
	}

	span {
		margin: 0 16px 0 0;
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
