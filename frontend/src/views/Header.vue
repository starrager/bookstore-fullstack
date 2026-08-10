<template>
    <div class="header">
        <button @click="router.push('/')">Menu</button>
        <button @click="router.push('/cart')">In Cart</button>
        <button @click="router.push('/favorites')">In Favorites</button>
        <button @click="router.push('/orders')">In Orders</button>
        <button @click="logout">Exit</button>
        <button v-if="isAdmin" @click="router.push('/admin/books')">Admin panel</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToast } from '@erag/vue-toastification';
import {ref,onMounted} from 'vue'

const toast=useToast()
const router=useRouter()
const isAdmin=ref(false)
const isAuthenticated=ref(false)

const checkAuth=()=>{
    const token=localStorage.getItem('token')
    const userData=localStorage.getItem('user')
    isAuthenticated.value=!!token
    if(token&&userData){
        const user=JSON.parse(userData)
        isAdmin.value=user.role==='admin'
    }
}

const logout=async()=>{
    if(confirm('Do you really want to log out of your account?')){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        isAuthenticated.value=false
        isAdmin.value=false
        router.push('/login')
    }else toast.error('Error, please repeat later')}

onMounted(checkAuth)
</script>

<style scoped>
.header{
    display:flex;
    justify-content:center;
    gap:24px;
    padding:14px 24px;
    background:#2e7d32;
    flex-wrap:wrap;
    border-radius:10px;
    margin:16px auto;
    max-width:700px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
}
.header button{
    background:transparent;
    color:white;
    border:2px solid rgba(255,255,255,0.25);
    padding:8px 20px;
    border-radius:8px;
    cursor:pointer;
    font-size:15px;
    font-weight:500;
    transition:0.3s;
    white-space:nowrap;
}
.header button:hover{
    background:rgba(255,255,255,0.15);
    border-color:white;
    transform:scale(1.05);
}
.header button:active{
    transform:scale(0.95);
}
</style>