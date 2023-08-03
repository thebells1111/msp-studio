<script>
	export let showTutorial;

	let folder = 'WP';
	let chapter = '';
	let Component;

	async function loadComponent(folder) {
		console.log(folder);
		if (folder) {
			const module = await import(`./${folder}/TOC.svelte`);
			Component = module.default;
		}
	}

	let folderNames = { WP: 'WordPress' };
	let chapterNames = { WP: { setupFolders: 'Setup Album Folder' } };

	$: loadComponent(folder);
</script>

<button
	class="close"
	on:click={() => {
		showTutorial = false;
	}}>x</button
>

<div>
	{#if !folder}
		<h3>Music Side Project</h3>
		<h4>
			Easily build the RSS feed needed to value enable your music and make it available in a modern
			podcast app or music player.
		</h4>
		<h4>Choose your hosting solution:</h4>
		<button-container>
			<button
				on:click={() => {
					folder = 'WP';
				}}>WordPress</button
			>
		</button-container>
	{:else}
		<button
			class="back"
			on:click={() => {
				folder = '';
			}}
		>
			Tutorials
		</button>
		{#if folder}
			<button
				class="back"
				on:click={() => {
					chapter = '';
				}}
			>
				{folderNames[folder]}
			</button>
		{/if}
		{#if folder && chapter}
			<button
				class="back"
				on:click={() => {
					chapter = '';
				}}
			>
				{chapterNames[folder][chapter]}
			</button>
		{/if}
		<folder-container>
			<svelte:component this={Component} bind:chapter />
		</folder-container>
	{/if}
</div>

<style>
	h3,
	h4 {
		text-align: center;
	}
	button.close {
		color: var(--color-text-0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 8px;
		right: 0;
		z-index: 33;
		background-color: transparent;
	}

	div {
		background-color: var(--color-bg-1);
		width: calc(100% - 16px);
		height: 100%;
		padding: 8px;
	}

	button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	folder-container {
		display: block;
		margin-top: 8px;
		height: calc(100% - 64px);
	}
</style>
