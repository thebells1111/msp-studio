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
		{#each valueBlock || [] as p, i}
			<li>
				<EditPerson person={valueBlock[i]} index={i} />
			</li>
		{/each}
	</ul>

	<button on:click={addPerson}>Add New Recipient</button>
	<button on:click={save}>Save</button>
</value-block>

<style>
	value-block {
	}
</style>
