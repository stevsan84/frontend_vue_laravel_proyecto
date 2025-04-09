<template>
    <div class="card">
        <h1>Personas</h1>
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openDialog" />
            </template>
        </Toolbar>
        <DataTable :value="personas" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombres" header="Nombres"></Column>
            <Column field="apellidos" header="Apellidos"></Column>
            <Column header="Usuario">
                <template #body="slotProps">
                    <div v-if="slotProps.data.user">
                        <strong>Correo: {{ slotProps.data.user?.email }}</strong><br>
                        <small>Creado en: {{ slotProps.data.user?.created_at }}</small>
                    </div>
                    <div v-else>
                        SIN CUENTA DE USUARIO
                        <Button icon="pi pi-plus" severity="info" outlined rounded class="mr-2"/>
                    </div>
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="visible" modal header="Asignar Datos Personales" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese los datos</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Nombres</label>
                <InputText id="username" class="flex-auto" autocomplete="off" v-model="persona.nombres" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Apellidos</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model="persona.apellidos" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">C.I.</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model="persona.ci" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Guardar" @click="funGuardarPersona"></Button>
            </div>
        </Dialog>
    </div>
    <!--<pre>
        {{ personas }}
    </pre>-->

</template>
<script setup>
import { onMounted, ref } from 'vue';
import personaService from '../../../services/persona.service ';

const personas = ref([]);
const visible = ref(false);
const persona = ref({});

onMounted(() => {
    getPersonas();
});

async function getPersonas() {
    //cargando.value = true;
    const { data } = await personaService.getPersonas();
    personas.value = data;
    //cargando.value = false;
}

function openDialog() {
    visible.value = true;
}

async function funGuardarPersona() {
    const { data } = await personaService.guardarPersona(persona.value);
    visible.value = false;
    getPersonas();
}
</script>