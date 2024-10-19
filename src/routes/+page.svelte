<script>
	import Home from '$lib/Home/Home.svelte';
	import Header from '$lib/header/Header.svelte';
	let makeRecommendation = true;
</script>

<div>
	<!-- Background -->
	<div class="h-screen w-full bg-cover fixed"  style="background-image: url(/background.png)">
		<div
			class={`${
				makeRecommendation ? 'backdrop-blur-md' : ''
			}  flex flex-col items-center justify-center min-h-screen w-full h-full bg-gradient-to-br from-slate-900/80 to-black/90`}
		/>
	</div>

	<div class="absolute inset-0 px-6 flex flex-col h-screen overflor-auto">
		<Header/>

		
		<div
			class="flex-grow max-w-4xl mx-auto w-full md:pt-2  flex flex-col items-center justify-center">
				<Home/>
			</div>
		
	</div>
</div>
