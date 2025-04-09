<template>
    <div class="card">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" v-if="cargando" />
        <h6>CON TAILWIND CSS</h6>
        <table class="min-w-full table-auto border-collapse">
            <thead>
                <tr class="bg-blue-500 text-white">
                    <th class="px-4 py-2 border border-gray-300">ID</th>
                    <th class="px-4 py-2 border border-gray-300">NOMBRE</th>
                    <th class="px-4 py-2 border border-gray-300">CORREO</th>
                    <th class="px-4 py-2 border border-gray-300">CREADO EN</th>
                    <th class="px-4 py-2 border border-gray-300">ACCION</th>
                </tr>
            </thead>
            <tbody class="odd:bg-gray-100" v-for="user in usuarios">
                <th class="px-4 py-2 border border-gray-300">{{ user.id }}</th>
                <th class="px-4 py-2 border border-gray-300">{{ user.name }}</th>
                <th class="px-4 py-2 border border-gray-300">{{ user.email }}</th>
                <th class="px-4 py-2 border border-gray-300">{{ user.created_at }}</th>
                <th class="px-4 py-2 border border-gray-300">
                    <button class="bg-yellow-500 px-2 py-2 rounded-full text-white">Editar</button>
                    <button class="bg-red-500 px-2 py-2 rounded-full text-white"><i class="pi pi-times"
                            style="font-size: 1.5rem"></i></button>
                </th>
            </tbody>
        </table>
    </div>
    <div class="card">
        <h6>CON PRIME VUE</h6>
        <DataTable :value="usuarios">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="NOMBRE"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column field="created_at" header="CREADO EN"></Column>
        </DataTable>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import userService from '../../../services/user.service';

const cargando = ref(false);
const usuarios = ref([]);

onMounted(() => {
    funListarUsuarios();
});

async function funListarUsuarios() {
    cargando.value = true;
    const { data } = await userService.getUsuarios();
    usuarios.value = data;
    cargando.value = false;
}
</script>