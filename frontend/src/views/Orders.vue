<template>
    <div class="orders-page">
        <div class="orders-container">
            <div class="orders-header">
                <div>
                    <h1>My orders</h1>
                    <p>View your order history and status</p>
                </div>

                <span v-if="orders.length" class="count">
                    {{ orders.length }} orders
                </span>
            </div>

            <div v-if="loading" class="loading">
                <span class="spinner"></span>
                Loading...
            </div>

            <div v-else-if="orders.length===0" class="empty">
                <h2>You don't have any orders yet</h2>
                <p>Go to the catalog and place your first order</p>
                <router-link to="/" class="btn-continue">Start shopping</router-link>
            </div>

            <div v-else class="orders-list">
                <div
                    v-for="order in orders"
                    :key="order.id"
                    class="order-card"
                    @click="viewOrder(order.id)"
                >
                    <div class="order-header">
                        <div class="order-main">
                            <span class="order-id">Order #{{ order.id }}</span>
                            <span class="order-date">
                                {{ formatDate(order.createdAt) }}
                            </span>
                        </div>

                        <span class="order-status" :class="order.status">
                            {{ getStatusText(order.status) }}
                        </span>
                    </div>

                    <div class="order-body">
                        <div class="order-items">
                            <div
                                v-for="item in order.items"
                                :key="item.id"
                                class="order-item"
                            >
                                <span>{{ item.book.title }}</span>
                                <span>{{ item.quantity }} x {{ item.price }} ₽</span>
                            </div>
                        </div>
                    </div>

                    <div class="order-total">
                        <span>Total</span>
                        <strong>{{ order.total }} ₽</strong>
                    </div>
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
        const response=await api.get('/orders')
        orders.value=response.data
    }catch(error){console.error(error)}
    finally{loading.value=false}
}

const viewOrder=async(id)=>{
    router.push(`/orders/${id}`)
}

onMounted(fetchOrders)
</script>

<style scoped>
.orders-page{
    min-height:calc(100vh - 80px);
    padding:45px 20px 60px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.orders-container{
    max-width:900px;
    margin:0 auto;
}
.orders-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
    animation:pageAppear .35s ease;
}
.orders-header h1{
    margin:0 0 6px;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.orders-header p{
    margin:0;
    color:#68706a;
    font-size:14px;
}
.count{
    padding:6px 13px;
    border:1px solid #dfe3df;
    border-radius:20px;
    background:#fff;
    color:#68706a;
    font-size:13px;
}
.orders-list{
    display:flex;
    flex-direction:column;
    gap:14px;
}
.order-card{
    padding:20px;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:13px;
    box-shadow:0 8px 25px rgba(0,0,0,.055);
    cursor:pointer;
    animation:cardAppear .4s ease both;
    transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
}
.order-card:nth-child(2){
    animation-delay:.05s;
}
.order-card:nth-child(3){
    animation-delay:.1s;
}
.order-card:hover{
    transform:translateY(-3px);
    border-color:#d6ddd7;
    box-shadow:0 12px 28px rgba(0,0,0,.09);
}
.order-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:15px;
    margin:0;
    padding-bottom:14px;
    border-bottom:1px solid #e7e9e7;
}
.order-main{
    display:flex;
    flex-direction:column;
    gap:4px;
}
.order-id{
    color:#202522;
    font-size:15px;
    font-weight:650;
}
.order-date{
    color:#88908a;
    font-size:12px;
}
.order-status{
    padding:5px 11px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;
}
.order-status.pending{
    background:#fff6dc;
    color:#a87800;
}
.order-status.paid{
    background:#edf7ef;
    color:#31813d;
}
.order-status.shipped{
    background:#eef4fb;
    color:#47729e;
}
.order-status.delivered{
    background:#edf7ef;
    color:#31813d;
}
.order-status.canceled{
    background:#fff0f0;
    color:#c13e3e;
}
.order-body{
    padding:15px 0;
}
.order-items{
    display:flex;
    flex-direction:column;
    gap:9px;
}
.order-item{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    color:#4e5650;
    font-size:13px;
}
.order-item span:first-child{
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.order-item span:last-child{
    color:#68706a;
    white-space:nowrap;
}
.order-total{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-top:14px;
    border-top:1px solid #e7e9e7;
    color:#68706a;
    font-size:13px;
}
.order-total strong{
    color:#277532;
    font-size:17px;
    font-weight:700;
}
.loading{
    min-height:300px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:9px;
    color:#68706a;
    font-size:14px;
}
.spinner{
    width:15px;
    height:15px;
    border:2px solid #dfe5df;
    border-top-color:#318a3e;
    border-radius:50%;
    animation:spin .7s linear infinite;
}
.empty{
    max-width:500px;
    margin:60px auto;
    padding:42px 35px;
    box-sizing:border-box;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:16px;
    text-align:center;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
    animation:pageAppear .35s ease;
}
.empty h2{
    margin:0 0 8px;
    color:#202522;
    font-size:22px;
}
.empty p{
    margin:0 0 22px;
    color:#68706a;
    font-size:14px;
}
.btn-continue{
    display:inline-flex;
    justify-content:center;
    align-items:center;
    min-height:44px;
    padding:0 22px;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-size:14px;
    font-weight:600;
    text-decoration:none;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.btn-continue:hover{
    background:#277532;
    transform:translateY(-1px);
    box-shadow:0 6px 16px rgba(49,138,62,.2);
}
@keyframes pageAppear{
    from{
        opacity:0;
        transform:translateY(10px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes cardAppear{
    from{
        opacity:0;
        transform:translateY(12px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes spin{
    to{
        transform:rotate(360deg);
    }
}
@media(max-width:600px){
    .orders-page{
        padding:30px 15px 45px;
    }
    .orders-header{
        align-items:flex-start;
    }
    .orders-header h1{
        font-size:24px;
    }
    .orders-header p{
        font-size:13px;
    }
    .order-card{
        padding:17px;
    }
    .order-header{
        align-items:flex-start;
    }
    .order-item{
        align-items:flex-start;
        flex-direction:column;
        gap:2px;
    }
}
@media(max-width:450px){
    .orders-page{
        padding:25px 12px 40px;
    }
    .count{
        padding:5px 9px;
        font-size:11px;
    }
}
@media(prefers-reduced-motion:reduce){
    .orders-header,
    .order-card,
    .empty{
        animation:none;
    }
    .order-card,
    .btn-continue{
        transition:none;
    }
}
</style>