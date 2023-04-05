<script>
	import Select from 'svelte-select';
	import { currentModal, user, wpFeedUrl } from '$/stores';
	import { onMount } from 'svelte';
	let name = '';
	let secret = '';
	let displayText = '';
	let filterText = '';

	let items = [];

	onMount(() => {
		items = $user.urls.map((v) => {
			return { value: v, label: v };
		});
	});

	async function saveWP() {
		let res = await fetch('/api/database/save-wp', {
			method: 'POST',
			body: JSON.stringify({ url: $wpFeedUrl, name: name, secret: secret })
		});
		let data = await res.json();
		console.log(data);

		if (data.wpCreds) {
			$user.wpCreds = true;
			displayText = 'Credentials Successfully Added';
			setTimeout(() => {
				$currentModal = '';
			}, 1500);
		}
	}

	function handleFilter(e) {
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = items.filter((i) => !i.created);
			items = [...prev, { value: filterText, label: filterText, created: true }];
		}
	}

	function handleChange(e) {
		items = items.map((i) => {
			delete i.created;
			return i;
		});

		$user.urls = items.map((v) => v.label);
		$wpFeedUrl = e.detail.value || '';
	}

	function handleClear(e) {
		$wpFeedUrl = '';
	}
</script>

<div>
	{#if displayText}
		<h1>{displayText}</h1>
	{:else}
		<label>
			<p>WordPress Website Link:</p>
			<Select
				on:change={handleChange}
				on:filter={handleFilter}
				on:clear={handleClear}
				bind:filterText
				{items}
				placeholder=""
				--border-radius="4px"
				--placeholder-color="blue"
				--input-color="var(--color-input-text-0)"
				--background="var(--color-input-bg-0)"
				--clear-select-focus-outline="0"
				--input-padding="4px"
				--selected-item-padding="0 4px"
				--border="1px solid transparent"
				--list-background="var(--color-bg-1)"
				--item-hover-bg="var(--color-bg-0)"
				--padding="0"
				--height="30px"
				--border-hover="1px solid transparent"
				--border-focused="1px solid #66afe9"
			>
				<div slot="item" let:item>
					{item.created ? 'Add new: ' : ''}
					{item.label}
				</div>
			</Select>
		</label>

		<label>
			<p>WordPress Username:</p>
			<input type="text" bind:value={name} />
		</label>
		<label>
			<p>WordPress Application Password:</p>
			<input type="text" bind:value={secret} />
		</label>

		<button on:click={saveWP}>Save WordPress Credentials</button>
	{/if}
</div>

<style>
	div {
		padding: 2px;
		width: calc(100% - 20px);
	}
	h1 {
		color: red;
		text-align: center;
	}

	input {
		width: calc(100% - 8px);
	}

	input:focus {
		-webkit-box-shadow: none;
		box-shadow: none;
	}

	button {
		margin-top: 16px;
	}
</style>
