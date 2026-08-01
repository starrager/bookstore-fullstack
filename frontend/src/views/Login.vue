<template>
    <div class="login">
        <form @submit.prevent="login" class="loginForm" novalidate>
            <input type="email" class="email" placeholder="enter email" v-model="email">
            <input type="passowrd" class="password" placeholder="enter password" v-model="password">
            <button type="submit" class="login" formnovalidate>Login</button>
            <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
        </form>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'

const email=ref('')
const password=ref('')

const login=async()=>{
    try{
        const response=await axios.post('http://localhost:5178/api/auth/login',{
            email:email.value,
            password:password.value
        })
        alert('авторизация успешна')
    }catch(error){
        console.error(error)
        alert('ошибка авторизации')
    }
}
</script>

<style scoped>

</style>