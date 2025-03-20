<template>
    <h1>Mi Perfil</h1>
    <h3>NOMBRE: {{ perfil.name }}</h3>
    <h3>EMAIL: {{ perfil.email }}</h3>
    <br>
    <button @click="funSalir()">Salir</button>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import authService from '../../../services/auth.service';
import { useRouter } from 'vue-router';


const perfil = ref({});
const router = useRouter();

onMounted(() => {
    getPerfil();
})

async function getPerfil(){
    const {data} = await authService.perfil();
    perfil.value = data;
}

async function funSalir(){
    await authService.logout();
    localStorage.removeItem("access_token");
    //reedirecionar
    router.push({name: "Login"});
}


</script>