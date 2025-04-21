<template>
    <div class="card">
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
                            <InputText v-model="buscar" placeholder="Buscar..." @keyup.enter="getProductos()"/>
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="Id" sortable style="min-width: 2rem"></Column>
                <Column field="nombre" header="Nombre" sortable style="min-width: 16rem"></Column>
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
                <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 6rem"></Column>
                
                <Column field="estado" header="Estado" sortable style="min-width: 4rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getStatusLabel(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-image" outlined rounded severity="warn" class="mr-2" @click="funOpenDialogSubirImagen(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
    </div>

    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detalles del Producto" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="producto.imagen" :src="`http://127.0.0.1:8000/${producto.imagen}`" :alt="producto.imagen" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="producto.nombre" required="true" autofocus :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !producto.nombre" class="text-red-500">Nombre is requerido.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="producto.descripcion" rows="3" cols="20" fluid />
                </div>
                <div>
                    <span class="block font-bold mb-4">Categoría</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias">
                            <RadioButton :id="`category${cat.id}`" v-model="producto.categoria_id" name="category" :value="cat.id" />
                            <label :for="`category${cat.id}`">{{ cat.nombre }}</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="producto.precio" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Stock</label>
                        <InputNumber id="quantity" v-model="producto.stock" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>
    <Dialog v-model:visible="visibleDialogImagen" modal header="Actualizar Imagen" :style="{ width: '50rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Sube y Actualiza la Imagen</span>        
                <FileUpload customUpload @uploader="subirImagenProducto" :multiple="false" accept="image/*" :maxFileSize="1000000">
                    <template #empty>
                        <span>Arrastrar y soltar imagen para subir.</span>
                    </template>
                </FileUpload>
            
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleDialogImagen = false"></Button>
            </div>
        </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import productoService from '@/services/producto.service';
import Swal from 'sweetalert2';
import categoriaService from '@/services/categoria.service';

const products = ref([]);
const categorias = ref([]);
const buscar = ref("");
const cargando = ref(false);
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({});
const visibleDialogImagen = ref(false);
const productDialog = ref(false);
const producto = ref({});
const dt = ref();
const submitted = ref(false);

onMounted(() => {
    getProductos();
    getCategorias();
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

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async () => {
    submitted.value = true;

    try {
        if (producto?.value.nombre?.trim()) {
            if (producto.value.id) {
                await productoService.funModificar(producto.value.id, producto.value);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Producto Actualizado",
                    showConfirmButton: false,
                    timer: 1500
                });
            }else{
                await productoService.funGuardar(producto.value);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Producto Guardado",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        productDialog.value = false;
        producto.value = {};
        submitted.value = false;
        getProductos();
    }
    } catch (error) {
        
    }
    
}

const getCategorias = async () => {
    const {data}  = await categoriaService.funListar();
    categorias.value = data;
}

const abrirNuevo = () =>{
    producto.value = {};
    submitted.value = false;
    productDialog.value = true;
}

const exportCSV = () => {
    dt.value.exportCSV();
};

const funOpenDialogSubirImagen = (prod) => {
    visibleDialogImagen.value = true;
    producto.value = prod;
}

const subirImagenProducto = async (event) => {
    console.log(event.files[0]);

    let formData = new FormData();
    formData.append("imagen",event.files[0]);
    await productoService.funSubirImagen(producto.value.id,formData);
    visibleDialogImagen.value = false;
    getProductos();

    Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Imagen Actualizada",
    showConfirmButton: false,
    timer: 1500
    });
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

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const editProduct = (prod) => {
    producto.value = {...prod};
    productDialog.value = true;
};
</script>