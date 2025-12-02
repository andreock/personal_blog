<script lang="ts">
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { resolve } from '$app/paths';

	const markdownFiles = import.meta.glob('/src/routes/**/*.md', { eager: true });
	const post_path = Object.keys(markdownFiles);
	const post_meta = Object.values(markdownFiles).map((post: any) => post.metadata);
</script>

<main class="mx-auto max-w-2xl">
	<h1 class="mt-8 mb-8 text-center text-4xl font-bold">Andreock's blog</h1>
	<div class="flex flex-row justify-center space-y-4 space-x-4">
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
					<Button
						class="w-40"
						href={resolve(post_link.replace('/src/routes', '').replace('+page.md', ''))}
					>
						Read more <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
					</Button>
				</div>
			</Card>
		{/each}
	</div>
</main>
