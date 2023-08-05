import { writable } from "svelte/store";


export const isLoading = writable(false);


export const user_token = writable<String|null>(null);
export const user_isLoggedIn = writable<boolean>(false);



