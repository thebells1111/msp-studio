<script>
	import './styles.css';
	import MainMenu from './MainMenu.svelte';
</script>

<MainMenu />
<main class="main-slot">
	<slot />
</main>

<background>
	<div class="header-background" />
	<div class="main-background" />
</background>

<style>
	main {
		padding: 8px;
		position: relative;
		height: calc(100% - 106px);
		overflow: auto;
	}
	background {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: -1;
	}
	.header-background {
		position: absolute;
		top: 0;
		height: 100px;
		width: 100%;
		background-color: var(--color-bg-2);
		background-image: linear-gradient(
			180deg,
			var(--color-bg-0) 0%,
			var(--color-bg-1) 40%,
			var(--color-bg-2) 100%
		);
		z-index: -1;
	}

	.main-background {
		background-attachment: fixed;
		background-color: var(--color-bg-2);
		z-index: -2;
		position: absolute;
		height: 100%;
		width: 100%;
	}
</style>
