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
<Spiel />

<style>
	nav {
		margin-top: 8px;
	}

	.back {
		margin-top: 8px;
		padding: 8px;
	}
</style>
