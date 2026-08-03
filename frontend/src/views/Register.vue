<template>
    <div class="register">
        <form @submit.prevent="checkPassword" class="registerForm">
            <input type="text" class="name" v-model="name" placeholder="enter your nickname">
            <input type="text" class="email" v-model="email" placeholder="enter your email">
            <input type="password" class="password1" v-model="password1" placeholder="enter password">
            <input type="password" class="password2" v-model="password2" placeholder="repeat password">
            <button type="submit">Register</button>
            <p>Есть аккаунт? <router-link to="/login">Войти</router-link></p>
        </form>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'

const router=useRouter()
const name=ref('')
const email=ref('')
const password1=ref('')
const password2=ref('')

const checkPassword=async()=>{
    try{
        if(password1.value===password2.value)await register()
        else throw(error)
    }catch(error){
        console.error(error)
        alert('пароли не совпадают')
    }
}

const register=async()=>{
    try{
        const response=await axios.post('http://localhost:5178/api/auth/register',{
            name:name.value,
            email:email.value,
            password:password1.value
        })
        console.log('успешно ', response.data)
        alert('регистрация успешна')

        name.value=''
        email.value=''
        password1.value=''
        router.push('/')

    }catch(error){
        console.error('ошибка: ',error.response?.data?.error||'чтото пошло не так')
        alert('Ошибка регистрации')
    }
}
</script>

<style scoped>

</style>