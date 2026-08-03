<template>
    <div>
        <button @click="logout">Выйти</button>
        <button @click="router.push('/cart')">In Cart</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router=useRouter()

const logout=async()=>{
    localStorage.removeItem('token')
    router.push('/login')
}
</script>