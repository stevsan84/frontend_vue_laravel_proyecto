<template>
    <h1>Blog</h1>
    <hr>
    <button @click="obtenerPublicaciones()">Obtener Datos</button>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>TITULO</th>
          <th>DESCRIPCION</th>
          <th>IMAGEN</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="publicacion in publicaciones">
          <td>{{ publicacion.id }}</td>
          <td>{{ publicacion.title }}</td>
          <td>{{ publicacion.description }}</td>
          <td>
            <img :src="publicacion.cover_image" alt="" width="150px">
          </td>
        </tr>
      </tbody>
    </table>
    {{ publicaciones }}
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  
  // variables
  const publicaciones = ref([]);
  
  // onMounted
  onMounted(() => {
    obtenerPublicaciones();
  });
  
  // funciones
  function obtenerPublicaciones() {
    //fetch('https://infoplacas.herokuapp.com/https://prueba.onlineciber.com/app/cedula.php?id=0919909127')
    //fetch('https://infoplacas.herokuapp.com/https://prueba.onlineciber.com/app/cedula.php?id=${cedula}')
    fetch('https://dev.to/api/articles')
      .then(response => response.json())
      .then(json => {
        publicaciones.value = json
      }) //.then(json => console.log(json))
  };
  
  </script>
  
  <style></style>
  