import Api from "./api.service";

export default{
    getPersonas(){
        return Api().get("/persona");
    },
    
    guardarPersona(datos){
        return Api().post("/persona",datos);
    }
}