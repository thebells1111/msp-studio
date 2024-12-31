<script>
	import Add from '$icons/Add.svelte';
</script>

<ol>
	<li>
		<p>
			In MSP, click the menu and click <span class="bold">Log In</span>
		</p>
	</li>
	<li>
		<p>Log In or Register your account.</p>
	</li>
	<li>
		<p>
			Click the menu again and click
			<span class="bold">Bunny Credentials</span>
		</p>
	</li>
	<li>
		<p>
			Enable
			<span class="bold">Bunny Credentials</span>
		</p>
	</li>
	<li>
		<p>In Bunny, click on <span class="bold">Storage</span> in the menu to the left.</p>
	</li>
	<li>
		<p>Select the Storage Zone you just created.</p>
	</li>
	<li>
		<p>
			Click on <span class="bold">FTP & API Access</span> in the 2nd menu to the left.
		</p>
	</li>
	<li>
		<p>
			Copy your <span class="bold">Username</span> from Bunny and paste it into MSP on the left.
		</p>
	</li>
	<li>
		<p>
			Copy your <span class="bold">Hostname</span> from Bunny and paste it into MSP on the left.
		</p>
	</li>
	<li>
		<p>
			Copy your <span class="bold">Password</span> from Bunny and paste it into MSP on the left.
		</p>
		<p class="ext">Use the Password, NOT the Read-only password.</p>
		<p class="ext">If you ever re-create your password, you'll have to re-enter it into MSP.</p>
		<br />
	</li>
	<li>
		<p>Click on <span class="bold">Billing</span> in the menu to the left.</p>
	</li>
	<li>
		<p>
			Click on <span class="bold">API Key</span> in the 2nd menu to the left.
		</p>
	</li>
	<li>
		<p>
			Copy your <span class="bold">API Key</span> from Bunny and paste it into MSP on the left.
		</p>
	</li>
	<li>
		<p>Click the <span class="bold">Submit</span> button in MSP.</p>
	</li>
	<li>
		<p>
			In the MSP click the menu again, click <span class="bold">Select Albums</span>.
		</p>
	</li>
	<li>
		<p>
			Click the <span class="add"> <Add /></span> button next to <span class="bold">Albums</span> and
			start building your first album.
		</p>
	</li>
</ol>

<style>
	p {
		padding: 0;
		margin: 0;
		line-height: 44px;
		cursor: text;
		position: relative;
	}

	p.ext {
		line-height: initial;
		margin-left: 12px;
	}

	span.add {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		min-width: 24px;
		font-size: 2em;
		position: relative;
		top: 10px;
	}

	span.bold {
		font-weight: 750;
		font-family: Inter, sans-serif;
		text-decoration: underline;
	}
</style>
