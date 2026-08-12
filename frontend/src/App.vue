<template>
    <div class="app-container">
        <Header/>
        <router-view/>
    </div>
</template>

<script setup>
import Header from './views/Header.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.ts'

const authStore=useAuthStore()

onMounted(()=>{
    authStore.checkAuth()
})
</script>

<style>
html,body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    overflow:hidden;
}
</style>