<script>
	import { fade } from 'svelte/transition';
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';
	import Add from '../icons/GroupAdd.svelte';
	import Close from '../icons/Close.svelte';
	import ToolTip from '$lib/Shared/ToolTip.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];
	let showPersonEdit = false;
	let selectedIndex = -1;

	function addPerson() {
		valueBlock = valueBlock.concat({ ...$newPerson });
	}

	$: splitTotal = valueBlock.reduce((t, v) => {
		return t + Number(v.split);
	}, 0);

	$: if (selectedIndex === -1) {
		showPersonEdit = false;
	}

	function checkForMSP(block) {
		const _block = [].concat(block);
		const hasMSP = _block.filter((v) => v?.value === 'UzrnTK2oEHR55gw7Djmb');
		return hasMSP.length > 0;
	}

	function addMSP() {
		valueBlock = valueBlock.concat({
			name: 'Music Side Project',
			address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			key: '696969',
			value: 'UzrnTK2oEHR55gw7Djmb',
			split: 5
		});
	}

	function closeModal() {
		console.log(window.innerWidth);
		if (window.innerWidth < 992) {
			showPersonEdit = false;
		}
	}
</script>

<value-block>
	<left-pane>
		<header>
			<h4>Value Recipients</h4>
			<ToolTip>
				<p.tooltip
					>In this section we determine who gets a share of any value (bitcoin) <br />
					that is received by this album. Could be each band member, and / or anyone <br />
					who had a key role in the creation of the album that you would like <br />
					to split incoming bitcoin with. Could also be infrastructure costs such as <br />
					hosting, indexing, boostagram bots, etc.</p.tooltip
				>
			</ToolTip>
		</header>
		<instructions>for splits, use whole numbers only</instructions>
		{#if !checkForMSP(valueBlock)}
			<support>
				<button class="add-value" on:click={addMSP.bind(this, valueBlock)}>
					<Add size="32" />
				</button>
				<div>
					<p>You should add MSP</p>
					<p>to your value block.</p>
					<p>I help you, you help me.</p>
				</div>
			</support>
		{/if}
		<value-header>
			<split-percent>Split %</split-percent>
			<split-name>Name</split-name>
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
	<right-pane
		class:mobile-modal={showPersonEdit}
		on:mousedown|self={closeModal}
		on:touchend|self={closeModal}
	>
		{#if showPersonEdit}
			<address-container>
				<button class="close mobile" on:click={closeModal}>
					<Close size="24" />
				</button>
				<EditAddress bind:valueBlock {selectedIndex} />
			</address-container>
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

	header > h4 {
		margin-right: 8px;
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

	support {
		display: flex;
		position: relative;
		color: red;
		padding: 4px 0;
		border-top: 1px solid red;
		border-bottom: 1px solid red;
		margin: 4px 0 20px 0;
	}

	support > div > p {
		margin: 0;
		font-weight: 550;
	}

	support > button.add-value {
		right: initial;
		top: initial;
		position: relative;
		height: 60px;
		width: 60px;
		border-radius: 50%;
		margin-right: 16px;
		background-color: var(--color-bg-edit-album);
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

	.mobile {
		display: none;
	}

	@media screen and (max-width: 992px) {
		value-block {
			display: flex;
			flex-direction: column;
		}

		right-pane,
		left-pane {
			width: 100%;
		}
		left-pane header,
		left-pane ul,
		left-pane,
		value-header,
		left-pane value-footer {
			width: calc(100% - 16px);
		}

		.mobile-modal {
			position: fixed;
			top: 0;
			margin: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 34;

			backdrop-filter: blur(6px);
		}

		.mobile-modal address-container {
			display: block;
			width: calc(100% - 40px);
			border-radius: 8px;
			padding: 8px 16px 8px 8px;
			background-color: red;
			box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
			height: 416px;
			position: relative;
			background-color: var(--color-poster-bg-0);
			background-image: linear-gradient(
				180deg,
				var(--color-poster-bg-0) 33%,
				var(--color-poster-bg-1) 66%
			);
		}

		.close {
			position: absolute;
			top: -6px;
			right: -12px;
			background-color: transparent;
		}

		.mobile {
			display: initial;
		}
	}
</style>
