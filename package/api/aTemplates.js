import { API_ADDRESS } from "./env";

export async function  getTemplates(){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates`,{
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
    }catch(e){
        console.debug(e)
        return null;
    }
    

}
export async function  getTemplate(id){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/template`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({template_id:id})
        
        })
        if (!r.ok){
            return null;
        }
        let data=   await r.json()
        return data.data;
    }catch(e){
        console.debug(e)
        return null;
    }
    

}
export async function  getBlock(id){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/blocks/block`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({block_id:id})
        
        })
        if (!r.ok){
            return null;
        }
        let data=   await r.json()
        return data.data;
    }catch(e){
        console.debug(e)
        return null;
    }
    

}


export async function  getBlocks(){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/blocks`,{
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
    }catch(e){
        console.debug(e)
        return null;
    }
    

}

export async function  getVariables(){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/variables`,{
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
    }catch(e){
        console.debug(e)
        return null;
    }
}

export async function  createTemplate(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/create`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}

export async function  updateTemplates(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/update`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}

export async function  deleteTemplates(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/delete`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}


export async function  createBlock(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/blocks/create`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}

export async function  updateBlock(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/blocks/update`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}

export async function  deleteBLock(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/templates/blocks/delete`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(send_data)
        })
        let data=   await r.json()
        return data;
    }catch(e){
        console.debug(e)
        return null;
    }
}