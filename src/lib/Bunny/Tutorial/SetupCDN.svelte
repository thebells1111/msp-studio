<ol>
	<li>
		<p>Click on <span class="bold">CDN</span> in the menu to the left.</p>
	</li>
	<li>
		<p>Select the Pull Zone you just created.</p>
	</li>
	<li>
		<p>
			Click on <span class="bold">Headers</span> in the 2nd menu to the left.
		</p>
	</li>
	<li>
		<p>
			In the <span class="bold">Extension List</span>, make sure the following extensions present:
		</p>
		<p style="margin-left: 8px">jpg, jpeg, png, webp, gif, mp3, mp4, mpeg, svg, webm, xml</p>
		<p class="ext">(Most of these should already be there. You'll have to manually add xml</p>
		<p class="ext">
			If you're using a different image type, make sure that's in your list as well.
		</p>
		<p class="ext">Make sure your values are comma seperated.</p>
		<br />
	</li>
	<li>
		<p>Click <span class="button orange">Save</span></p>
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

	span.bold {
		font-weight: 750;
		font-family: Inter, sans-serif;
		text-decoration: underline;
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
</style>
