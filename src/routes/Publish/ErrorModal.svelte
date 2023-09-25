<script>
	import Close from '../icons/Close.svelte';

	export let rssErrors;
	export let showErrorModal = false;
	export let onClose = () => {};

	function closeModal() {
		onClose();
		showErrorModal = false;
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<error-modal>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<h2>Correct these errors and try downloading again.</h2>
		<ol>
			{#each rssErrors as err}
				<li>{@html err}</li>
			{/each}
		</ol>
	</error-modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	error-modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		padding: 8px;
		overflow: auto;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
	}

	h2 {
		margin-left: 8px;
		color: red;
		font-weight: 600;
	}

	li {
		padding: 4px 0;
	}
</style>
