<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const markdownFiles = import.meta.glob('/src/routes/**/*.md', { eager: true });
	const post_path = Object.keys(markdownFiles);
	const post_meta = Object.values(markdownFiles).map((post: any) => post.metadata);

	let location_href = $state('');

	onMount(() => {
		// Get the base URL (protocol + host) including /personal_blog
		location_href = location.href.slice(0, -1);
	});

	const title = "Andreock's blog";
	const description = 'A simple blog where I publish some stuff that I made';
	const thumbnail = '/blog_thumbnail.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={location_href + thumbnail} />
</svelte:head>

<main class="mx-auto max-w-2xl">
	<div
		class="flex flex-col items-center justify-center lg:flex-row lg:space-x-4 [@media(max-width:768px)]:space-y-4"
	>
		{#each post_path as post_link, i (post_link)}
			<Card size="sm" class="flex h-[400px] w-72 flex-col">
				<img
					class="h-40 rounded-lg"
					src={resolve(post_meta[i].thumbnail)}
					alt={post_meta[i].title + ' thumbnail'}
				/>
				<div class="m-6">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{post_meta[i].title}
					</h5>
					<p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">
						{post_meta[i].description}
					</p>
					<div class="md:flex md:items-center">
						<Button
							class="w-40"
							href={resolve(post_link.replace('/src/routes', '').replace('+page.md', ''))}
						>
							Read more <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
						</Button>
					</div>
				</div>
			</Card>
		{/each}
	</div>
</main>
