<script>
	import PersonValue from './PersonValue.svelte';
	export let person = {};
	export let index;
	let showPersonEdit = false;
</script>

<p>{index}. {person.name}</p>
<button
	on:click={() => {
		showPersonEdit = !showPersonEdit;
	}}
>
	Edit Recipient
</button>
{#if showPersonEdit}
	<PersonValue bind:person />
{/if}
