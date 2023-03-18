import { API_ADDRESS } from "./env";

export async function  getAdminPageTitle(){
    let r= await fetch(`${API_ADDRESS}/admin/getAdminPageTitle`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return "Open Tickets";
    }
    let data=   await r.json()
    return data.data;
}


export async function  getAppConfig(){
    let r= await fetch(`${API_ADDRESS}/admin/getAppConfig`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return "Open Tickets";
    }
    try{
        let data=   await r.json()
        return data.data;
    }catch{
        return null;
    }
}

export async function  updateAppConfig(body){
    let r= await fetch(`${API_ADDRESS}/admin/updateAppConfig`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    
    })
    if (!r.ok){
        return null;
    }
    try{
        let data=   await r.json()
        return data.data;
    }catch{
        return null;
    }

}