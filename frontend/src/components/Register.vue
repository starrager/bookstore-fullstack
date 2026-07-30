<template>
    <div class="register">
        <form action="" class="registerForm">
            <input type="text" class="name" v-model="name" placeholder="enter your nickname">
            <input type="email" class="email" v-model="email" placeholder="enter your email">
            <input type="password" class="password" v-model="password" placeholder="enter password">
            <button type="submit" class="submit" @click="register">Register</button>
        </form>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'

const name=ref('')
const email=ref('')
const password=ref('')

const register=async()=>{
    try{
        const data={
        name:name.value,
        email:email.value,
        password:password.value
    }

    axios.post('http://localhost:5178/api/auth/register',{
        name:name.value,
        email:email.value,
        password:password.value
    })
    console.log('✅ Успех:', response.data)

    name.value=''
    email.value=''
    password.value=''

    }catch(error){
        console.error('ошибка: ',error.response?.data?.error||'чтото пошло не так')
        console.error('❌ Ошибка:', error)
        alert('Ошибка регистрации')
    }
}
</script>

<style scoped>

</style>