<script>
	import Spiel from './Spiel.svelte';
</script>

<svelte:head>
	<meta
		property="og:title"
		content="Not your hosting, Not your feed - Why bitcoin podcasters and musicians should consider self-hosting"
	/>
	<meta property="og:type" content="blog" />
	<meta property="og:url" content="https://musicsideproject.com/blog" />
	<meta property="og:image" content="https://musicsideproject.com/msp-record-300.png" />
</svelte:head>

<nav><a class="back" href="/">Back</a></nav>
<div>
	<Spiel />
</div>

<style>
	nav {
		margin: 8px 0;
	}

	.back {
		margin: 0;
		padding: 8px;
	}

	div {
		height: calc(100% - 60px);
		overflow: auto;
	}
</style>
