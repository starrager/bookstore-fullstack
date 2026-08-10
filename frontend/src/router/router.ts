import { createRouter,createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import Cart from '@/views/Cart.vue'
import Favorites from "@/views/Favorites.vue";
import Orders from "@/views/Orders.vue";
import Checkout from "@/views/Checkout.vue";
import Order from '@/views/Order.vue'
import Admin from "@/views/Admin.vue";

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
    },
    {
        path:'/orders',
        component:Orders
    },
    {
        path:'/checkout',
        component:Checkout
    },
    {
        path:'/orders/:id',
        component:Order
    },
    {
        path:'/admin/books',
        component:Admin,
        meta:{requiresAuth:true,requiresAdmin:true}
    }
]

const router=createRouter({
    history:createWebHistory(),routes
})

export default router