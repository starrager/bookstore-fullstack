<template>
    <div class="cart">
        <h1>Cart</h1>

        <div v-if="loading">Loading...</div>
        <div v-else-if="items.length===0" class="empty">Cart is empty</div>
        <div v-else>
            <div v-for="item in items":key="item.id" class="cart-item">
                <div class="info">
                    <img v-if="item.book.coverId" :src="`https://covers.openlibrary.org/b/id/${item.book.coverId}-L.jpg`" alt="cover">
                    <h3>{{ item.book.title }}</h3>
                    <p>{{ item.book.author }}</p>
                    <p>{{ item.book.price }} ₽ x {{ item.quantity }}</p>
                    <p><strong>{{ item.book.price*item.quantity }}</strong></p>
                </div>
                <button class="remove" @click="removeItem(item.id)">Remove</button>
            </div>
            <div class="total">
                <h2>Total: {{ items.length?totalPrice():0 }}₽</h2>
                <button class="clear" @click="clearCart">Clear cart</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore=useCartStore()
const {items,loading}=cartStore

const totalPrice = () => {
    return items.reduce((sum, item) => {
        return sum + (item.book.price * item.quantity)
    }, 0)
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

onUnmounted(()=>{
    cartStore.getCart()
})
</script>

<style scoped>
.cart{
    max-width:800px;
    margin:0 auto;
    padding:20px;
}
.cart-item{
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:1px solid #eee;
    padding:12px 0;
}
.cart-item button{
    background:#e74c3c;
    color:white;
    border:none;
    padding:6px 14px;
    border-radius:4px;
    cursor:pointer;
}
.total{
    margin-top:30px;
    padding-top:20px;
    border-top:2px solid #333;
}
.total button{
    background:#e74c3c;
    color:white;
    border:none;
    padding:10px 20px;
    border-radius:4px;
    cursor:pointer;
}
.empty{
    text-align:center;
    padding:40px;
    color:#666;
}
.cover{
    width:100px;
    height:auto;
    max-height:300px;
    object-fit:cover;
    border-radius:4px;
    margin-bottom:12px;
}
</style>