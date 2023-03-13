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