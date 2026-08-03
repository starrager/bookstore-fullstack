<template>
    <div class="home">
        <div class="search">
            <input type="text" v-model="search" @keyup.enter="fetchBooks" placeholder="Search by title or author">
            <button class="find" @click="fetchBooks">Find</button>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="books.length===0" class="empty">no books found</div>
        <div v-else class="books">
            <div v-for="book in books":key="book.id" class="book">
                <img v-if="book.coverId" :src="`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`" alt="cover" class="cover" @error="(e)=>handleImageError(e,book)">
                <h3><strong class="title">Title: </strong>{{ book.title }}</h3>
                <p><strong class="author">Author: </strong>{{ book.author }}</p>
                <p><strong class="price">Price: </strong>{{ book.price }}</p>
                <p><strong class="rating">Rating: </strong>{{ book.avgRating?.toFixed(1)||'No' }}</p>
                <p><strong class="category">Category: </strong>{{ book.category?.name||'No category' }}</p>

                <div class="actions">
                    <button @click="addToCart(book.id)">In Cart</button>
                    <button @click="addToFavorites(book.id)">If Favorite</button>
                </div>
            </div>
        </div>

        <div class="pagination" v-if="pagination.total>0">
            <button @click="prevPage" :disabled="pagination.page<=1">Prev page</button>
            <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
            <button @click="nextPage" :disabled="pagination.page>=pagination.pages">Next page</button>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import api from '../api/api'
import { useCartStore } from '@/stores/cart'

const cartStore=useCartStore()
const search=ref('')
const books=ref([])
const loading=ref(false)
const pagination=ref({page:1,total:0,pages:1,limit:10})

const handleImageError=(event,book)=>{
    const img=event.target
    const originalSrc=img.src
    
    if(originalSrc.includes('-L.jpg'))img.src=originalSrc.replace('-L.jpg','-M.jpg')
    else if(originalSrc.includes('-M.jpg'))img.src=originalSrc.replace('-M.jpg','-S.jpg')
    else img.style.display = 'none'
}

const fetchBooks=async()=>{
    loading.value=true
    try{
        const response=await api.get('api/books',{
            params:{
                search:search.value||undefined,
                page:pagination.value.page,
                limit:20
            }
        })
        books.value=response.data.books
        pagination.value=response.data.pagination
    }catch(error){console.error(error)
    }finally{loading.value=false}
}

const nextPage=async()=>{
    if(pagination.value.page<pagination.value.pages){
        pagination.value.page++
        fetchBooks()
    }
}

const prevPage=async()=>{
    if(pagination.value.page>1){
        pagination.value.page--
        fetchBooks()
    }
}

const addToCart=async(bookId)=>{
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('Войдите в аккаунт')
            return
        }
        await cartStore.addToCart(bookId,1)
        alert(`Книга ${bookId} добавлена в корзину`)
    }catch(error){
        console.error(error)
        alert('ошибка добавления в корзину')
    }
}

const addToFavorites=async(bookId)=>{
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('Войдите в аккаунт')
            return
        }
        alert(`Книга ${bookId} добавлена в избранное`)
    }catch(error){
        console.error(error)
        alert('ошибка добавления в избранное')
    }
}

onMounted(fetchBooks)
</script>

<style scoped>
.home{
    max-width:1200px;
    margin:0 auto;
    padding:20px;
}
.search{
    display:flex;
    gap:10px;
    margin-bottom:30px;
}
.search input{
    flex:1;
    padding:10px;
    border:1px solid #ccc;
    border-radius:4px;
    font-size:16px;
}
.search button{
    padding:10px 24px;
    background:#4CAF50;
    color:white;
    border:none;
    border-radius:4px;
    cursor:pointer;
}
.books{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:20px;
}
.book{
    border:1px solid #eee;
    border-radius:8px;
    padding:16px;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    transition:0.2s;
}
.book:hover{
    transform:translateY(-4px);
    box-shadow:0 4px 16px rgba(0,0,0,0.15);
}
.book h3{
    margin-top:0;
    margin-bottom:8px;
}
.book p{
    margin:4px 0;
}
.actions{
    display:flex;
    gap:10px;
    margin-top:12px;
}
.actions button:first-child{
    background:#4CAF50;
    color:white;
    border:none;
    padding:6px 14px;
    border-radius:4px;
    cursor:pointer;
}
.actions button:last-child{
    background:#ff6b6b;
    color:white;
    border:none;
    padding:6px 14px;
    border-radius:4px;
    cursor:pointer;
}
.pagination{
    display:flex;
    gap:16px;
    justify-content:center;
    margin-top:30px;
    align-items:center;
}
.pagination button{
    padding:8px 16px;
    border:1px solid #ccc;
    border-radius:4px;
    background:white;
    cursor:pointer;
}
.pagination button:disabled{
    opacity:0.5;
    cursor:default;
}
.loading,.empty{
    text-align:center;
    padding:40px;
    color:#666;
}
.book{
    display:flex;
    flex-direction:column;
    border:1px solid #eee;
    border-radius:8px;
    padding:16px;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    transition:0.2s;
}
.book:hover{
    transform:translateY(-4px);
    box-shadow:0 4px 16px rgba(0,0,0,0.15);
}
.cover{
    width:100%;
    height:auto;
    max-height:300px;
    object-fit:cover;
    border-radius:4px;
    margin-bottom:12px;
}
</style>