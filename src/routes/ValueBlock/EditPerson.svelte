<script>
	import PersonValue from './PersonValue.svelte';
	export let person = {};
	let showPersonEdit = false;
</script>

<person>
	<p>{person.name}</p>
	<p>{person.split}%</p>
	<button
		on:click={() => {
			showPersonEdit = !showPersonEdit;
		}}
	>
		Edit Recipient
	</button>
</person>
{#if showPersonEdit}
	<PersonValue bind:person />
{/if}

<style>
	person {
		display: flex;
		align-items: center;
	}

	p {
		margin: 0 8px 0 0;
	}
</style>
