import { API_ADDRESS } from "./env";


export async function  getUsersTicketsReports(){
    let r= await fetch(`${API_ADDRESS}/admin/dashboard/reports/users`,{
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

export async function  getSuperUsersReports(){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/reports/dashboard`,{
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