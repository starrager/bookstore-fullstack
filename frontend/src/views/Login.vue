<template>
    <div class="login">
        <form @submit.prevent="login" class="loginForm" novalidate>
            <input type="text" class="email" placeholder="enter email" v-model="email">
            <input type="passowrd" class="password" placeholder="enter password" v-model="password">
            <button type="submit" class="login" formnovalidate>Login</button>
            <p>No account? <router-link to="/register">Register</router-link></p>
        </form>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cartStore=useCartStore()
const router=useRouter()
const email=ref('')
const password=ref('')

const login=async()=>{
    try{
        const response=await axios.post('http://localhost:5178/api/auth/login',{
            email:email.value,
            password:password.value
        })

        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        await cartStore.getCart()
        alert('авторизация успешна')
        router.push('/')

    }catch(error){
        console.error(error)
        alert('ошибка авторизации')
    }
}
</script>

<style scoped>
.login{
    display:flex;
    justify-content:center;
    align-items:center;
}
.loginForm{
    display:flex;
    flex-direction:column;
    gap:12px;
    width:300px;
    padding:20px;
    border:1px solid #ddd;
    border-radius:8px;
    background:#f9f9f9;
}
.loginForm input{
    padding:10px;
    border:1px solid #ccc;
    border-radius:4px;
    font-size:16px;
}
.loginForm button{
    padding:10px;
    background:#4CAF50;
    color:white;
    border:none;
    border-radius:4px;
    cursor:pointer;
    font-size:16px;
}
.loginForm button:hover{
    background:#45a049;
}
.loginForm p{
    text-align:center;
    margin:0;
}
</style>