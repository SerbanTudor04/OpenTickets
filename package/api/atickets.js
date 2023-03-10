import { API_ADDRESS } from "./env";

export async function  getMyTcikets(){
    let r= await fetch(`${API_ADDRESS}/admin/tickets/getmyTickets`,{
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



export async function  getMyPendingRequests(){
    let r= await fetch(`${API_ADDRESS}/admin/tickets/getMyPendingRequests`,{
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


export async function  getTicketsStatusCodes(){
    let r= await fetch(`${API_ADDRESS}/admin/tickets/getTicketsStatusCodes`,{
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

export async function  getOpenOrReleasedTickets(){
    let r= await fetch(`${API_ADDRESS}/admin/tickets/getOpenOrReleasedTickets`,{
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

export async function  createTicket(data){
    let r= await fetch(`${API_ADDRESS}/admin/tickets/createTicket`,{
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


export async function  getTicketByID(id){
    try{
        let r= await fetch(`${API_ADDRESS}/admin/tickets/getTicketByID`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id":id})
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


export async function  assignTicket2Me(id){
    try{
        let r= await fetch(`${API_ADDRESS}/admin/tickets/assignTicket2Me`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id":id})
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


export async function  addMessage2TicketsOrMessage(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/tickets/addMessage2TicketsOrMessage`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
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


export async function  getTicketMessages(send_data){
    
    try{
        let r= await fetch(`${API_ADDRESS}/admin/tickets/getTicketMessages`,{
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
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