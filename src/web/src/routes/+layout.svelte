<script>
	import { isLoading, user_token } from '$lib/stores';
	import { onDestroy } from 'svelte';
import '../app.postcss';
	import { Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import Toaster from '../components/Toaster.svelte';
	let loading = false
	const unsubscribe_loading=isLoading.subscribe(value=>(loading=value))
	// const unsubscribe_usertoken=user_token.subscribe(value=>(cookies.set('__open-tickets-sessiontoken',value)))
	
	onDestroy(()=>{
		unsubscribe_loading()
		// unsubscribe_usertoken()
	})



</script>

<Toaster></Toaster>
{#if !loading}
	<slot />
{:else}
<section transition:fade class="w-screen h-screen bg-white">
		<div class="flex items-center place-content-center ">
			<div class="top-1/2 absolute">
				<Spinner color="blue"></Spinner> Loading ...
			</div>
		</div>
</section>
{/if}