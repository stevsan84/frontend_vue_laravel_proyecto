<template>
    <div class="flex h-screen p-4 space-x-4 bg-gray-100">
        <div class="w-2/3 bg-white p-4 rounded shadown overflow-y-auto">
            <h2 class="text-xl font-semibold mb-4">Productos</h2>
            <DataTable
                ref="dt"
                :value="products"
                lazy
                :loading="loading"
                :totalRecords="totalRecords"
                @page="onPage($event)"
                dataKey="id"
                :paginator="true"
                :rows="5"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestionar Productos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="buscar" placeholder="Buscar..." @keyup="getProductos()"/>
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Id" sortable style="min-width: 1rem"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 8rem"></Column>
                <Column header="Imagen">
                    <template #body="slotProps">
                        <Image v-if="slotProps.data.imagen" :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`" :alt="slotProps.data.nombre" class="rounded" style="width: 64px" preview />
                    </template>
                </Column>
                <Column field="precio" header="Precio" sortable style="min-width: 4rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.precio) }}
                    </template>
                </Column>
                <Column field="stock" header="Stock" sortable style="min-width: 4rem"></Column>
                <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 4rem"></Column>
                
                <Column field="estado" header="Estado" sortable style="min-width: 2rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getStatusLabel(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 4rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-plus" outlined rounded severity="warn" class="mr-2" @click="funAddCarrito(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="w-1/3 flex flex-col space-y-4">
            <div class="bg-white p-4 rounded shadown overflow-y-auto">
                <h2 class="text-xl font-semibold mb-4">Carrito</h2>
                <DataTable :value="carrito">
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="cantidad" header="Cantidad"></Column>
                    <Column field="precio" header="Precio"></Column>
                </DataTable>
            </div>
            <div class="bg-white p-4 rounded shadown">
                <h2 class="text-xl font-semibold mb-4">Cliente</h2>
                <Button label="Nuevo Cliente" @click="visibleCliente = true" />
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="buscar_cliente" placeholder="Buscar..." @keyup.enter="getclienteBusquedad()"/>
                </IconField>
                <div class="card" v-if="cliente_seleccionado.id">
                    <strong>Nombres: {{ cliente_seleccionado.nombre_completo }}</strong>
                    <br>
                    <strong>Cedula: {{ cliente_seleccionado.ci_nit }}</strong>
                    <br>
                    <strong>Teléfono: {{ cliente_seleccionado.telefono }}</strong>
                    <br>
                    <strong>Dirección: {{ cliente_seleccionado.direccion }}</strong>
                    <br>
                    <strong>Email: {{ cliente_seleccionado.correo }}</strong>  
                </div>
            </div>
            <div class="bg-white p-4 rounded shadown">
                <h2 class="text-xl font-semibold mb-4">Pedido</h2>
                Observación
                <Textarea></Textarea>
                <Button label="Generar Pedido" @click="funGuardarPedido()" />
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleCliente" modal header="Datos del Cliente" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Cliente.</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Nombre</label>
            <InputText id="username" v-model="cliente.nombre_completo" class="flex-auto" autocomplete="off" required="true"/>
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="cedula" class="font-semibold w-24">Cedula</label>
            <InputText id="cedula" v-model="cliente.ci_nit" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="telefono" class="font-semibold w-24">Teléfono</label>
            <InputText id="telefono" v-model="cliente.telefono" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="direccion" class="font-semibold w-24">Dirección</label>
            <InputText id="direccion" v-model="cliente.direccion" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="email" class="font-semibold w-24">Email</label>
            <InputText id="email" type="email" v-model="cliente.correo"  class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleCliente = false"></Button>
            <Button type="button" label="Guardar" @click="saveCliente"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import productoService from '@/services/producto.service';
import Swal from 'sweetalert2';
import clienteService from '@/services/cliente.service';
import pedidoService from '../../../services/pedido.service';

const products = ref([]);
const buscar = ref("");
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const producto = ref({});
const dt = ref();
const carrito = ref([]);
const visibleCliente = ref(false);
const cliente = ref({});
const cliente_seleccionado = ref({});
const buscar_cliente = ref("");

onMounted(() => {
    getProductos();
});

const onPage = (event) => {
    lazyParams.value = event;
    //console.log(lazyParams);
    getProductos();
} 

const getProductos = async () => {
    loading.value = true;
    const respuesta  = await productoService.funListar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    products.value = respuesta.data.data;
    totalRecords.value =respuesta.data.total;
    loading.value = false;
}

const getclienteBusquedad = async () => {
    const {data} = await clienteService.funBusquedadCliente(buscar_cliente.value);
            cliente_seleccionado.value = data;
}
const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};

const getStatusLabel = (status) => {
    switch (status) {
        case true:
            return 'success';

        /*case 'LOWSTOCK':
            return 'warn';*/

        case false:
            return 'danger';

        default:
            return null;
    }
};

const funAddCarrito = (prod) =>{
    carrito.value.push({id: prod.id, nombre: prod.nombre, cantidad: 1, precio: prod.precio})
}

const saveCliente = async () =>{
    try {
        if (cliente?.value.nombre_completo?.trim()) {
            const {data} = await clienteService.funGuardar(cliente.value);
            cliente_seleccionado.value = data.cliente;
            visibleCliente.value = false;
            cliente.value = {};
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Cliente Guardado",
                    showConfirmButton: false,
                    timer: 1500
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

const funGuardarPedido = async () =>{
    try {
     let datos= {
        cliente_id : cliente_seleccionado.value.id,
        productos:  carrito.value
     }  

     const {data} = await pedidoService.funGuardar(datos);
     cliente_seleccionado.value = {};
     carrito.value = [];

     Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Pedido Guardado",
        showConfirmButton: false,
        timer: 1500
    });
    } catch (error) {
        Swal.fire({
            title: "Problema al registrar!",
            text: "ok para continuar!",
            icon: "warn"
        });
    }
}
</script>