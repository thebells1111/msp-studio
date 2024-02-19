<script>
	import { fade } from 'svelte/transition';
	import EditPerson from './EditPerson.svelte';
	import EditAddress from './EditAddress.svelte';
	import Add from '../icons/GroupAdd.svelte';
	import Close from '../icons/Close.svelte';

	import { newPerson } from '$/stores';

	export let valueBlock = [];
	let showPersonEdit = false;
	let selectedIndex = -1;
	export let hideTracks = false;

	$: hideTracks = window?.innerWidth >= 992 && showPersonEdit;

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
	<modal class="modal" on:mousedown|self={closeModal} on:touchend|self={closeModal}>
		{#if showPersonEdit}
			<address-container>
				<button class="close mobile" on:click={closeModal}>
					<Close size="24" />
				</button>
				<EditAddress bind:valueBlock {selectedIndex} />
			</address-container>
		{/if}
	</modal>
{/if}

<style>
	value-block {
		display: flex;
		width: 100%;
	}

	left-pane {
		width: 100%;
	}

	.modal {
		position: fixed;
		top: 0;
		margin: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 34;
	}

	.modal address-container {
		display: block;
		width: calc(33% - 58px);
		border-radius: 8px;
		padding: 8px 16px 8px 8px;
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
		height: 416px;
		position: absolute;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		bottom: 32px;
		right: 32px;
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

	.close {
		position: absolute;
		top: -6px;
		right: -12px;
		background-color: transparent;
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

	@media screen and (max-width: 992px) {
		value-block {
			display: flex;
			flex-direction: column;
		}

		modal,
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

		.modal {
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

		.modal address-container {
			display: block;
			width: calc(100% - 40px);
			border-radius: 8px;
			padding: 8px 16px 8px 8px;
			background-color: red;
			box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
			height: 416px;
			position: initial;
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
	}
</style>
