<script>
	import { goto } from "$app/navigation";
	import { callBackend } from "$lib/api";
	import { isLoading, user_isLoggedIn, user_token } from "$lib/stores";
	import { onMount } from "svelte";
    let url = ``;

    async function validateLogin(){
            isLoading.set(true)
            if( $user_token===null){
                goto(`/authenticate?redirect=${url}`)
                isLoading.set(false)
                return

            }
            let r =await callBackend('admin/check_auth',"GET")
            
            if(r.status==403){
                goto(`/authenticate?redirect=${url}`)
                isLoading.set(false)
                return
            }
            user_isLoggedIn.set(true)
            isLoading.set(false)

        }

    onMount(()=>{

        url = window.location.href
        
        if ($user_isLoggedIn===false){
            validateLogin()
        }
    })

</script>

