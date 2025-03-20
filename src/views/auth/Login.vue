<template>
    <h1>Ingresar</h1>
    <!--{{ errors }}
    <br>-->
    <label for="">Ingrese Correo:</label>
    <input type="email" v-model="credenciales.email">
    {{ errors.email }}
    <br>
    <label for="">Ingrese contraseña:</label>
    <input type="password" v-model="credenciales.password">
    {{ errors.password }}
    <br>
    <button @click="funIngresar()">Ingresar</button>

    <br>

    {{ credenciales }}
    <br>
    {{ respuesta }}

</template>

<script setup>

import { ref } from 'vue';
import authService from '../../services/auth.service';
import { useRouter } from 'vue-router';

const credenciales = ref({ email: "", password: "" });
const respuesta = ref();
const errors = ref({});

const router = useRouter();

async function funIngresar() {

    try {
        const  res  = await authService.login(credenciales.value);
        respuesta.value = res.data;
        localStorage.setItem("access_token", res.data.access_token);

        //reedirecionar
        router.push({name: "MiPerfil"});

    } catch (error) {
        console.log (error.response?.data?.errors);
        errors.value = error.response?.data?.errors;
    }

}

</script>