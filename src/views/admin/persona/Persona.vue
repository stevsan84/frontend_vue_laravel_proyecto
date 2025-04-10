<template>
    <div class="card">
        <h1>Personas</h1>
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openDialog" />
            </template>
        </Toolbar>
        <DataTable :value="personas" tableStyle="min-width: 50rem" v-model:selection="selectedProducts"
            :filters="filters">

            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Administrar Personas</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                    </IconField>
                </div>
            </template>

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
                        <Button icon="pi pi-plus" severity="info" outlined rounded class="mr-2"
                            @click="openDialogUsuario(slotProps.data)" />
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

        <Dialog v-model:visible="visibleUser" modal header="Asignar Usuario" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese los datos</span>
            <div class="flex flex-col gap-2 mb-4">
                <label for="email" class="font-semibold w-24">Email</label>
                <InputText id="email" type="email" class="flex-auto" autocomplete="off" v-model="user.email" />
                <Message v-if="errors.email" severity="error" size="small" variant="simple">{{errors.email}}</Message>
                
            </div>
            <div class="flex flex-col gap-2 mb-4">
                <label for="pass" class="font-semibold w-24">Contraseña</label>
                <InputText id="pass" type="password" class="flex-auto" autocomplete="off" v-model="user.password" />
                <Message v-if="errors.password" severity="error" size="small" variant="simple">{{errors.password}}</Message>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleUser = false"></Button>
                <Button type="button" label="Guardar" @click="funAsignarUsuario"></Button>
            </div>
        </Dialog>

    </div>
    <!--<pre>
        {{ personas }}
    </pre>-->

</template>
<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import personaService from '../../../services/persona.service ';

const personas = ref([]);
const visible = ref(false);
const persona = ref({});
const user = ref({});
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const errors = ref({});
const visibleUser = ref(false);

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
    persona.value = {};
    visible.value = true;
}

async function funGuardarPersona() {
    const { data } = await personaService.guardarPersona(persona.value);
    visible.value = false;
    getPersonas();
}

function openDialogUsuario(per) {
    persona.value = per;
    errors.value = {};
    visibleUser.value = true;
}

async function funAsignarUsuario() {
    try {
        const { data } = await personaService.asignarUserPersona(persona.value.id, user.value);
        visibleUser.value = false;
        getPersonas();
        persona.value = {};
        user.value = {};
    } catch (error) {
        console.log(error.response?.data?.errors);
        errors.value = error.response?.data?.errors;
    }
}
</script>