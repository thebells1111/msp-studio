<script>
    let showHint = false;
</script>


<button class="question" on:click={() => showHint = true}>?</button>


{#if showHint}
	<SmallModal bind:showModal={showHint}>
		<slot/>
	</SmallModal>
{/if}

<style>
    .question {
		display: flex;
		align-self: flex-end;
		align-items: center;
		justify-content: center;
		width: 27px;
		height: 27px;
		border-radius: 50%;
		background-color: #999;
		color: white;
		font-size: 16px;
		cursor: pointer;
		padding: 0;
		margin-left: 2px;
	}
</styl>