<script>
	import { fade } from 'svelte/transition';
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';
	import Add from '../icons/GroupAdd.svelte';
	import Close from '../icons/Close.svelte';
	import SmallModal from '../Modals/SmallModal.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];
	let showPersonEdit = true;
	let selectedIndex = -1;
	export let hideTracks = false;

	// $: if (window) {
	// 	hideTracks = window?.innerWidth >= 992 && showPersonEdit;
	// }

	$: console.log(hideTracks);

	function addPerson() {
		valueBlock = valueBlock.concat({ ...$newPerson });
		selectedIndex = valueBlock.length - 1;
		showPersonEdit = true;
	}

	$: splitTotal = valueBlock.reduce((t, v) => {
		return t + Number(v['@_split']);
	}, 0);

	$: if (selectedIndex === -1) {
		showPersonEdit = false;
	}

	function closeModal() {
		showPersonEdit = false;
	}
</script>

<value-block>
	<left-pane>
		<header>
			<h4>Value Recipients</h4>
		</header>
		{#if valueBlock?.length}
			<instructions>for splits, use whole numbers only</instructions>
		{/if}
		<value-header>
			{#if valueBlock?.length}
				<split-percent>Split %</split-percent>
				<split-name>Name</split-name>
			{:else}
				<click-help>Click here to create your value block. <span>→</span></click-help>
			{/if}
			<button class="add-value" on:click={addPerson}><Add size="24" /></button>
		</value-header>
		<ul>
			{#each valueBlock || [] as person, index}
				<li>
					<EditPerson bind:person bind:showPersonEdit bind:valueBlock bind:selectedIndex {index} />
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
</value-block>

{#if showPersonEdit}
	<SmallModal {closeModal}>
		<address-container>
			<EditAddress bind:valueBlock {selectedIndex} />
		</address-container>
	</SmallModal>
{/if}

<style>
	value-block {
		display: flex;
		width: 100%;
	}

	left-pane {
		width: 100%;
	}

	address-container {
		display: block;
		width: 400px;
		max-width: calc(100vw - 60px);
		height: 416px;
	}

	click-help {
		display: block;
		font-size: 1.1em;
		color: red;
		position: relative;
		bottom: 15px;
		left: 0;
	}

	click-help span {
		font-size: 1.4em;
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
		text-align: left;
	}

	instructions {
		display: block;
		font-style: italic;
		font-size: 0.9em;
		margin: 2px 0 0 8px;
	}
	value-header,
	value-footer {
		display: block;
		padding: 8px 0 0 12px;
	}

	value-header {
		border-bottom: 1px solid var(--color-text-0);
		margin-bottom: 8px;
		padding-bottom: 4px;
		position: relative;
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
		background-color: var(--color-bg-add-band);
		color: var(--color-text-0);
		padding: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
		position: absolute;
		top: -14px;
		right: 0;
	}
</style>
