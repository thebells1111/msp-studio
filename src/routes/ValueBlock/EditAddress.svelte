<script>
	export let valueBlock = [{ name: '' }];
	export let selectedIndex = 0;
	let provider = '';
	let username = '';
	let noUserFound = false;
	let userFound = false;
	let showProviderInput = false;
	let showAdvanced = false;

	$: selectedPerson = valueBlock[selectedIndex];

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
		if (provider === 'Alby') {
			let res = await fetch(`https://getalby.com/.well-known/keysend/${name[0]}`);
			let info;
			try {
				info = await res.json();
				console.log(info);
				if (info.status === 'OK') {
					selectedPerson['@_address'] = info.pubkey;
					selectedPerson['@_customValue'] = info.customData[0].customValue;
					selectedPerson['@_customKey'] = info.customData[0].customKey;
					userFound = name + '@getalby.com';
				} else {
					throw new Error();
				}
				setTimeout(cancelProviderSubmit.bind(this, true), 1000);
			} catch (error) {
				console.log(error);
				noUserFound = true;
				info = undefined;
			}
		} else if (provider === 'Fountain') {
			let res = await fetch(`https://fountain.fm/.well-known/keysend/${name[0]}`);
			let info;
			try {
				info = await res.json();
				if (info.status === 'OK') {
					selectedPerson['@_address'] = info.pubkey;
					selectedPerson['@_customValue'] = info.customData[0].customValue;
					selectedPerson['@_customKey'] = info.customData[0].customKey;
					userFound = name + '@fountain.fm';
				} else {
					throw new Error();
				}
				setTimeout(cancelProviderSubmit.bind(this, true), 1000);
			} catch (error) {
				noUserFound = true;
				info = undefined;
			}
		} else if (provider === 'v4v.app') {
			if (name[0]) {
				selectedPerson['@_address'] =
					'0266ad2656c7a19a219d37e82b280046660f4d7f3ae0c00b64a1629de4ea567668';
				selectedPerson['@_customValue'] = name[0];
				selectedPerson['@_customKey'] = 818818;
				userFound = name;

				setTimeout(cancelProviderSubmit.bind(this, true), 1000);
			} else {
				noUserFound = true;
			}
		}
	}

	async function cancelProviderSubmit(show) {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
		userFound = false;
		showAdvanced = show;
	}
</script>

{#if showProviderInput}
	{#if userFound}
		<user-found>
			<h4>{userFound} address is being used.</h4>
			<h4>Checked Advance Options to view address.</h4>
		</user-found>
	{:else}
		<wallet-provider>
			<input bind:value={username} placeholder={`Enter Your ${provider} User Name`} />
			<wallet-provider-button-container>
				<button class="submit-provider primary" on:click={handleProviderSubmit}>Submit</button>
				<button class="cancel-provider primary" on:click={cancelProviderSubmit}>Cancel</button>
			</wallet-provider-button-container>
			{#if noUserFound}
				<p>That username doesn't exist.</p>
			{/if}
		</wallet-provider>
	{/if}
{:else}
	<label class="user-name">
		<h4>Name</h4>
		<input
			type="text"
			bind:value={valueBlock[selectedIndex]['@_name']}
			placeholder="Choose a name so people can send Boostagrams"
		/>
	</label>

	<h4>Choose Wallet Provider</h4>
	<wallets>
		<button class="provider alby" on:click={handleProviderSelect.bind(this, 'Alby')}>
			<img src="alby.png" />
			<span>Alby</span>
		</button>
		<button class="provider fountain" on:click={handleProviderSelect.bind(this, 'Fountain')}>
			<img src="fountain.png" />
			<span>Fountain</span>
		</button>
		<button class="provider v4vapp" on:click={handleProviderSelect.bind(this, 'v4v.app')}>
			<img src="v4vapp.webp" />
			<span>v4v.app</span>
		</button>
	</wallets>
	<advanced-button>
		<button
			on:click={() => {
				showAdvanced = !showAdvanced;
			}}
		>
			{showAdvanced ? 'Hide Avanced Options' : 'Show Advanced Options'}
		</button>
	</advanced-button>
	{#if showAdvanced}
		<advanced>
			<label>
				<h4>Lightning Network Address</h4>
				<input
					type="text"
					bind:value={selectedPerson['@_address']}
					placeholder="Lightning Network Address"
				/>
			</label>
			<label>
				<h4>Custom Key</h4>
				<input
					type="text"
					bind:value={selectedPerson['@_customKey']}
					placeholder="(optional) Leave blank unless required by your wallet"
				/>
			</label>
			<label>
				<h4>Custom Value</h4>
				<input
					type="text"
					bind:value={selectedPerson['@_customValue']}
					placeholder="(optional) Leave blank unless required by your wallet"
				/>
			</label>
		</advanced>
	{/if}
{/if}

<style>
	wallet-provider,
	user-found {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		margin-top: 80px;
	}

	wallet-provider-button-container {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
	}

	wallet-provider-button-container button {
		margin: 0 16px;
	}

	.cancel-provider {
		background-color: var(--color-bg-delete);
	}

	wallet-provider input {
		width: 80%;
		margin-bottom: 8px;
	}

	.user-name {
		display: block;
		width: 100%;
	}
	h4 {
		margin: 8px 0;
	}
	.user-name input {
		margin: 0px 0px 8px 8px;
		width: calc(100% - 16px);
	}

	button.provider {
		margin: 0 0 8px 8px;
		width: 116px;
		font-weight: 600;
		border-radius: 20px;
		padding: 0;
		display: inline-flex;
		padding: 0 4px;
		align-items: center;
	}

	button.alby {
		background-color: hsl(41, 92%, 65%);
		color: hsl(0, 0%, 20%);
	}

	button.fountain {
		background-color: hsl(0, 0%, 25%);
		color: white;
	}

	button.v4vapp {
		background-color: hsl(0, 0%, 25%);
		color: white;
	}

	button > img {
		height: 30px;
		padding-right: 6px;
	}

	button.v4vapp > img {
		padding: 0 6px 0 0;
	}

	button.alby > img {
		height: 28px;
	}

	wallets,
	advanced-button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	advanced-button button {
		width: 220px;
	}

	advanced {
		display: block;
	}

	advanced input {
		margin: 0 8px;
		width: calc(100% - 18px);
	}
</style>
