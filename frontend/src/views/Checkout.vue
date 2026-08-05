<template>
    <div class="checkout-container">
        <h1>Оформление заказа</h1>

        <div v-if="cartStore.loading">Загрузка...</div>
        <div v-else-if="cartStore.items.length === 0" class="empty">
            <p>Корзина пуста</p>
            <router-link to="/" class="btn-continue">Продолжить покупки</router-link>
        </div>

        <div v-else class="checkout-grid">
            <!-- Товары -->
            <div class="checkout-items">
                <h2>Товары</h2>
                <div v-for="item in cartStore.items" :key="item.id" class="checkout-item">
                    <img 
                        v-if="item.book.coverId" 
                        :src="`/covers/${item.book.coverId}.jpg`" 
                        alt="cover" 
                        class="cover"
                        @error="(e) => e.target.style.display = 'none'"
                    >
                    <div class="item-info">
                        <h4>{{ item.book.title }}</h4>
                        <p>{{ item.book.author }}</p>
                        <p>{{ item.book.price }} ₽ × {{ item.quantity }}</p>
                    </div>
                    <div class="item-total">
                        <strong>{{ item.book.price * item.quantity }} ₽</strong>
                    </div>
                </div>
                <div class="checkout-total">
                    <span>Итого:</span>
                    <strong>{{ totalPrice() }} ₽</strong>
                </div>
            </div>

            <!-- Форма -->
            <div class="checkout-form">
                <h2>Адрес доставки</h2>
                <form @submit.prevent="placeOrder">
                    <div class="form-group">
                        <label>Адрес</label>
                        <input 
                            type="text" 
                            v-model="address" 
                            placeholder="ул. Пушкина, д. 10, кв. 5"
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label>Телефон</label>
                        <input 
                            type="tel" 
                            v-model="phone" 
                            placeholder="+7 999 123-45-67"
                            required
                        >
                    </div>
                    <button type="submit" class="btn-order">Оформить заказ</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import api from '../api/api'

const router = useRouter()
const cartStore = useCartStore()

const address = ref('')
const phone = ref('')

const totalPrice = () => {
    return cartStore.items.reduce((sum, item) => {
        return sum + (item.book.price * item.quantity)
    }, 0)
}

const placeOrder = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Войдите в аккаунт')
            router.push('/login')
            return
        }

        const response = await api.post('/api/orders', {
            address: address.value,
            phone: phone.value
        })

        alert('Заказ оформлен!')
        router.push('/orders')
    } catch (error) {
        console.error(error)
        alert('Ошибка оформления заказа')
    }
}

onMounted(() => {
    cartStore.getCart()
})
</script>

<style scoped>
.checkout-container {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 20px;
}
.checkout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 20px;
}
.checkout-items {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e8e8e8;
}
.checkout-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
}
.checkout-item:last-child {
    border-bottom: none;
}
.checkout-item .cover {
    width: 50px;
    height: 70px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
}
.checkout-item .item-info {
    flex: 1;
}
.checkout-item .item-info h4 {
    margin: 0;
    font-size: 16px;
}
.checkout-item .item-info p {
    margin: 2px 0;
    color: #888;
    font-size: 14px;
}
.item-total {
    font-size: 16px;
    font-weight: 600;
    color: #2e7d32;
}
.checkout-total {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    margin-top: 16px;
    border-top: 2px solid #333;
    font-size: 20px;
}
.checkout-total strong {
    color: #2e7d32;
}
.checkout-form {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e8e8e8;
}
.form-group {
    margin-bottom: 16px;
}
.form-group label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
}
.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}
.btn-order {
    width: 100%;
    padding: 14px;
    background: #2e7d32;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    transition: 0.3s;
}
.btn-order:hover {
    background: #1e5a22;
}
.empty {
    text-align: center;
    padding: 60px 0;
}
.btn-continue {
    display: inline-block;
    padding: 10px 32px;
    background: #4CAF50;
    color: white;
    border-radius: 6px;
    text-decoration: none;
}
</style>