<template>
    <div class="card">
        <h4>Listado de Pedidos</h4>
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="abrirNuevo" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" customUpload
                    chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable
                ref="dt"
                :value="pedidos"
                lazy
                :loading="loading"
                :totalRecords="totalRecords"
                @page="onPage($event)"
                dataKey="id"
                :paginator="true"
                :rows="5"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} pedidos"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestionar Pedidos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="buscar" placeholder="Buscar..." @keyup.enter="getProductos()"/>
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Id" sortable style="min-width: 2rem"></Column>
                <Column field="fecha" header="Fecha" sortable style="min-width: 4rem"></Column>
                <Column field="cliente.nombre_completo" header="Cliente" sortable style="min-width: 6rem"></Column>
                <Column field="estado" header="Estado" sortable style="min-width: 4rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getStatusLabel(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column field="productos" header="Producto"  style="min-width: 4rem">
                    <template #body="slotProps">
                        <Button label="Mostrar Detalle Pedido" @click="abrirDetallePedido(slotProps.data)"></Button>
                    </template>
                </Column>
            </DataTable>
    </div>

    <Dialog v-model:visible="visiblePedido" modal header="Detalle del Pedido" :style="{ width: '30rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Cliente: {{pedido.cliente.nombre_completo}}</span>
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Cédula: {{pedido.cliente.ci_nit}}</span>
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Teléfono: {{pedido.cliente.telefono}}</span>
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Dirección: {{pedido.cliente.direccion}}</span>
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Email: {{pedido.cliente.correo}}</span>
            <div class="flex items-center gap-4 mb-4">
                <DataTable :value="pedido.productos">
                    <Column field="id" header="Id"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="pivot.cantidad" header="Cantidad"></Column>
                    <Column field="precio" header="Precio"></Column>
                </DataTable>
               {{ pedido.productos.nombre }}
            </div>
            
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visiblePedido = false"></Button>
            </div>
        </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import pedidoService from '../../../services/pedido.service';

const pedidos = ref([]);
const buscar = ref("");
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const dt = ref();
const visiblePedido = ref(false);
const pedido = ref({});

onMounted(() => {
    getPedidos();

});

const getPedidos = async () => {
    loading.value = true;
    const respuesta  = await pedidoService.funListar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    pedidos.value = respuesta.data.data;
    totalRecords.value =respuesta.data.total;
    loading.value = false;
}

const getStatusLabel = (status) => {
    switch (status) {
        case 1:
            return 'warning';

        /*case 'LOWSTOCK':
            return 'warn';*/

        case 2:
            return 'success';

        default:
            return null;
    }
};

const abrirDetallePedido = (det_pedido) =>{
    pedido.value = det_pedido;
    visiblePedido.value = true;

}
</script>