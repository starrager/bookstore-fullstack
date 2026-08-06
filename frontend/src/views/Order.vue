<template>
    <div class="order-detail-container">
        <button class="back-btn" @click="router.back()"><-Back</button>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="!order" class="empty">The order was not found</div>
        <div v-else>
            <div class="order-detail-header">
                <h1>Order #{{ order.id }}</h1>
                <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
            </div>

            <div    class="order-info">
                <p><strong>Date:</strong>{{ formatdate(order.createdAt) }}</p>
                <p><strong>Address:</strong>{{ order.address }}</p>
                <p><strong>Phone:</strong>{{ order.phone }}</p>
            </div>

            <div class="order-items">
                <h2>Products</h2>
                <div v-for="item in order.items":key="item.id" class="order-item-detail">
                    <img v-if="item.book.coverId" :src="`/covers/${item.book.coverId}.jpg`" alt="cover" class="cover">
                    <div class="info-item">
                        <h3>{{ item.book.title }}</h3>
                        <p>{{ item.book.author }}</p>
                        <p>{{ item.book.quantity }} x {{ item.price }}</p>
                    </div>
                    <div class="item-total">
                        <strong>{{ item.quantity*item.price }}</strong>
                    </div>
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <strong>{{ order.total }} ₽</strong>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { useRouter,useRoute } from 'vue-router';
import api from '@/api/api';

const router=useRouter()
const route=useRoute()
const order=ref(null)
const loading=ref(false)

const formatdate=(dateString)=>{
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
        'pending':'pending',
        'paid':'paid',
        'shipped':'shipped',
        'delivered':'delivered',
        'cancelled':'cancelled'
    }
    return map[status]||status
}

const fetchOrder=async()=>{
    loading.value=true
    try{
        const id=route.params.id
        const response=await api.get(`/api/orders/${id}`)
        order.value=response.data
    }catch(error){
        console.error(error)
        order.value=null
    }finally{loading.value=false}
}

onMounted(fetchOrder)
</script>

<style scoped>
.order-detail-container{
    max-width:900px;
    margin:40px auto;
    padding:0 20px;
}
.back-btn{
    background:none;
    border:none;
    font-size:16px;
    color:#666;
    cursor:pointer;
    margin-bottom:20px;
}
.back-btn:hover{
    color:#333;
}
.order-detail-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}
.order-detail-header h1{
    margin:0;
}
.order-status{
    padding:6px 16px;
    border-radius:20px;
    font-size:14px;
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
.order-info{
    background:#f9f9f9;
    padding:16px 20px;
    border-radius:8px;
    margin-bottom:20px;
}
.order-info p{
    margin:4px 0;
}
.order-items{
    background:#fff;
    border:1px solid #e8e8e8;
    border-radius:12px;
    padding:20px;
}
.order-item-detail{
    display:flex;
    align-items:center;
    gap:16px;
    padding:12px 0;
    border-bottom:1px solid #eee;
}
.order-item-detail:last-child{
    border-bottom:none;
}
.order-item-detail .cover{
    width:50px;
    height:70px;
    object-fit:cover;
    border-radius:4px;
}
.order-item-detail .item-info{
    flex:1;
}
.order-item-detail .item-info h3{
    margin:0;
    font-size:16px;
}
.order-item-detail .item-info p{
    margin:2px 0;
    color:#888;
    font-size:14px;
}
.item-total{
    font-size:16px;
    font-weight:600;
    color:#2e7d32;
}
.order-total{
    display:flex;
    justify-content:space-between;
    padding-top:16px;
    margin-top:16px;
    border-top:2px solid #333;
    font-size:20px;
}
.order-total strong{
    color:#2e7d32;
}
.loading{
    text-align:center;
    padding:60px 0;
    color:#999;
}
.empty{
    text-align:center;
    padding:60px 0;
    color:#999;
}
</style>