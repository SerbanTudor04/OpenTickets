import { API_ADDRESS } from "./env";



export async function  checkAuthentication(token){
    console.debug("Checking authentication with token: " + token);
    let r= await fetch(`${API_ADDRESS}/admin/check_auth`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (r.ok){
        return true;
    }
    return false;
}

export async function doLogin(email,password){
    let body={
        email:email,
        password:password
    }
    let r= await fetch(`${API_ADDRESS}/admin/login_user`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    
    })
    if(!r.ok){
        console.log(r);
        return ""
    }
    let data = await r.json()
    return data.auth_token;
}


export async function  getUserInfo(){
    let r= await fetch(`${API_ADDRESS}/admin/info_user`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return null;
    }
    let data=   await r.json()
    return data.data;
}

export async function  signOutUser(){
    let r= await fetch(`${API_ADDRESS}/admin/singout_user`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return null;
    }
    let data=   await r.json()
    return data.data;
}


export async function  isSuperUser(){
    let r= await fetch(`${API_ADDRESS}/admin/isSuperUser_user`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return false;
    }
    let data=   await r.json()
    return data.data.is_su;
}

