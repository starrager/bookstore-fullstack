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
                    <button type="button" class="pay-btn" @click="openPayment">Pay
                        <span>→</span>
                    </button>
                </div>
                <div
    v-if="paymentModal"
    class="modal-overlay"
    @click.self="closePayment"
>
    <div class="payment-modal">
        <button
            type="button"
            class="modal-close"
            @click="closePayment"
            aria-label="Close"
        >
            ×
        </button>

        <div class="payment-header">
            <div class="payment-icon">
                ₽
            </div>

            <h2>Payment</h2>
            <p>Complete your payment for order #{{ order.id }}</p>
        </div>

        <div class="payment-amount">
            <span>Total</span>
            <strong>{{ order.total }} ₽</strong>
        </div>

        <form @submit.prevent="processPayment">

            <div class="form-group">
                <label>Card number</label>

                <input
                    v-model="cardNumber"
                    type="text"
                    inputmode="numeric"
                    maxlength="19"
                    placeholder="0000 0000 0000 0000"
                    autocomplete="cc-number"
                    @input="formatCardNumber"
                >
            </div>

            <div class="form-row">

                <div class="form-group">
                    <label>Expiry date</label>

                    <input
                        v-model="expiry"
                        type="text"
                        inputmode="numeric"
                        maxlength="5"
                        placeholder="MM/YY"
                        autocomplete="cc-exp"
                        @input="formatExpiry"
                    >
                </div>

                <div class="form-group">
                    <label>CVC</label>

                    <input
                        v-model="cvc"
                        type="password"
                        inputmode="numeric"
                        maxlength="3"
                        placeholder="•••"
                        autocomplete="cc-csc"
                    >
                </div>

            </div>

            <div class="secure-payment">
                <span>🔒</span>
                <span>Secure payment</span>
            </div>

            <button
                type="submit"
                class="confirm-payment"
                :disabled="processing"
            >
                <span v-if="!processing">
                    Pay {{ order.total }} ₽
                </span>

                <span v-else class="payment-loading">
                    <span class="small-spinner"></span>
                    Processing...
                </span>
            </button>

        </form>
    </div>
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

const paymentModal = ref(false)
const processing = ref(false)

const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')

const openPayment=()=>{
    paymentModal.value=true
    document.body.style.overflow='hidden'
}

const closePayment=()=>{
    if(processing.value)return

    paymentModal.value=false
    document.body.style.overflow=''
}

const formatCardNumber=()=>{
    let value=cardNumber.value
        .replace(/\D/g,'')
        .slice(0, 16)

    cardNumber.value=value.replace(
        /(.{4})/g,
        '$1 '
    ).trim()
}

const formatExpiry=()=>{
    let value=expiry.value
        .replace(/\D/g,'')
        .slice(0, 4)
    if(value.length >= 3){
        value=`${value.slice(0, 2)}/${value.slice(2)}`
    }
    expiry.value=value
}

const processPayment=async()=>{
    if(
        cardNumber.value.replace(/\s/g, '').length!==16||
        expiry.value.length!==5||
        cvc.value.length!==3
    ){
        return
    }

    processing.value=true
    await new Promise(resolve=>setTimeout(resolve, 1500))
    order.value.status='paid'
    processing.value=false
    paymentModal.value=false
    document.body.style.overflow=''
    cardNumber.value=''
    expiry.value=''
    cvc.value=''
}

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
.pay-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:9px;
    min-width:110px;
    height:42px;
    margin-left:auto;
    padding:0 17px;
    border:1px solid #318a3e;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    line-height:1;
    cursor:pointer;
    box-shadow:0 4px 10px rgba(49,138,62,.14);
    transition:
        background .2s ease,
        border-color .2s ease,
        transform .2s ease,
        box-shadow .2s ease;
}

.pay-btn span{
    font-size:17px;
    line-height:1;
    transition:transform .2s ease;
}

.pay-btn:hover{
    background:#277532;
    border-color:#277532;
    transform:translateY(-1px);
    box-shadow:0 7px 16px rgba(49,138,62,.2);
}

.pay-btn:hover span{
    transform:translateX(3px);
}

.pay-btn:active{
    transform:translateY(0);
    box-shadow:0 3px 7px rgba(49,138,62,.15);
}

.pay-btn:focus-visible{
    outline:3px solid rgba(49,138,62,.2);
    outline-offset:3px;
}
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
    justify-content:flex-end;
    align-items:center;
    gap:20px;
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
.modal-overlay{
    position:fixed;
    inset:0;
    z-index:1000;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
    background:rgba(25,30,27,.48);
    backdrop-filter:blur(5px);
    animation:modalOverlayAppear .2s ease;
}
.payment-modal{
    position:relative;
    width:100%;
    max-width:430px;
    padding:30px;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:18px;
    box-shadow:0 25px 70px rgba(0,0,0,.18);
    animation:modalAppear .25s ease;
}
.modal-close{
    position:absolute;
    top:16px;
    right:17px;
    display:flex;
    align-items:center;
    justify-content:center;
    width:32px;
    height:32px;
    padding:0;
    border:0;
    border-radius:8px;
    background:transparent;
    color:#68706a;
    font-family:inherit;
    font-size:25px;
    font-weight:300;
    line-height:1;
    cursor:pointer;
    transition:
        background .2s ease,
        color .2s ease;
}
.modal-close:hover{
    background:#f1f3f1;
    color:#202522;
}
.payment-header{
    text-align:center;
    margin-bottom:24px;
}
.payment-icon{
    display:flex;
    align-items:center;
    justify-content:center;
    width:48px;
    height:48px;
    margin:0 auto 13px;
    border-radius:12px;
    background:#edf7ef;
    color:#318a3e;
    font-size:19px;
    font-weight:700;
}
.payment-header h2{
    margin:0 0 5px;
    color:#202522;
    font-size:22px;
    font-weight:700;
    letter-spacing:-.3px;
}
.payment-header p{
    margin:0;
    color:#68706a;
    font-size:12px;
}
.payment-amount{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:22px;
    padding:15px 16px;
    border:1px solid #e1e4e1;
    border-radius:11px;
    background:#f7f8f7;
}
.payment-amount span{
    color:#68706a;
    font-size:13px;
}
.payment-amount strong{
    color:#202522;
    font-size:18px;
    font-weight:700;
}
.form-group{
    margin-bottom:16px;
}
.form-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
}
.form-group label{
    display:block;
    margin-bottom:7px;
    color:#4e5650;
    font-size:12px;
    font-weight:600;
}
.form-group input{
    width:100%;
    height:43px;
    box-sizing:border-box;
    padding:0 12px;
    border:1px solid #dfe3df;
    border-radius:9px;
    outline:none;
    background:#fff;
    color:#202522;
    font-family:inherit;
    font-size:13px;
    transition:
        border-color .2s ease,
        box-shadow .2s ease;
}
.form-group input::placeholder{
    color:#a1a7a2;
}
.form-group input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.secure-payment{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;
    margin:3px 0 18px;
    color:#7a817c;
    font-size:11px;
}
.confirm-payment{
    width:100%;
    height:45px;
    border:1px solid #318a3e;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
    box-shadow:0 4px 10px rgba(49,138,62,.14);
    transition:
        background .2s ease,
        transform .2s ease,
        box-shadow .2s ease;
}
.confirm-payment:hover:not(:disabled){
    background:#277532;
    transform:translateY(-1px);
    box-shadow:0 7px 16px rgba(49,138,62,.2);
}

.confirm-payment:active:not(:disabled){
    transform:translateY(0);
}
.confirm-payment:disabled{
    opacity:.7;
    cursor:not-allowed;
}
.payment-loading{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
}
.small-spinner{
    width:13px;
    height:13px;
    border:2px solid rgba(255,255,255,.35);
    border-top-color:#fff;
    border-radius:50%;
    animation:spin .7s linear infinite;
}
@keyframes modalOverlayAppear{
    from{
        opacity:0;
    }

    to{
        opacity:1;
    }
}
@keyframes modalAppear{
    from{
        opacity:0;
        transform:translateY(12px) scale(.98);
    }

    to{
        opacity:1;
        transform:translateY(0) scale(1);
    }
}
</style>