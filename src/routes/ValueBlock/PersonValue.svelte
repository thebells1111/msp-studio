<script>
	import { onMount } from 'svelte';

	let name = '';
	let address = '';
	let key = '';
	let value = '';
	let split = 0;

	let provider = '';
	let username = '';
	let noUserFound = false;
	let showProviderInput = false;
	let showAdvanced = false;

	export let person = {};

	onMount(() => {
		console.log(person);
		name = person.name;
		address = person.address;
	});

	async function handleProviderSelect(providerName) {
		showProviderInput = true;
		provider = providerName;
	}

	async function handleProviderSubmit() {
		noUserFound = false;
		let name = username.split('@');
		if (!name[0]) {
			name.shift();
		}
		console.log(name);
		if (provider === 'Alby') {
			let res = await fetch(`https://getalby.com/.well-known/keysend/${name[0]}`);
			let info;
			try {
				info = await res.json();
				if (info.status === 'OK') {
					address = info.pubkey;
					value = info.customData[0].customValue;
					key = info.customData[0].customKey;
				} else {
					throw new Error();
				}
				cancelProviderSubmit();
			} catch (error) {
				noUserFound = true;
				info = undefined;
			}
		} else if (provider === 'Fountain') {
			let res = await fetch(` https://fountain.fm/.well-known/keysend/adam`);
			let info;
			try {
				info = await res.json();
				if (info.status === 'OK') {
					address = info.pubkey;
					value = info.customData[0].customValue;
					key = info.customData[0].customKey;
				} else {
					throw new Error();
				}
				cancelProviderSubmit();
			} catch (error) {
				noUserFound = true;
				info = undefined;
			}

			// let res = await fetch('https://api.fountain.fm/v1/content/lookup', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify({ username: name[0] })
			// });
			// let info;

			// try {
			// 	info = await res.json();
			// 	if (!info?.keysend?.customValue) {
			// 		throw new Error();
			// 	}
			// 	if (info?.username) {
			// 		data['podcast:valueRecipient'][index - 1]['@_name'] = info.keysend.name;
			// 		data['podcast:valueRecipient'][index - 1]['@_address'] = info.keysend.address;
			// 		data['podcast:valueRecipient'][index - 1]['@_customValue'] = info.keysend.customValue;
			// 		data['podcast:valueRecipient'][index - 1]['@_customKey'] = info.keysend.customKey;
			// 	}
			// 	cancelProviderSubmit();
			// } catch (error) {
			// 	noUserFound = true;
			// 	info = undefined;
			// }
			// console.log(info);
		} else if (provider === 'v4v.app') {
			if (name[0]) {
				data['podcast:valueRecipient'][index - 1]['@_name'] = username;
				data['podcast:valueRecipient'][index - 1]['@_address'] =
					'0266ad2656c7a19a219d37e82b280046660f4d7f3ae0c00b64a1629de4ea567668';
				data['podcast:valueRecipient'][index - 1]['@_customValue'] = name[0];
				data['podcast:valueRecipient'][index - 1]['@_customKey'] = 818818;

				cancelProviderSubmit();
			} else {
				noUserFound = true;
			}
		}
	}

	async function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
	}
</script>

{#if showProviderInput}
	<div class="wallet-provider">
		<input bind:value={username} placeholder={`Enter Your ${provider} User Name`} />
		<div class="wallet-provider-button-container">
			<button class="submit-provider primary" on:click={handleProviderSubmit}>Submit</button>
			<button class="cancel-provider primary" on:click={cancelProviderSubmit}>Cancel</button>
		</div>
		{#if noUserFound}
			<p>That username doesn't exist.</p>
		{/if}
	</div>
{:else}
	<div class="person-block">
		<label>
			<h4>
				Name
				<button class="provider alby" on:click={handleProviderSelect.bind(this, 'Alby')}>
					<img src="alby.png" width="15" />
					<span>Use Alby</span>
				</button>
				<button class="provider fountain" on:click={handleProviderSelect.bind(this, 'Fountain')}>
					<img src="fountain.png" />
					<span>Use Fountain</span>
				</button>
				<button class="provider v4vapp" on:click={handleProviderSelect.bind(this, 'v4v.app')}>
					<img src="v4vapp.webp" />
					<span>Use v4v.app</span>
				</button>
			</h4>
			<input
				type="text"
				bind:value={person.name}
				placeholder="Choose a name so people can send Boostagrams"
			/>
		</label>

		<div class="split-top">
			<label class="split-label">
				<h4>Split</h4>

				<input type="text" bind:value={person.split} placeholder="whole numbers only" />
			</label>
		</div>
		<p>
			for splits, use whole numbers only <br />(99 would receive 99% of the split after fees are
			paid)
		</p>

		<button
			on:click={() => {
				showAdvanced = !showAdvanced;
			}}
		>
			{showAdvanced ? 'Hide Avanced Options' : 'Show Advanced Options'}
		</button>
		{#if showAdvanced}
			<advanced>
				<label>
					<h4>Lightning Network Address</h4>
					<input type="text" bind:value={person.address} placeholder="Lightning Network Address" />
				</label>
				<label>
					<h4>Custom Key</h4>
					<input
						type="text"
						bind:value={person.key}
						placeholder="(optional) Leave blank unless required by your wallet"
					/>
				</label>
				<label>
					<h4>Custom Value</h4>
					<input
						type="text"
						bind:value={person.value}
						placeholder="(optional) Leave blank unless required by your wallet"
					/>
				</label>
			</advanced>
		{/if}
	</div>
{/if}

<style>
	h4 {
		margin: 0;
	}
	input {
		margin: 4px 0 8px 8px;
	}
</style>
