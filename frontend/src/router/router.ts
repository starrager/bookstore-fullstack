import { createRouter,createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import Cart from '@/views/Cart.vue'

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
    }
]

const router=createRouter({
    history:createWebHistory(),routes
})

export default router