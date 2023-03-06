<script>
	import EditPerson from './EditPerson.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];

	function addPerson() {
		valueBlock = valueBlock.concat($newPerson);
	}

	function save() {
		console.log(valueBlock);
	}
</script>

<value-block>
	<h3>Value Recipients</h3>
	<ul>
		{#each valueBlock || [] as person, i}
			<li>
				<EditPerson {person} />
			</li>
		{/each}
	</ul>

	<button on:click={addPerson}>Add New Recipient</button>
</value-block>

<style>
	li {
		list-style-type: none;
	}
</style>
