import { API_ADDRESS } from "./env";

export async function  createClient(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/create`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    
    })
    if (!r.ok){
        return [];
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return [];
    }
}

export async function  createNote(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/notes/create`,{
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
        return data;
    }catch{
        return null;
    }
}

export async function  getNotes(uid){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/notes`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({client_uid:uid})
    
    })
    if (!r.ok){
        return null;
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return null;
    }
}
export async function  editClient(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/edit`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    
    })
    if (!r.ok){
        return r;
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return r;
    }
}

export async function  deleteClient(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/delete`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    
    })
    if (!r.ok){
        return r;
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return r;
    }
}
export async function getClients(){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok)
        return []
    
    try{
        let data=   await r.json()
        return data.data;
    }catch{
        return [];
    }
} 
export async function getClient(uid){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/getClient`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({client_uid:uid})
    })
    if (!r.ok)
        return {}
    
    try{
        let data=   await r.json()
        return data.data;
    }catch{
        return {};
    }
} 


export async function getCountries(){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/getCountries`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok)
        return []
    
    try{
        let data=   await r.json()
        return data.data;
    }catch{
        return [];
    }
} 


export async function  createMailboxDomainApi(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/mailboxes/domains/create`,{
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
        return data;
    }catch{
        return null;
    }
}

export async function  createMailboxEmailsApi(body){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/mailboxes/emails/create`,{
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
        return data;
    }catch{
        return null;
    }
}


export async function getMailboxEmailsApi(uid){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/mailboxes/emails/get`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({client_uid:uid})
    })
    if (!r.ok){
        return [];
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return [];
    }
}

export async function getMailboxDomainsApi(uid){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/clients/mailboxes/domains/get`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({client_uid:uid})
    })
    if (!r.ok){
        return [];
    }
    try{
        let data=   await r.json()
        return data;
    }catch{
        return [];
    }
}












