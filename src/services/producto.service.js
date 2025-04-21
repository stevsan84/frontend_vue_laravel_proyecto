import Api from "./api.service"

export default{
    funListar: function(page=1, limit=5, q=''){ //funcion anonima
        return Api().get(`/producto?page=${page}&limit=${limit}&q=${q}`); //alt 96 `
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
    },
    funSubirImagen: (id,formData) => { //funcion flecha
        return Api().post(`/producto/${id}/subir-imagen`,formData);
    },

}