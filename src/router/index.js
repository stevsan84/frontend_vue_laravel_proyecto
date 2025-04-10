import { createWebHashHistory, createRouter, createWebHistory } from 'vue-router'

import Inicio from "./../views/web/Inicio.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Servicios from "../views/web/Servicios.vue";
import Login from "../views/auth/Login.vue"
import Blog from '../views/web/Blog.vue';
import Perfil from '../views/admin/perfil/Perfil.vue';
import Usuario from '../views/admin/user/Usuario.vue';
import AppLayout from '@/layout/AppLayout.vue';
import LayoutSitio from '../components/layousitio/LayoutSitio.vue';
import Producto from '../views/web/Producto.vue';
import Persona from '../views/admin/persona/Persona.vue';
import Categoria from '../views/admin/inventario/categoria/Categoria.vue';

const routes = [
    {
        path: "/",
        component: LayoutSitio,
        children: [
            { path: "/", component: Inicio },
            { path: "/nosotros", component: Nosotros },
            { path: "/productos", component: Producto},
            { path: "/servicios", component: Servicios },
            { path: "/blog", component: Blog },
            {
                path: "/auth/login",
                component: Login,
                name: "Login",
                meta: { redirectIfAuth: true }
            },
        ]
    },
    {
        path: "/admin",
        component: AppLayout,
        children: [
            {
                path: "perfil",
                component: Perfil,
                name: "MiPerfil",
                meta: { requireAuth: true }
            },
            {
                path: "usuario",
                component: Usuario,
                name: "Usuario",
                meta: { requireAuth: true }
            },
            {
                path: "persona",
                component: Persona,
                name: "Persona",
                meta: { requireAuth: true }
            },
            {
                path: "categoria",
                component: Categoria,
                name: "Categoria",
                meta: { requireAuth: true }
            }
        ]
    },




]

const router = createRouter({
    history: createWebHistory(),
    routes,  //routes : routes,
})

// Guards
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("access_token");
    if (to.meta.requireAuth) {
        if (!token) {
            return next({ name: "Login" });
        }
        return next();
    }

    if (to.meta.redirectIfAuth && token) {
        return next({ name: "MiPerfil" });
    }
    return next();
})

export default router;