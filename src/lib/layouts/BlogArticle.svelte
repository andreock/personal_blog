<script>
	import ArticleHeader from '$lib/Components/ArticleHeader.svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	const { title, author, description, thumbnail } = $props();

	let location_href = $state('');

	onMount(() => {
		// Get the base URL (protocol + host) including /personal_blog
		location_href = location.href.split('/').slice(0, 4).join('/');
	});
</script>

<svelte:head>
	<link rel="stylesheet" href={resolve('/prism-atom-dark.css')} />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={location_href + thumbnail} />
</svelte:head>

<div class="min-h-screen overflow-x-hidden bg-gray-50 font-sans text-gray-900">
	<ArticleHeader {title} {author} {description} image={thumbnail} />
	<main class="mx-auto max-w-3xl px-4 pb-16">
		<article class="prose prose-lg prose-blue">
			<slot />
		</article>
	</main>
</div>

<style>
	@reference "tailwindcss";
	h1 {
		@apply text-4xl font-bold text-black;
	}

	h2 {
		@apply text-3xl font-semibold text-black;
	}

	h3 {
		@apply text-2xl font-medium text-black;
	}

	ul {
		@apply list-inside list-disc space-y-2;
	}

	code {
		@apply m-1 overflow-auto rounded-lg bg-gray-900 p-1 text-gray-100;
	}

	div {
		@apply w-full overflow-x-auto;
	}

	div table {
		@apply min-w-max;
	}
</style>
