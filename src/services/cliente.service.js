import Api from "./api.service"

export default{
    funListar: function(){ //funcion anonima
        return Api().get(`/cliente`); //alt 96 `
    },

    funGuardar: (datos) => { //funcion flecha
        return Api().post(`/cliente`,datos);
    },
    
    mostrar(id){ //funcion simple
        return Api().get(`/cliente/${id}`);
    },

    funModificar: (id, datos) => {
        return Api().put(`/cliente/${id}`,datos);
    },

    funEliminar: (id) => {
        return Api().delete(`/cliente/${id}`);
    },
    funBusquedadCliente: (q="") => {
        return Api().get(`/cliente/buscar?q=${q}`);
    }
}