<script>
	import { isLoading, user_token } from '$lib/stores';
	import {  Button, Card, Input, Label } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import {callBackend} from "$lib/api";
	import { sendErrorMessage, sendSuccessMessage } from '$lib/toasts';
	import { goto } from '$app/navigation';

	const redirect_to = $page.url.searchParams.get('redirect');

	// @ts-ignore
	async function doLogin(event){
		event.preventDefault();
		isLoading.set(true)
		
		const data = new FormData(event.target)
		// console.log(data.get("email"));
		let r= await callBackend('admin/login_user',"POST",{
			email:data.get("email"),
        	password:data.get("password")
		})
		if(r.status>=400 && r.status<500){
			sendErrorMessage("Invalid password or email!")
			isLoading.set(false)
			return
		}

		sendSuccessMessage("Logged in with success!")
		isLoading.set(false)
		let r_data=await r.json()
		user_token.set(r_data?.auth_token)

		if(redirect_to!==null){
			console.log(redirect_to);
			goto(redirect_to)

		}
	}


</script>
<svelte:head>	
	<title>Login</title>
</svelte:head>

<section class="h-screen w-screen">
<div class="flex items-center place-content-center ">
	<Card class="w-full top-1/3 absolute">
		<form on:submit={(e) => doLogin(e)}>
			
			<div class="mb-3">
				<Label for="input-group-1" class="block mb-2">Your Email</Label>
				<Input name="email" id="email" type="email" placeholder="support@opentickets.com">
				<svg slot="left" aria-hidden="true"  class="w-5 h-5 text-gray-500 dark:text-white"xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
					<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
					<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
				</svg>
				</Input>
			</div>
			<div class="mb-6">
				<Label for="input-group-1" class="block mb-2">Your password</Label>
				<Input name="password" id="password" type="password" placeholder="***********">
				<svg slot="left" class="w-5 h-5 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
					<path d="M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z"/>
				</svg>
				</Input>
			</div>
			<Button  type="submit" class="w-full" color="blue">Login</Button>
		</form>
	</Card>
</div>

</section>