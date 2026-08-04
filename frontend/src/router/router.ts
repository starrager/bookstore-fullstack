import { createRouter,createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import Cart from '@/views/Cart.vue'
import Favorites from "@/views/Favorites.vue";

const routes=[
    {
        path:'/',
        component:Home
    },
    {
        path:'/register',
        component:Register
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/cart',
        component:Cart
    },
    {
        path:'/favorites',
        component:Favorites
    }
]

const router=createRouter({
    history:createWebHistory(),routes
})

export default router