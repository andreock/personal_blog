<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	let activeUrl = $derived(page.url.pathname);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative">
	<Navbar class="sticky start-0 top-0 z-20 w-full">
		<NavBrand href={resolve('/')}>
			<img src={resolve('/icon.png')} class="me-3 h-6 rounded-full sm:h-9" alt="Flowbite Logo" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
				>Andreock's blog</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl {activeUrl}>
			<NavLi href={resolve('/')}>Home</NavLi>
		</NavUl>
	</Navbar>

	<div class="overflow-scroll">
		{@render children?.()}
	</div>
</div>
