<script>
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import { dev } from '$app/environment';
	import Loader from '../lib/Loader.svelte'; 

	let isLoading = true;

	setTimeout(() => {
		isLoading = false;
	}, 1500);
</script>

{#if isLoading}
	<Loader />
{:else}
	<div class="min-h-screen w-full">
		<slot />
	</div>
{/if}
