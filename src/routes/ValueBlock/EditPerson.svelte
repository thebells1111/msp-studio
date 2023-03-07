<script>
	export let person = {};
	export let selectedPerson = {};
	export let showPersonEdit = false;
</script>

<person>
	<button
		on:click={() => {
			if (JSON.stringify(selectedPerson) === JSON.stringify(person)) {
				showPersonEdit = !showPersonEdit;
			} else {
				showPersonEdit = true;
				selectedPerson = person;
			}
		}}
	>
		Edit Recipient
	</button>
	<input class="split" type="text" bind:value={person.split} /><span>%</span>
	<p>{person.name}</p>
</person>

<style>
	person {
		display: flex;
		align-items: center;
	}

	.split {
		margin: 0;
		width: 30px;
	}

	span {
		margin: 0 8px 0 0;
	}
</style>
