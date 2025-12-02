<script>
	const { title, author, description, image } = $props();
	import { resolve } from '$app/paths';
</script>

<header class="">
	<div class="mx-auto max-w-3xl px-4 py-6">
		<h1 class="text-3xl font-bold text-blue-700">{title}</h1>
		<!--		<h2 class="text-lg">{author}</h2>-->
		<img src={resolve(image)} alt={title + ' image'} class="mt-2 rounded-2xl md:h-100 md:w-full" />
		<h3 class="mt-2 text-xl">{description}</h3>
	</div>
</header>
