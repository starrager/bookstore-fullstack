<template>
    <div class="orders-container">
        <div class="orders-header">
            <h1>My orders</h1>
            <span v-if="orders.length" class="count">{{  orders.length }} orders</span>
        </div>

        <div v-if="loading">Loading...</div>

        <div v-if="orders.length===0" class="empry">
            <h2>You dont have any orders yet</h2>
            <p>Go to the catalog and place your first order</p>
            <router-link to="/" class="btn-continue">Start shopping</router-link>
        </div>

        <div v-else>
            <div v-for="order in orders":key="orders.id" class="order-card" @click="viewOrder(order.id)">
                <div class="orders-header">
                    <span class="order-id">Order #{{ order.id }}</span>
                    <span class="order-date">Date: {{ formatDate(order.createdAt) }}</span>
                    <span class="order-status">{{ getStatusText(order.status) }}</span>
                </div>

                <div class="order-body">
                    <div class="order-items">
                        <div v-for="item in order.items":key="item.id" class="order-item">
                            <span>{{ item.book.title }}</span>
                            <span>{{ item.quantity }} x {{ item.price }}</span>
                        </div>
                    </div>
                </div>

                <div class="order-total">
                    <strong>Total: {{ order.total }}₽</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import api from '../api/api'

const router=useRouter()
const orders=ref([])
const loading=ref(false)

const formatDate=(dateString)=>{
    const date=new Date(dateString)
    return date.toLocaleDateString('ru-RU',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit'
    })
}

const getStatusText=(status)=>{
    const map={
        'pending':'Waiting',
        'paid':'Paid',
        'shipped':'Shipped',
        'delivered':'Delivered',
        'canceled':'Canceled'
    }
    return map[status]||status
}

const fetchOrders=async()=>{
    loading.value=true
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('not authorized')
            router.push('/login')
            return
        }
        const response=await api.get('/api/orders')
        orders.value=response.data
    }catch(error){console.error(error)}
    finally{loading.value=false}
}

const viewOrder=async(id)=>{
    router.push(`/orders/${id}`)
}

onMounted(()=>{fetchOrders()})
</script>

<style scoped>
.orders-container{
    max-width:900px;
    margin:40px auto;
    padding:0 20px;
}
.orders-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:30px;
}
.orders-header h1{
    font-size:28px;
    margin:0;
}
.count{
    background:#f0f0f0;
    padding:6px 16px;
    border-radius:20px;
    font-size:14px;
    color:#666;
}
.loading{
    text-align:center;
    padding:60px 0;
    color:#999;
}
.empty{
    text-align:center;
    padding:60px 0;
}
.empty-icon{
    font-size:64px;
    margin-bottom:16px;
}
.empty h2{
    font-size:24px;
    color:#333;
    margin-bottom:8px;
}
.empty p{
    color:#999;
    margin-bottom:24px;
}
.btn-continue{
    display:inline-block;
    padding:10px 32px;
    background:#4CAF50;
    color:white;
    border-radius:6px;
    text-decoration:none;
    transition:0.3s;
}
.btn-continue:hover{
    background:#45a049;
    transform:scale(1.02);
}
.order-card{
    background:#fff;
    border:1px solid #e8e8e8;
    border-radius:12px;
    padding:20px;
    margin-bottom:16px;
    cursor:pointer;
    transition:0.3s;
}
.order-card:hover{
    box-shadow:0 4px 12px rgba(0,0,0,0.08);
    transform:translateY(-2px);
}
.order-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-bottom:12px;
    border-bottom:1px solid #eee;
}
.order-id{
    font-weight:600;
    font-size:16px;
}
.order-date{
    color:#888;
    font-size:14px;
}
.order-status{
    padding:4px 12px;
    border-radius:20px;
    font-size:13px;
    font-weight:500;
}
.order-status.pending{
    background:#fff3cd;
    color:#856404;
}
.order-status.paid{
    background:#d4edda;
    color:#155724;
}
.order-status.shipped{
    background:#cce5ff;
    color:#004085;
}
.order-status.delivered{
    background:#d1ecf1;
    color:#0c5460;
}
.order-status.cancelled{
    background:#f8d7da;
    color:#721c24;
}
.order-body{
    padding-top:12px;
}
.order-items{
    display:flex;
    flex-direction:column;
    gap:6px;
}
.order-item{
    display:flex;
    justify-content:space-between;
    font-size:14px;
    color:#444;
}
.order-total{
    text-align:right;
    margin-top:12px;
    padding-top:12px;
    border-top:1px solid #eee;
    font-size:18px;
}
</style>