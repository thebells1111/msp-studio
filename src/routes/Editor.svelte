<script>
	let bands = [];
	let albums = [];
	let tracks = [];
	let selectedScreen = 'bands';

	function handleScreenSelect(screen) {
		selectedScreen = screen;
	}
</script>

<ul>
	<li
		on:click={handleScreenSelect.bind(this, 'bands')}
		on:keypress={handleScreenSelect.bind(this, 'bands')}
	>
		Bands
	</li>
	<li
		on:click={handleScreenSelect.bind(this, 'albums')}
		on:keypress={handleScreenSelect.bind(this, 'albums')}
	>
		Albums
	</li>
	<li
		on:click={handleScreenSelect.bind(this, 'tracks')}
		on:keypress={handleScreenSelect.bind(this, 'tracks')}
	>
		Tracks
	</li>
</ul>

{selectedScreen}
