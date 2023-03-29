<script>
	import Preferences from './Preferences.svelte';
	import FileUploader from './FileUploader.svelte';
	import Close from '../icons/Close.svelte';

	import { currentModal } from '$/stores';

	function closeModal() {
		$currentModal = '';
	}
</script>

{#if $currentModal}
	<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
		<modal>
			<button class="close" on:click={closeModal}>
				<Close size="24" />
			</button>

			<container>
				{#if $currentModal === 'preferences'}
					<Preferences />
				{/if}

				{#if $currentModal === 'fileUploader'}
					<FileUploader />
				{/if}
			</container>
		</modal>
	</blurred-background>
{/if}

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
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
