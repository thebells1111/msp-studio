<script>
	export let size = '1em';
	export let width = size;
	export let height = size;
	export let color = 'currentColor';
	export let viewBox = '0 96 960 960';
	export let style;
</script>

<svg {width} {height} {viewBox} {style}>
	<path
		d="M440 856h80V689l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240 976q-33 0-56.5-23.5T160 896V256q0-33 23.5-56.5T240 176h320l240 240v480q0 33-23.5 56.5T720 976H240Zm280-520V256H240v640h480V456H520ZM240 256v200-200 640-640Z"
		fill={color}
	/>
</svg>
