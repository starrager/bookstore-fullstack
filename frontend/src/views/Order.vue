<template>
    <div class="order-detail-page">
        <div v-if="loading" class="loading">
            <span class="spinner"></span>
            Loading...
        </div>

        <div v-else-if="!order" class="empty">
            <h2>The order was not found</h2>
            <router-link to="/orders" class="btn-continue">Back to orders</router-link>
        </div>

        <div v-else class="order-detail">
            <div class="order-detail-header">
                <div>
                    <h1>Order #{{ order.id }}</h1>
                    <p>{{ formatDate(order.createdAt) }}</p>
                </div>

                <span class="order-status" :class="order.status">
                    {{ getStatusText(order.status) }}
                </span>
            </div>

            <div class="order-info">
                <div>
                    <span>Delivery address</span>
                    <strong>{{ order.address }}</strong>
                </div>

                <div>
                    <span>Phone</span>
                    <strong>{{ order.phone }}</strong>
                </div>
            </div>

            <div class="order-items">
                <h2>Products</h2>

                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="order-item-detail"
                >
                    <img
                        v-if="item.book.coverId"
                        :src="`/covers/${item.book.coverId}.jpg`"
                        alt="cover"
                        class="cover"
                        @error="(e)=>e.target.style.display='none'"
                    >

                    <div class="info-item">
                        <h3>{{ item.book.title }}</h3>
                        <p>{{ item.book.author }}</p>
                        <p>{{ item.quantity }} x {{ item.price }} ₽</p>
                    </div>

                    <div class="item-total">
                        <strong>{{ item.quantity*item.price }} ₽</strong>
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
.order-detail-page{
    min-height:calc(100vh - 80px);
    padding:45px 20px 60px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.order-detail{
    max-width:900px;
    margin:0 auto;
    animation:pageAppear .4s ease;
}
.order-detail-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    margin-bottom:24px;
}
.order-detail-header h1{
    margin:0 0 6px;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.order-detail-header p{
    margin:0;
    color:#68706a;
    font-size:13px;
}
.order-status{
    padding:6px 13px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;
    white-space:nowrap;
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
.order-info{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:15px;
    margin-bottom:20px;
}
.order-info div{
    display:flex;
    flex-direction:column;
    gap:6px;
    padding:17px 18px;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:12px;
    box-shadow:0 6px 20px rgba(0,0,0,.045);
}
.order-info span{
    color:#68706a;
    font-size:12px;
}
.order-info strong{
    color:#202522;
    font-size:14px;
    font-weight:600;
}
.order-items{
    padding:28px;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:16px;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
}
.order-items h2{
    margin:0 0 22px;
    color:#202522;
    font-size:21px;
    font-weight:700;
    letter-spacing:-.3px;
}
.order-item-detail{
    display:grid;
    grid-template-columns:64px minmax(0,1fr) auto;
    gap:15px;
    align-items:center;
    padding:16px 0;
    border-bottom:1px solid #e7e9e7;
    animation:itemAppear .35s ease both;
}
.order-item-detail:first-of-type{
    padding-top:0;
}
.order-item-detail:last-of-type{
    border-bottom:0;
}
.cover{
    width:64px;
    height:88px;
    display:block;
    object-fit:cover;
    border-radius:7px;
    background:#f0f2f0;
    border:1px solid #e1e4e1;
    box-shadow:0 3px 8px rgba(0,0,0,.06);
    transition:transform .2s ease,box-shadow .2s ease;
}
.order-item-detail:hover .cover{
    transform:translateY(-2px);
    box-shadow:0 6px 13px rgba(0,0,0,.1);
}
.info-item{
    min-width:0;
}
.info-item h3{
    margin:0 0 5px;
    overflow:hidden;
    color:#202522;
    font-size:14px;
    font-weight:650;
    white-space:nowrap;
    text-overflow:ellipsis;
    transition:color .2s ease;
}
.order-item-detail:hover .info-item h3{
    color:#277532;
}
.info-item p{
    margin:3px 0;
    color:#68706a;
    font-size:12px;
}
.info-item p:last-child{
    margin-top:7px;
    color:#4e5650;
}
.item-total{
    padding-left:12px;
    white-space:nowrap;
}
.item-total strong{
    color:#202522;
    font-size:14px;
    font-weight:700;
}
.order-total{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top:7px;
    padding-top:20px;
    border-top:1px solid #dfe3df;
    color:#202522;
    font-size:15px;
}
.order-total strong{
    color:#202522;
    font-size:21px;
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
    margin:70px auto;
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
    margin:0 0 20px;
    color:#202522;
    font-size:22px;
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
@keyframes itemAppear{
    from{
        opacity:0;
        transform:translateY(7px);
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
@media(max-width:650px){
    .order-detail-page{
        padding:30px 15px 45px;
    }
    .order-detail-header{
        align-items:flex-start;
    }
    .order-detail-header h1{
        font-size:24px;
    }
    .order-info{
        grid-template-columns:1fr;
    }
    .order-items{
        padding:21px 18px;
        border-radius:13px;
    }
}
@media(max-width:500px){
    .order-detail-page{
        padding:25px 12px 40px;
    }
    .order-item-detail{
        grid-template-columns:54px minmax(0,1fr);
        gap:12px;
    }
    .cover{
        width:54px;
        height:75px;
    }
    .item-total{
        grid-column:2;
        padding-left:0;
        margin-top:-6px;
    }
    .order-total strong{
        font-size:19px;
    }
}
@media(prefers-reduced-motion:reduce){
    .order-detail,
    .order-item-detail,
    .empty{
        animation:none;
    }
    .cover,
    .btn-continue{
        transition:none;
    }
}
</style>