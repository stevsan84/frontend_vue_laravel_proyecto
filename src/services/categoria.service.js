import Api from "./api.service"

export default{
    funListar: function(){ //funcion anonima
        return Api().get(`/categoria`); //alt 96 `
    },

    funGuardar: (datos) => { //funcion flecha
        return Api().post(`/categoria`,datos);
    },
    
    mostrar(id){ //funcion simple
        return Api().get(`/categoria/${id}`);
    },

    funModificar: (id, datos) => {
        return Api().put(`/categoria/${id}`,datos);
    },

    funEliminar: (id) => {
        return Api().delete(`/categoria/${id}`);
    }

}