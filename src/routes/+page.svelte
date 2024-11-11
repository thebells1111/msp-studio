<script>
	import Editor from '$lib/Editor/Editor.svelte';
	import Bunny from '../lib/Bunny/Bunny.svelte';
	import { mainPanel } from '$/stores';

	$: console.log($mainPanel);
</script>

<div class:show={$mainPanel === 'bunnyTutorial'}>
	<Bunny />
</div>

<div class:show={$mainPanel === 'editor'} />
<Editor />

<style>
	div {
		display: none;
	}

	div.show {
		display: initial;
	}
</style>
