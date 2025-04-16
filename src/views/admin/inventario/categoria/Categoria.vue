<template>
    <div class="card">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
            aria-label="Custom ProgressSpinner" v-if="cargando" />

        <Button label="Nuevo" @click="funNuevaCategoria()" />

        <DataTable :value="categorias" tableStyle="min-width: 50rem">
            <Column field="id" header="Id"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column field="estado" header="Estado">
                <template #body="slotProps">
                    <Tag severity="success" value="Activo" v-if="slotProps.data.estado"></Tag>
                    <Tag severity="danger" value="Inactivo" v-else></Tag>
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem" header="Acción">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                        @click="editarCategoria(slotProps.data)" v-if="slotProps.data.estado"/>
                    <Button icon="pi pi-lock" outlined rounded severity="danger"
                        @click="confirmarEliminacionCategoria(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="visible" modal header="Categoría" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Información de Categoría</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Nombre</label>
                <InputText id="nombre" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="descripcion" class="font-semibold w-24">Descripción</label>
                <InputText id="descripcion" class="flex-auto" autocomplete="off" v-model="categoria.descripcion" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Guardar" @click="funGuardar()"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleDelete" modal header="Eliminar Categoría" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Esta seguro de eliminar de Categoría?</span>

            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleDelete = false"></Button>
                <Button type="button" label="Eliminar" @click="eliminarCategoria()"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
//import categoriaService from '../../../../services/categoria.service';
import categoriaService from '@/services/categoria.service';
import Swal from 'sweetalert2';

const categorias = ref([]);
const cargando = ref(false);
const categoria = ref({});
const visible = ref(false);
const visibleDelete = ref(false);

onMounted(() => {
    //getCategorias();
    obtenerCategorias();
});

const obtenerCategorias = async () => {
    cargando.value = true;
    const { data } = await categoriaService.funListar();
    categorias.value = data;
    cargando.value = false;
}

async function getCategorias() {
    cargando.value = true;
    const { data } = await categoriaService.funListar();
    categorias.value = data;
    cargando.value = false;
}

const editarCategoria = (cat) => {
    categoria.value = cat;
    visible.value = true;
}

const funNuevaCategoria = () => {
    visible.value = true;
    categoria.value = {};
}

const funGuardar = async () => {

    try {
        if (categoria.value.id) {
            const { data } = await categoriaService.funModificar(categoria.value.id, categoria.value);
            visible.value = false;
            obtenerCategorias();
            Swal.fire({
                title: "Categoría Actualizada!",
                text: "ok para continuar!",
                icon: "success"
            });
        } else {
            const { data } = await categoriaService.funGuardar(categoria.value);
            visible.value = false;
            obtenerCategorias();
            Swal.fire({
                title: "Categoría Registrada!",
                text: "ok para continuar!",
                icon: "success"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Problema al registrar!",
            text: "ok para continuar!",
            icon: "warn"
        });
    }

}

const confirmarEliminacionCategoria = (cat) => {
    categoria.value = cat;
    visibleDelete.value = true;
    /*categoria.value = cat;
    //deleteProductDialog.value = true;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });*/

};

const eliminarCategoria = async () => {
    const { data } = await categoriaService.funEliminar(categoria.value.id);
    visibleDelete.value = false;
    obtenerCategorias();
    Swal.fire({
        title: "Categoría Eliminada!",
        text: "ok para continuar!",
        icon: "success"
    });
}
</script>