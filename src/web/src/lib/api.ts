import { user_isLoggedIn } from "./stores"


const backend_url="http://localhost:8080"

export async function callBackend(url:String,method:String="POST",data:any=null){
    let head={
        method:method.toUpperCase(),
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        
    }
    if (method.toUpperCase()==="POST"){
        head={...head,body:JSON.stringify(data)}
    }
    // @ts-ignore
    let r=await fetch(`${backend_url}/${url}`,{
        ...head
    })
    if (r.status===403){
        user_isLoggedIn.set(false)
        
    }
    return r
}