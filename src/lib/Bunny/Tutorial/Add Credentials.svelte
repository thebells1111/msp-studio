<ol>
	<li>
		<p>
			In MSP, enable
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
			In the MSP Main Menu, click <span class="bold">Select Albums</span>, and you should now be
			able to upload your files directly to your Bunny Account.
		</p>
	</li>
</ol>

<style>
	p {
		padding: 0;
		margin: 0;
		line-height: 44px;
		cursor: text;
	}

	p.ext {
		line-height: initial;
		margin-left: 12px;
	}

	span.button {
		display: inline-block;
		vertical-align: top;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border: 0;
		padding: 0 1.07145rem;
		-webkit-user-select: none;
		user-select: none;
		color: var(--color-base);
		border-radius: 6px;
		background: none;
		font-size: 14px;
		font-weight: 600;
		box-shadow: 0 1px 2px rgb(12 12 12 / 8%);
		height: var(--height);
		line-height: var(--height);
	}

	span.orange {
		background: linear-gradient(171.02deg, #ffaf48 4.38%, #ff7854 111.49%);
		--height: 44px;
	}

	span.charcoal {
		background: #04223e;
		--height: 32px;
		border-radius: 4px;
	}

	span.bold {
		font-weight: 750;
		font-family: Inter, sans-serif;
		text-decoration: underline;
	}

	span.white {
		font-family: Inter, sans-serif;
		color: #364e65;
		border-radius: 6px;
		line-height: 38px;
		margin: 0.35715rem;
		transition: background-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
		background-color: #fff;
		box-shadow: 0 1px 2px -1px rgb(12 12 12 / 10%), 0 1px 3px rgb(12 12 12 / 10%);
		display: inline-flex;
		align-items: center;
		font-size: 14px;
	}

	span.white::before {
		content: '✓';
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 16px; /* Circle size */
		height: 16px;
		background-color: #2fc584; /* Circle color */
		border-radius: 50%; /* Make it a circle */
		margin-right: 8px; /* Space between circle and text */
		vertical-align: middle;
		color: #fff;
		font-size: 10px;
		line-height: 16px; /* Centers the check mark vertically */
	}

	span.white::before::after {
		content: '✓';
		color: white; /* Check mark color */
		font-size: 10px; /* Check mark size */
		position: absolute;
		top: 2px; /* Moves check mark down */
	}
</style>
