<template>
    <div class="card">
       <!--
        <h1>Mi Perfil</h1>
        <h3>NOMBRE: {{ perfil.name }}</h3>
        <h3>EMAIL: {{ perfil.email }}</h3>
        <br>
        <Button @click="funSalir()">Salir</Button>
        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded" @click="funSalir()">Salir</button>
        -->

        <ProgressBar mode="indeterminate" style="height: 6px" v-if="cargando"></ProgressBar>

        <div class="font-sans antialiased text-gray-900 leading-normal tracking-wider bg-cover"
            style="background-image:url('https://source.unsplash.com/1L71sPT5XKc');">



            <div class="max-w-4xl flex items-center h-auto flex-wrap mx-auto my-32 lg:my-0">

                <!--Main Col-->
                <div id="profile"
                    class="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">


                    <div class="p-4 md:p-12 text-center lg:text-left">
                        <!-- Image for mobile view-->
                        <div class="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
                            style="background-image: url('https://source.unsplash.com/MP0IUfwrn0A')"></div>

                        <h1 class="text-3xl font-bold pt-8 lg:pt-0">{{ perfil.name }}</h1>
                        <small><strong>{{ perfil.persona?.nombres }}</strong></small>
                        <div class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                        <p class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><svg
                                class="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
                            </svg> {{ perfil.email }}</p>
                        <p
                            class="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                            <svg class="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z" />
                            </svg> {{ perfil.created_at }}
                        </p>
                        <p class="pt-8 text-sm">Totally optional short description about yourself, what you do and so
                            on.</p>

                        <div class="pt-12 pb-8">
                            <button @click="funSalir()" class="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded-full">
                                CERRAR SESION
                            </button>
                        </div>



                        <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->

                    </div>

                </div>

                <!--Img Col-->
                <div class="w-full lg:w-2/5">
                    <!-- Big profile image for side bar (desktop) -->
                    <img src="https://reqres.in/img/faces/8-image.jpg"
                        class="rounded-none lg:rounded-lg shadow-2xl hidden lg:block">
                    <!-- Image from: http://unsplash.com/photos/MP0IUfwrn0A -->

                </div>


                <!-- Pin to top right corner -->
                <div class="absolute top-0 right-0 h-12 w-18 p-4">
                    <button class="js-change-theme focus:outline-none">🌙</button>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import authService from '../../../services/auth.service';
import { useRouter } from 'vue-router';
import { Button } from 'primevue';


const perfil = ref({});
const router = useRouter();
const cargando = ref(false);
onMounted(() => {
    getPerfil();
})

async function getPerfil() {
    cargando.value = true;
    const { data } = await authService.perfil();
    perfil.value = data;
    cargando.value = false;
}

async function funSalir() {
    await authService.logout();
    localStorage.removeItem("access_token");
    //reedirecionar
    router.push({ name: "Login" });
}


</script>