import { API_ADDRESS } from "./env";



export async function fetchAPIData(url,method){
    return fetch(API_ADDRESS+url,{
        credentials: 'include',
        method: String(method).toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }}
    )
}
