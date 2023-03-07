<script>
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];
	let selectedPerson = {};
	let showPersonEdit = false;

	function addPerson() {
		valueBlock = valueBlock.concat($newPerson);
	}

	function save() {
		console.log(valueBlock);
	}
</script>

<value-block>
	<right-pane>
		<h3>Value Recipients</h3>
		<p>for splits, use whole numbers only</p>
		<value-header>
			<split-percent>Split %</split-percent>
			<split-name>Name</split-name>
		</value-header>
		<ul>
			{#each valueBlock || [] as person, i}
				<li>
					<EditPerson {person} bind:showPersonEdit bind:selectedPerson />
				</li>
			{/each}
		</ul>
		<value-header>
			<total>
				<total-percent>100%</total-percent>
			</total></value-header
		>

		<button on:click={addPerson}>Add New Recipient</button>
	</right-pane>
	<left-pane
		>{#if showPersonEdit}
			<EditAddress bind:selectedPerson />
		{/if}</left-pane
	>
</value-block>

<style>
	value-block {
		display: flex;
		width: 100%;
	}

	right-pane,
	left-pane {
		width: 50%;
	}
	ul {
		padding: 0;
	}
	li {
		list-style-type: none;
	}
	h3 {
		margin: 0;
	}
</style>
