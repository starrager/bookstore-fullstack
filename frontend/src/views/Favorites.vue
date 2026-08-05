<template>
    <div class="favorites-container">
        <div class="favorites-header">
            <h1>Favorites</h1>
            <span v-if="favoritesStore.books.length" class="count">
                {{ favoritesStore.books.length }}
            </span>
        </div>

        <div v-if="favoritesStore.loading" class="loading">Loading...</div>
        <div v-else-if="favoritesStore.books.length===0" class="empty">
            <h2>Favorites are emprty</h2>
            <p>Add books so you dont lose them</p>
            <router-link to="/" class="btn-continue">Continue shopping</router-link>
        </div>
        <div v-else class="books-grid">
            <div v-for="book in favoritesStore.books":key='book.id' class="book-card">
                <img v-if="book.coverId" :src="`/covers/${book.coverId}.jpg`" alt="cover" class="cover" @error="(e)=>e.target.style.display='none'">
                <div class="books-info">
                    <h3>{{ book.title }}</h3>
                    <p class="author">{{ book.author }}</p>
                    <p class="price">{{ book.price }}₽</p>
                    <div class="actions">
                        <button class="btn-cart" @click="addToCart(book.id)">In Cart</button>
                        <button class="btn-remove" @click="removeFromFavorites(book.id)">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const router=useRouter()
const favoritesStore=useFavoritesStore()
const cartStore=useCartStore()

const addToCart=async(bookId)=>{
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('Log in to your account')
            router.push('/login')
            return
        }
        await cartStore.addToCart(bookId,1)
        alert('Book added to cart')
    }catch(error){
        console.error(error)
        alert('Error add to cart')
    }
}

const removeFromFavorites=async(bookId)=>{
    try{
        await favoritesStore.removeFavorite(bookId)
        alert('Book deleted from favorites')
    }catch(error){
        console.error(error)
        alert('Error remove from cart')
    }
}

onMounted(()=>{
    favoritesStore.getFavorites()
})
</script>

<style scoped>
.favorites-container{
    max-width:1200px;
    margin:40px auto;
    padding:0 20px;
}
.favorites-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:30px;
}
.favorites-header h1{
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
.books-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
    gap:24px;
}
.book-card{
    background:#fff;
    border-radius:12px;
    border:1px solid #e8e8e8;
    padding:16px;
    transition:0.3s;
}
.book-card:hover{
    transform:translateY(-4px);
    box-shadow:0 8px 24px rgba(0,0,0,0.08);
}
.book-card .cover{
    width:100%;
    height:250px;
    object-fit:cover;
    border-radius:8px;
}
.book-card h3{
    margin:12px 0 4px;
    font-size:16px;
}
.book-card .author{
    margin:0 0 8px;
    color:#888;
    font-size:14px;
}
.book-card .price{
    font-size:18px;
    font-weight:600;
    color:#2e7d32;
}
.actions{
    display:flex;
    gap:8px;
    margin-top:12px;
}
.actions button{
    padding:8px 16px;
    border:none;
    border-radius:6px;
    cursor:pointer;
    transition:0.3s;
}
.btn-cart{
    flex:1;
    background:#2e7d32;
    color:white;
}
.btn-cart:hover{
    background:#1e5a22;
}
.btn-remove{
    background:#ef4444;
    color:white;
    font-size:18px;
}
.btn-remove:hover{
    background:#dc2626;
}
</style>