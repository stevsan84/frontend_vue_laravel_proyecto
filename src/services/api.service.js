import axios from "axios"
//export const BASE_URL = "http://127.0.0.1:8000";
export let BASE_URL;
const dev = true;

if (dev){
    BASE_URL = "http://127.0.0.1:8000";
}else{
    BASE_URL = "https://miempresa.com";
}


//export const BASE_URL_API = BASE_URL + "/api";
export const BASE_URL_API = `${BASE_URL}/api`; 

export default function Api(){ //para peticiones administrativas

    //const token = "ABC.XYZ.ZXC"
    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: BASE_URL_API,
        headers: {
            'Accept': 'application/json',
            'Authorization' : 'Bearer ' + token
        }
    })

    //interceptor
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) =>{
            //error 401 (auth)
            if(error.response?.status === 401){
                localStorage.removeItem("access_token");
                location.href = "/auth/login"
            }

            return Promise.reject(error);
        }
    )
    return api;
}

export function ApiAuth(){ //para peticiones publicas

    const api = axios.create({
        baseURL: BASE_URL_API,
        headers: {
            'Accept': 'application/json'
        }
    })

    //interceptor
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) =>{
            //error 401 (auth)
            if(error.response?.status === 401){
                localStorage.removeItem("access_token");
                location.href = "/auth/login"
            }

            return Promise.reject(error);
        }
    )
    return api;
}