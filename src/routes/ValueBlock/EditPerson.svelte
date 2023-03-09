<script>
	export let person = {};
	export let selectedPerson = {};
	export let showPersonEdit = false;
	import EditSquare from '../icons/EditSquare.svelte';
	import Delete from '../icons/Delete.svelte';
</script>

<person>
	<button class="delete">
		<Delete size="20" />
	</button>
	<input class="split" type="text" bind:value={person.split} /><span>%</span>
	<person-name
		on:click={() => {
			if (JSON.stringify(selectedPerson) === JSON.stringify(person)) {
				showPersonEdit = !showPersonEdit;
			} else {
				showPersonEdit = true;
				selectedPerson = person;
			}
		}}
	>
		<edit>
			<EditSquare />
		</edit>
		<p>{person.name || 'Blank Person'}</p>
	</person-name>
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
