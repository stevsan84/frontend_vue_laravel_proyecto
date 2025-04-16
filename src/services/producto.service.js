import Api from "./api.service"

export default{
    funListar: function(){ //funcion anonima
        return Api().get(`/producto`); //alt 96 `
    },

    funGuardar: (datos) => { //funcion flecha
        return Api().post(`/producto`,datos);
    },
    
    mostrar(id){ //funcion simple
        return Api().get(`/producto/${id}`);
    },

    funModificar: (id, datos) => {
        return Api().put(`/producto/${id}`,datos);
    },

    funEliminar: (id) => {
        return Api().delete(`/producto/${id}`);
    }

}