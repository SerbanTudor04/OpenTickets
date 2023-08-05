import { writable } from "svelte/store";

export const toasts = writable<any[]>([])

export function sendErrorMessage(message:String){
    const id = Math.floor(Math.random() * 10000)
    toasts.update((all)=>[{
        id: id,
        message: message,
        type: "error"
    },...all])
}

export function sendSuccessMessage(message:String){
    const id = Math.floor(Math.random() * 10000)

    toasts.update((all)=>[{
        id: id,
        message: message,
        type: "success"
    },...all])
}

export function sendWarningMessage(message:String){
    const id = Math.floor(Math.random() * 10000)

    toasts.update((all)=>[{
        id: id,
        message: message,
        type: "warning"
    },...all])
}