<template>
    <div>
        <button @click="logout">Выйти</button>
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