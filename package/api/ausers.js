import { API_ADDRESS } from "./env";

export async function  getUserInboxNumber(){
    let r= await fetch(`${API_ADDRESS}/admin/get_user_inbox_number`,{
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

export async function  getUserInboxMessages(){
    let r= await fetch(`${API_ADDRESS}/admin/get_user_inbox_messages`,{
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


export async function  markMessageAsViewed(id){
    let r= await fetch(`${API_ADDRESS}/admin/markMessageAsViewed`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({"id":id})
    
    })
    if (!r.ok){
        return false;
    }
    return true;
}


export async function  getUsers(){
    let r= await fetch(`${API_ADDRESS}/admin/getUsers`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return [];
    }
    let data=   await r.json()
    return data.data;
}


export async function  getUser(id){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/users/user`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({user_id:id})
    
    })
    if (!r.ok){
        return [];
    }
    let data=   await r.json()
    return data.data;
}

export async function  getDepartments(){
    let r= await fetch(`${API_ADDRESS}/admin/getDepartments`,{
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    
    })
    if (!r.ok){
        return [];
    }
    let data=   await r.json()
    return data.data;
}

export async function  getDepartment(id){
    let r= await fetch(`${API_ADDRESS}/admin/superuser/departments/department`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({department_id:id})
    
    })
    if (!r.ok){
        return {};
    }
    let data=   await r.json()
    return data.data;
}
export async function  createUser(usr_data){
    let r= await fetch(`${API_ADDRESS}/admin/create_user`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usr_data)
    })
    if (!r.ok){
        return false;
    }
    return true;
}


export async function  updateUser(usr_data){
    let r= await fetch(`${API_ADDRESS}/admin/updateUser`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usr_data)
    })
    if (!r.ok){
        return false;
    }
    return true;
}

export async function  deleteUser(id){
    let r= await fetch(`${API_ADDRESS}/admin/deleteUser`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"id":id})
    })
    if (!r.ok){
        return false;
    }
    return true;
}


export async function  deleteDepartment(id){
    let r= await fetch(`${API_ADDRESS}/admin/deleteDepartment`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"id":id})
    })
    if (!r.ok){
        return false;
    }
    return true;
}

export async function  updateDepartment(data){
    let r= await fetch(`${API_ADDRESS}/admin/updateDepartment`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!r.ok){
        return false;
    }
    return true;
}

export async function  createDepartment(data){
    let r= await fetch(`${API_ADDRESS}/admin/createDepartment`,{
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!r.ok){
        return false;
    }
    return true;
}
