import Api from "./api.service"

export default{
    funListar: function(page=1, limit=5, q=''){ //funcion anonima
        return Api().get(`/pedido?page=${page}&limit=${limit}&q=${q}`); //alt 96 `
    },

    funGuardar: (datos) => { //funcion flecha
        return Api().post(`/pedido`,datos);
    },
    
    mostrar(id){ //funcion simple
        return Api().get(`/pedido/${id}`);
    },

    funModificar: (id, datos) => {
        return Api().put(`/pedido/${id}`,datos);
    },

    funEliminar: (id) => {
        return Api().delete(`/pedido/${id}`);
    }
}