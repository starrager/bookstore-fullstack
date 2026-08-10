<template>
    <div class="checkout-page">
        <div v-if="cartStore.loading" class="checkout-loading">
            <span class="checkout-spinner"></span>
            Loading...
        </div>

        <div v-else-if="cartStore.items.length===0" class="empty">
            <p>Cart is empty</p>
            <router-link to="/" class="btn-continue">Continue shopping</router-link>
        </div>

        <div v-else class="checkout-content">
            <div class="checkout-header">
                <h1>Making an order</h1>
                <p>Check your products and enter delivery details</p>
            </div>

            <div class="checkout-grid">
                <div class="checkout-items">
                    <h2>Products</h2>

                    <div v-for="item in cartStore.items" :key="item.id" class="checkout-item">
                        <img
                            v-if="item.book.coverId"
                            :src="`/covers/${item.book.coverId}.jpg`"
                            alt="cover"
                            class="cover"
                            @error="(e)=>e.target.style.display='none'"
                        >

                        <div class="item-info">
                            <h4>{{ item.book.title }}</h4>
                            <p>{{ item.book.author }}</p>
                            <p>{{ item.book.price }} ₽ x {{ item.quantity }}</p>
                        </div>

                        <div class="item-total">
                            <strong>{{ item.book.price*item.quantity }} ₽</strong>
                        </div>
                    </div>

                    <div class="checkout-total">
                        <span>Total:</span>
                        <strong>{{ totalPrice() }} ₽</strong>
                    </div>
                </div>

                <div class="checkout-form">
                    <h2>Delivery address</h2>

                    <form @submit.prevent="placeOrder">
                        <div class="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                v-model="address"
                                placeholder="st. Pushkina, house 10, apartment 5"
                                required
                            >
                        </div>

                        <div class="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                v-model="phone"
                                placeholder="+7 999 123-45-67"
                                required
                            >
                        </div>

                        <button type="submit" class="btn-order">
                            Place an order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import { useCartStore } from '@/stores/cart';
import api from '../api/api';
import { useToast } from '@erag/vue-toastification';

const toast=useToast()
const router=useRouter()
const cartStore=useCartStore()
const address=ref('')
const phone=ref('')

const totalPrice=()=>{
    return cartStore.items.reduce((sum,item)=>{
        return sum+(item.book.price*item.quantity)
    },0)
}

const placeOrder=async()=>{
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('No authorization')
            router.push('login')
            return
        }
        await api.post('/api/orders',{
            address:address.value,
            phone:phone.value
        })
        toast.success('The order has been placed')
        router.push('/orders')
    }catch(error){
        console.error(error)
        toast.error('Order processing error')
    }
}

onMounted(()=>{
    cartStore.getCart()
})
</script>

<style scoped>
.checkout-page{
    min-height:calc(100vh - 80px);
    padding:45px 20px 60px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.checkout-content{
    max-width:1050px;
    margin:0 auto;
}
.checkout-header{
    margin:0 auto 30px;
    text-align:center;
    animation:headerAppear .4s ease;
}
.checkout-header h1{
    margin:0 0 8px;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.checkout-header p{
    margin:0;
    color:#68706a;
    font-size:14px;
    line-height:1.5;
}
.checkout-grid{
    display:grid;
    grid-template-columns:minmax(0,1.45fr) minmax(320px,.8fr);
    gap:24px;
    align-items:start;
    animation:checkoutAppear .45s ease;
}
.checkout-items,
.checkout-form{
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:16px;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
}
.checkout-items{
    padding:28px;
}
.checkout-form{
    padding:28px;
    position:sticky;
    top:25px;
}
.checkout-items h2,
.checkout-form h2{
    margin:0 0 22px;
    color:#202522;
    font-size:21px;
    font-weight:700;
    letter-spacing:-.3px;
}
.checkout-item{
    display:grid;
    grid-template-columns:64px minmax(0,1fr) auto;
    gap:15px;
    align-items:center;
    padding:16px 0;
    border-bottom:1px solid #e7e9e7;
    animation:itemAppear .4s ease both;
}
.checkout-item:nth-child(2){
    animation-delay:.05s;
}
.checkout-item:nth-child(3){
    animation-delay:.1s;
}
.checkout-item:nth-child(4){
    animation-delay:.15s;
}
.checkout-item:first-of-type{
    padding-top:0;
}
.checkout-item:last-of-type{
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
    transition:transform .25s ease,box-shadow .25s ease;
}
.checkout-item:hover .cover{
    transform:translateY(-3px);
    box-shadow:0 6px 14px rgba(0,0,0,.1);
}
.item-info{
    min-width:0;
}
.item-info h4{
    margin:0 0 5px;
    overflow:hidden;
    color:#202522;
    font-size:14px;
    font-weight:650;
    line-height:1.4;
    white-space:nowrap;
    text-overflow:ellipsis;
    transition:color .2s ease;
}
.checkout-item:hover .item-info h4{
    color:#277532;
}
.item-info p{
    margin:3px 0;
    color:#68706a;
    font-size:12px;
    line-height:1.45;
}
.item-info p:last-child{
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
.checkout-total{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top:7px;
    padding-top:20px;
    border-top:1px solid #dfe3df;
    color:#68706a;
    font-size:14px;
}
.checkout-total strong{
    color:#277532;
    font-size:21px;
    font-weight:700;
    transition:color .2s ease;
}
.checkout-form form{
    display:flex;
    flex-direction:column;
    gap:17px;
}
.form-group{
    display:flex;
    flex-direction:column;
    gap:8px;
}
.form-group label{
    color:#303631;
    font-size:14px;
    font-weight:600;
}
.form-group input{
    width:100%;
    min-height:45px;
    padding:0 13px;
    box-sizing:border-box;
    border:1px solid #cfd5d0;
    border-radius:9px;
    outline:none;
    background:#fff;
    color:#202522;
    font-family:inherit;
    font-size:14px;
    transition:border-color .2s,box-shadow .2s,transform .2s;
}
.form-group input::placeholder{
    color:#9aa19c;
}
.form-group input:hover{
    border-color:#aab2ac;
}
.form-group input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
    transform:translateY(-1px);
}
.btn-order{
    width:100%;
    min-height:47px;
    margin-top:3px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.btn-order:hover{
    background:#277532;
    transform:translateY(-2px);
    box-shadow:0 7px 18px rgba(49,138,62,.22);
}
.btn-order:active{
    transform:translateY(0);
    box-shadow:none;
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
    animation:checkoutAppear .4s ease;
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
    box-sizing:border-box;
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
.checkout-loading{
    min-height:300px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:9px;
    color:#68706a;
    font-size:14px;
}
.checkout-spinner{
    width:15px;
    height:15px;
    border:2px solid #dfe5df;
    border-top-color:#318a3e;
    border-radius:50%;
    animation:spin .7s linear infinite;
}
@keyframes headerAppear{
    from{
        opacity:0;
        transform:translateY(-8px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes checkoutAppear{
    from{
        opacity:0;
        transform:translateY(12px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes itemAppear{
    from{
        opacity:0;
        transform:translateY(8px);
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
@media(max-width:800px){
    .checkout-page{
        padding:30px 15px 45px;
    }
    .checkout-grid{
        grid-template-columns:1fr;
        gap:18px;
    }
    .checkout-form{
        position:static;
    }
}
@media(max-width:500px){
    .checkout-page{
        padding:25px 12px 40px;
    }
    .checkout-header{
        margin-bottom:23px;
    }
    .checkout-header h1{
        font-size:24px;
    }
    .checkout-header p{
        font-size:13px;
    }
    .checkout-items,
    .checkout-form{
        padding:21px 18px;
        border-radius:13px;
    }
    .checkout-items h2,
    .checkout-form h2{
        margin-bottom:18px;
        font-size:19px;
    }
    .checkout-item{
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
        margin-top:-7px;
    }
    .checkout-total strong{
        font-size:19px;
    }
}
@media(prefers-reduced-motion:reduce){
    .checkout-header,
    .checkout-grid,
    .checkout-item,
    .empty{
        animation:none;
    }
    .cover,
    .btn-order,
    .btn-continue,
    .form-group input{
        transition:none;
    }
}
</style>