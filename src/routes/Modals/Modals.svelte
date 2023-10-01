<script>
	import Close from '../icons/Close.svelte';
	export let showModal;
	function handleCloseModal() {
		closeModal();
		showModal = false;
	}

	export let closeModal = () => {};
</script>

<blurred-background on:mousedown|self={handleCloseModal} on:touchend|self={handleCloseModal}>
	<modal>
		<button class="close" on:click={handleCloseModal}>
			<Close size="24" />
		</button>

		<container>
			<slot />
		</container>
	</modal>
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
		z-index: 34;
		backdrop-filter: blur(5px);
	}

	modal {
		display: block;
		position: relative;
		width: calc(100% - 16px);
		height: calc(100% - 16px);
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
	}

	.close {
		position: fixed;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
	}

	container {
		display: block;

		width: calc(100% - 32px);
		height: calc(100% - 42px);
		margin: 42px 16px 0 16px;
		overflow: hidden;
	}

	@media screen and (max-width: 992px) {
		modal {
			position: relative;
			width: 100%;
			height: calc(100%);
			overflow-y: auto;
			overflow-x: hidden;
			border-radius: 8px;
		}
	}
</style>
