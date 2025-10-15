<script>
	const { href, children } = $props();
</script>

<a href={href} target="_blank" rel="noopener noreferrer">
	{@render children()}
</a>