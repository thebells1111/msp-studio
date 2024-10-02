<script>
	import FileUploader from './FileUploader.svelte';
</script>

<input class="art-upload" bind:value={$editingFeed['itunes:image']['@_href']} />
<FileUploader
	bind:filePath={$editingFeed['itunes:image']['@_href']}
	bind:fileReload={imageReload}
	fileName="album-art"
	folderName={$editingFeed['podcast:guid']}
	type="image"
	uploadText="Album Art"
/>
