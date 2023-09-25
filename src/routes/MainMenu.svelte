<script>
	import Tutorial from './Tutorial/Tutorial.svelte';

	import { showTutorial } from '$/stores';

	$showTutorial = false;
	let tutorialClicked = false; //change to false

	$: if ($showTutorial) {
		tutorialClicked = true;
	}
</script>

<nav>
	<!-- <button
		on:click={() => {
			$showTutorial = true;
		}}>Tutorial</button
	> -->

	<a href="https://t.me/self_hosters" target="_blank" rel="noopener noreferrer">Help</a>
</nav>

<tutorial class:show={$showTutorial} class:hide={!tutorialClicked}>
	<Tutorial />
</tutorial>

<style>
	nav {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	button {
		color: var(--color-text-0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		z-index: 33;
		margin: 10px 8px 0 10px;
		position: relative;
	}

	a {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px 16px;
	}




	tutorial {
		display: block;
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0;
		right: 0;
		z-index: 50;
		overflow: hidden;
		animation: slide-out 0.333s forwards;
		z-index: 40;
	}

	tutorial.show {
		animation: slide-in 0.333s;
	}

	tutorial.hide {
		display: none;
	}

	@keyframes slide-in {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0);
		}
	}

	@keyframes slide-out {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
