<script>
	import clone from 'just-clone';
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';
	import Add from '$icons/GroupAdd.svelte';
	import SmallModal from '$lib/Modals/SmallModal.svelte';
	import ToolTip from '$lib/Editor/ToolTip.svelte';

	import { newPerson, MSPValue } from '$/stores';

	export let valueBlock = [];
	let showPersonEdit = true;
	let selectedIndex = -1;

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

	function addMSP() {
		valueBlock.unshift(clone(MSPValue));
		valueBlock = valueBlock;
	}
</script>

<value-block>
	<left-pane>
		<header>
			<h4>Value Recipients</h4>
			<ToolTip>
				<p class="tooltip">
					In this section we determine who gets a share of any value (bitcoin) <br />
					that is received by this album. Could be each band member, and / or anyone <br />
					who had a key role in the creation of the album that you would like <br />
					to split incoming bitcoin with. Could also be infrastructure costs such as <br />
					hosting, indexing, boostagram bots, etc.
				</p>
			</ToolTip>
		</header>
		{#if valueBlock?.length}
			<instructions>for splits, use whole numbers only</instructions>
		{/if}
		<value-header>
			{#if valueBlock?.length}
				<split-percent>Shares</split-percent>
				<span>%</span>
				<split-name>Name</split-name>
			{:else}
				<click-help>Click here to create your value block. <span>→</span></click-help>
			{/if}
			<button class="add-value" on:click={addPerson}><Add size="24" /></button>
		</value-header>
		<ul>
			{#if !valueBlock?.some((v) => v?.['@_address'] === '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8')}
				<button class="add-msp" on:click={addMSP}>
					Don't be a douche bag, click here to add MSP to your value block.
				</button>
			{/if}
			{#each valueBlock || [] as person, index}
				<li>
					<EditPerson
						bind:person
						bind:showPersonEdit
						bind:valueBlock
						bind:selectedIndex
						{index}
						{splitTotal}
					/>
				</li>
			{/each}
		</ul>
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
		margin: 0 8px 0 0;

		text-align: left;
	}

	instructions {
		display: block;
		font-style: italic;
		font-size: 0.9em;
		margin: 2px 0 0 8px;
	}
	value-header {
		display: block;
		padding: 8px 0 0 12px;
	}

	value-header {
		border-bottom: 1px solid var(--color-text-0);
		margin-bottom: 8px;
		padding-bottom: 4px;
		position: relative;
	}

	split-percent {
		display: inline-block;
		width: 55px;
	}

	value-header > span {
		width: 55px;
		display: inline-flex;
		align-items: center;
		padding-left: 4px;
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

	.add-msp {
		margin: 8px auto;
		width: 100%;
	}

	p.tooltip {
		padding: 0%;
		color: white;
		margin: 0;
	}
</style>
