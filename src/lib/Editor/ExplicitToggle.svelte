<script>
	export let checked = 'no'; // Initialize checked as false
	export let handleInput = () => {};
	$: _checkbox = checked && checked !== 'no' ? true : false;

	// Normalize `checked` to 'yes' or 'no' based on its truthiness
	$: checked = checked && checked !== 'no' ? 'yes' : 'no';

	// Handle the label click to toggle between 'yes' and 'no'
	function toggle() {
		checked = checked === 'yes' ? 'no' : 'yes';
		handleInput();
	}
</script>

<div class="toggle-switch">
	<input type="checkbox" checked={_checkbox} />
	<label on:click={toggle} />
</div>

<style>
	.toggle-switch {
		position: relative;
		left: 0;
		width: 50px;
		height: 24px;
	}

	input[type='checkbox'] {
		display: none;
	}

	label {
		position: absolute;
		left: 0;
		cursor: pointer;
		width: 100%;
		height: 100%;
		background-color: var(--color-input-bg-0);
		border-radius: 15px;
		transition: background-color 0.3s;
	}

	label:after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background-color: #fff;
		border-radius: 50%;
		transition: left 0.3s;
	}

	input:checked + label {
		background-color: var(--color-bg-add-band);
	}

	input:checked + label:after {
		left: 26px;
	}
</style>
