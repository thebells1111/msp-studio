<script>
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';
	import Add from '../icons/Add.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];
	let selectedPerson = {};
	let showPersonEdit = false;

	function addPerson() {
		valueBlock = valueBlock.concat({ ...$newPerson });
	}

	$: splitTotal = valueBlock.reduce((t, v) => {
		return t + Number(v.split);
	}, 0);
</script>

<value-block>
	<left-pane>
		<header>
			<h4>Value Recipients</h4>
			<button class="add-value" on:click={addPerson}><Add size="30" /></button>
		</header>
		<instructions>for splits, use whole numbers only</instructions>
		<value-header>
			<split-percent>Split %</split-percent>
			<split-name>Name</split-name>
		</value-header>
		<ul>
			{#each valueBlock || [] as person, i}
				<li>
					<EditPerson bind:person bind:showPersonEdit bind:selectedPerson />
				</li>
			{/each}
		</ul>
		<value-footer>
			<total>
				<total-percent>
					<span>{splitTotal || 0}</span> %
				</total-percent>
				<total-name>
					{#if splitTotal > 100}
						<warning>Splits exceed 100%</warning>
					{:else}
						Total
					{/if}
				</total-name>
			</total>
		</value-footer>
	</left-pane>
	<right-pane>
		{#if showPersonEdit}
			<EditAddress bind:selectedPerson />
		{/if}
	</right-pane>
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

	left-pane {
		padding-right: 8px;
	}

	header {
		display: flex;
		align-items: center;
	}
	ul {
		padding: 0;
		margin: 0;
	}
	li {
		list-style-type: none;
	}

	h4 {
		margin: 0;
	}

	instructions {
		display: block;
		font-style: italic;
		font-size: 0.9em;
		margin-left: 8px;
	}
	value-header,
	value-footer {
		display: block;
		padding: 8px 0 0 36px;
	}

	value-header {
		border-bottom: 1px solid var(--color-text-0);
		margin-bottom: 8px;
	}

	value-footer {
		border-top: 1px solid var(--color-text-0);
	}

	split-percent,
	total-percent {
		display: inline-block;
		width: 62px;
	}

	total-percent span {
		display: inline-block;
		width: 31px;
	}

	warning {
		color: red;
		font-weight: 550;
	}

	button.add-value {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
	}
</style>
