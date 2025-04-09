<template>
     <nav class="bg-blue-600 p-4">
            <div class="container max-auto flex justify-between item-centar">
                <RouterLink to="/" class="text-white text-2xl font-bold">ECCOMERCE</RouterLink>
                <ul class="flex space-x-6">
                    <li><RouterLink to="/" class="text-white hover:text-gray-200">INICIO</RouterLink></li>
                    <li><RouterLink to="/productos" class="text-white hover:text-gray-200">PRODUCTOS</RouterLink></li>
                    <li><RouterLink to="/servicios" class="text-white hover:text-gray-200">SERVICIOS</RouterLink></li>
                    <li><RouterLink to="/nosotros" href="" class="text-white hover:text-gray-200">NOSOTROS</RouterLink></li>
                    <li><RouterLink to="/blog" class="text-white hover:text-gray-200">BLOG</RouterLink></li>
                    <li><RouterLink to="/auth/login" class="text-white hover:text-gray-200">INGRESAR</RouterLink></li>
                </ul>
            </div>
        </nav>
</template>