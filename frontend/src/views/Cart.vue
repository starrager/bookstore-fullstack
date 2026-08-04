<template>
    <div class="cart-container">
        <div class="cart-header">
            <h1>Cart</h1>
            <span class="cart-count" v-if="cartStore.items.length">
                {{ cartStore.items.reduce((sum, item) => sum + item.quantity, 0) }} products
            </span>
        </div>

        <div v-if="cartStore.loading">Loading...</div>
        <div v-else-if="cartStore.items.length === 0" class="empty">
            <div class="empty-icon">🛒</div>
            <h2>Cart is empty</h2>
            <p>Add books to start shopping</p>
            <router-link to="/" class="btn-continue">Continue shopping</router-link>
        </div>
        <div v-else>
            <div class="cart-items">
                <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <img 
                        v-if="item.book.coverId" 
                        :src="`/covers/${item.book.coverId}.jpg`" 
                        alt="cover" 
                        class="cover"
                        @error="(e) => e.target.style.display = 'none'"
                    >
                    <div class="item-info">
                        <h3>{{ item.book.title }}</h3>
                        <p class="author-text">{{ item.book.author }}</p>
                        <div class="price-row">
                            <span>{{ item.book.price }} ₽ × {{ item.quantity }}</span>
                            <strong>{{ item.book.price * item.quantity }} ₽</strong>
                        </div>
                    </div>
                    <button class="remove" @click="removeItem(item.id)">Remove</button>
                </div>
            </div>

            <div class="cart-summary">
                <div class="summary-row">
                    <span class="total-label">Total:</span>
                    <span class="summary-total">{{ totalPrice() }} ₽</span>
                </div>
                <div class="summary-actions">
                    <button class="btn-clear" @click="clear">Clear cart</button>
                    <button class="btn-checkout">Place an order</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore=useCartStore()

const totalPrice=()=>{
    return cartStore.items.reduce((sum,item)=>{
        return sum+(item.book.price*item.quantity)
    },0)
}

const removeItem=async(id)=>{
    try{
        if(confirm('Delete an item from the shopping cart?'))await cartStore.removeFromCart(id)
        alert('Success')
    }catch(error){
        console.error(error)
        alert('Error remove item from from the shopping cart, please repeat later')
    }
}

const clear=async()=>{
    try{
        if(confirm('Empty the shopping cart?'))await cartStore.clearCart()
        alert('Success')
    }catch(error){
        console.error(error)
        alert('Error remove item from from the shopping cart, please repeat later')
    }
}

onMounted(()=>{
    cartStore.getCart()
})
</script>

<style scoped>
.cart-container{
    max-width:900px;
    margin:40px auto;
    padding:0 20px;
}
.cart-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:30px;
}
.cart-header h1{
    font-size:28px;
    margin:0;
}
.cart-count{
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
.cart-items{
    display:flex;
    flex-direction:column;
    gap:20px;
    margin-bottom:30px;
    align-items:center;
}
.cart-item{
    display:flex;
    align-items:center;
    gap:20px;
    padding:20px 24px;
    border-radius:16px;
    background:#fff;
    border:1px solid #ececec;
    transition:.25s;
    animation:show .35s ease;
    width:100%;
    max-width:800px;
}
.cart-item:hover{
    transform:translateY(-3px);
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}
.cover{
    width:100px;
    height:150px;
    object-fit:cover;
    border-radius:10px;
    flex-shrink:0;
}
.item-info{
    display:flex;
    flex-direction:column;
    gap:4px;
    flex:1;
}
.item-info h3{
    margin:0;
    font-size:18px;
    font-weight:600;
    color:#1a1a2e;
}
.author-text{
    margin:0;
    color:#888;
    font-size:14px;
}
.price-row{
    display:flex;
    align-items:center;
    gap:16px;
    margin-top:4px;
}
.price-row span{
    font-size:15px;
    color:#333;
}
.price-row strong{
    font-size:18px;
    color:#2e7d32;
}
.remove{
    padding:8px 18px;
    border:none;
    border-radius:8px;
    background:#e74c3c;
    color:white;
    cursor:pointer;
    font-size:13px;
    font-weight:500;
    transition:0.3s;
    flex-shrink:0;
}
.remove:hover{
    background:#c0392b;
    transform:scale(1.05);
}
.remove:active{
    transform:scale(0.95);
}
.cart-summary{
    padding:24px 28px;
    background:#fff;
    border-radius:12px;
    border:1px solid #e8e8e8;
    width:100%;
    max-width:800px;
    margin:0 auto;
}
.summary-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size:20px;
    font-weight:600;
}
.total-label{
    color:#333;
}
.summary-total{
    color:black;
    font-size:24px;
}
.summary-actions{
    display:flex;
    gap:12px;
    margin-top:16px;
    justify-content:flex-end;
}
.summary-actions button{
    padding:10px 28px;
    border:none;
    border-radius:6px;
    cursor:pointer;
    font-size:14px;
    font-weight:500;
    transition:0.3s;
}
.btn-clear{
    background:#e74c3c;
    color:white;
}
.btn-clear:hover{
    background:#c0392b;
}
.btn-checkout{
    background:#2e7d32;
    color:white;
}
.btn-checkout:hover{
    background:#1e5a22;
}
@keyframes show{
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
</style>