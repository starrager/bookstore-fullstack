<template>
<div class="shop-page">
    <section class="hero">
        <div class="hero-content">
            <span class="hero-label">BOOKSTORE</span>
            <h1>Find your next story</h1>
            <p>Discover books worth reading.</p>
        </div>
    </section>

    <div class="search">
        <input v-model="search" type="text" placeholder="Search by title or author">
        <button @click="findBooks">Find</button>
    </div>

    <div class="filters">
        <select v-model="sort" @change="applyFilters">
            <option value="newest">By novelty</option>
            <option value="price_asc">Price: cheap at first</option>
            <option value="price_desc">Price: expensive at first</option>
            <option value="rating_desc">By rating</option>
        </select>

        <select v-model="categoryId" @change="applyFilters">
            <option value="">All categories</option>
            <option v-for="cat in categories":key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>

        <div class="price-filter">
            <input type="number" v-model="minPrice" @input="applyFilters" placeholder="from ₽">
            <input type="number" v-model="maxPrice" @input="applyFilters" placeholder="before ₽">
        </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="books.length===0" class="empty">
        <h2>No books found</h2>
        <p>Try changing your search.</p>
    </div>

    <div v-else class="books">
        <article v-for="book in books" :key="book.id" class="book">
            <div class="cover-wrapper">
                <img
                    v-if="book.coverId"
                    :src="`/covers/${book.coverId}.jpg`"
                    alt="cover"
                    class="cover"
                    @error="(e)=>e.target.src='/default-cover.jpg'"
                >
            </div>

            <div class="book-info">
                <span class="category">{{ book.category?.name||'No category' }}</span>

                <h3 class="title">{{ book.title }}</h3>

                <p class="author">{{ book.author }}</p>

                <div class="rating">
                    <span class="star">★</span>
                    <span>{{ book.avgRating?.toFixed(1)||'No rating' }}</span>
                </div>

                <div class="book-bottom">
                    <span class="price">{{ book.price }} ₽</span>

                    <div class="actions">
                        <button class="cart-button" @click="addToCart(book.id)">
                            In Cart
                        </button>
                        <button class="favorite-button" @click="addToFavorites(book.id)">
                            ♡
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>

    <div class="pagination" v-if="pagination.total>0">
        <button @click="prevPage" :disabled="pagination.page<=1">
            Prev
        </button>

        <span>
            {{ pagination.page }} / {{ pagination.pages }}
        </span>

        <button @click="nextPage" :disabled="pagination.page>=pagination.pages">
            Next
        </button>
    </div>
</div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import api from '../api/api'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@erag/vue-toastification'

const toast=useToast()
const cartStore=useCartStore()
const favoritesStore=useFavoritesStore()

const search=ref('')
const sort=ref('newest')
const categoryId=ref('')
const minPrice=ref('')
const maxPrice=ref('')
const books=ref([])
const categories=ref([])
const loading=ref(false)
const pagination=ref({page:1,total:0,pages:1,limit:10})

const handleImageError=(event,book)=>{
    const img=event.target
    const originalSrc=img.src
    
    if(originalSrc.includes('-L.jpg'))img.src=originalSrc.replace('-L.jpg','-M.jpg')
    else if(originalSrc.includes('-M.jpg'))img.src=originalSrc.replace('-M.jpg','-S.jpg')
    else img.style.display = 'none'
}

const fetchCategories=async()=>{
    try{
        response=await api.get('/api/categories')
        categories.value=response.data
    }catch(error){console.error(error)}
}

const fetchBooks=async()=>{
    loading.value=true
    try{
        const response=await api.get('api/books',{
            params:{
                search:search.value||undefined,
                sort:sort.value||undefined,
                categoryId:categoryId.value||undefined,
                minPrice:minPrice.value||undefined,
                maxPrice:maxPrice.value||undefined,
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
        toast.success(`The book №${bookId} has been added to the cart`)
    }catch(error){
        console.error(error)
        toast.error('Error adding to the cart')
    }
}

const addToFavorites=async(bookId)=>{
    try{
        const token=localStorage.getItem('token')
        if(!token){
            alert('Войдите в аккаунт')
            return
        }
        await favoritesStore.addFavorite(bookId)
        toast.success(`The book №${bookId} has been added to the favorites`)
    }catch(error){
        console.error(error)
        toast.error('Error adding to the favorites')
    }
}

const applyFilters=()=>{
    pagination.value.page=1
    fetchBooks()
}

onMounted(async()=>{
    fetchCategories()
    fetchBooks()
})
</script>

<style scoped>
.shop-page{
    width:100%;
    max-width:1150px;
    margin:0 auto;
    padding:0 20px 50px;
    box-sizing:border-box;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.hero{
    position:relative;
    display:flex;
    align-items:center;
    min-height:210px;
    margin:25px 0 22px;
    padding:35px 45px;
    box-sizing:border-box;
    overflow:hidden;
    border-radius:18px;
    background:linear-gradient(120deg,#1f7130,#318a3e 55%,#55a762);
    color:white;
    box-shadow:0 12px 30px rgba(39,123,52,.18);
}
.hero::after{
    content:"";
    position:absolute;
    width:260px;
    height:260px;
    right:-70px;
    top:-100px;
    border-radius:50%;
    background:rgba(255,255,255,.1);
}
.hero-content{
    position:relative;
    z-index:1;
}
.hero-label{
    display:inline-block;
    margin-bottom:8px;
    font-size:12px;
    font-weight:700;
    letter-spacing:2px;
    opacity:.8;
}
.hero h1{
    margin:0 0 8px;
    font-size:36px;
    line-height:1.1;
    letter-spacing:-1px;
}
.hero p{
    margin:0;
    font-size:16px;
    opacity:.85;
}
.search{
    display:flex;
    gap:10px;
    margin-bottom:30px;
}
.search input{
    flex:1;
    min-width:0;
    padding:14px 16px;
    border:1px solid #d9dedb;
    border-radius:10px;
    outline:none;
    background:#fff;
    color:#202522;
    font-family:inherit;
    font-size:15px;
    transition:border-color .2s,box-shadow .2s;
}
.search input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.search button{
    padding:0 25px;
    border:0;
    border-radius:10px;
    background:#318a3e;
    color:white;
    font-family:inherit;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.search button:hover{
    background:#277b34;
    transform:translateY(-1px);
    box-shadow:0 5px 14px rgba(49,138,62,.2);
}
.search button:active{
    transform:scale(.97);
}
.books{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
}
.book{
    display:flex;
    flex-direction:column;
    min-width:0;
    overflow:hidden;
    border:1px solid #e1e4e1;
    border-radius:14px;
    background:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,.04);
    transition:transform .25s,box-shadow .25s,border-color .25s;
}
.book:hover{
    transform:translateY(-6px);
    border-color:#cdd8cf;
    box-shadow:0 14px 28px rgba(31,61,37,.11);
}
.cover-wrapper{
    display:flex;
    justify-content:center;
    align-items:center;
    height:330px;
    padding:14px;
    box-sizing:border-box;
    background:#f1f3f1;
    overflow:hidden;
}
.cover{
    width:100%;
    height:100%;
    object-fit:contain;
    border-radius:7px;
    transition:transform .35s;
}
.book:hover .cover{
    transform:scale(1.04);
}
.book-info{
    display:flex;
    flex-direction:column;
    flex:1;
    padding:17px;
}
.category{
    align-self:flex-start;
    margin-bottom:8px;
    padding:4px 8px;
    border-radius:5px;
    background:#edf6ee;
    color:#318a3e;
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.4px;
}
.title{
    margin:0 0 6px;
    color:#202522;
    font-size:17px;
    line-height:1.3;
    font-weight:700;
}
.author{
    margin:0 0 12px;
    color:#737a75;
    font-size:14px;
}
.rating{
    display:flex;
    align-items:center;
    gap:5px;
    margin-bottom:15px;
    color:#626963;
    font-size:13px;
}
.star{
    color:#e7a928;
    font-size:15px;
}
.book-bottom{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    margin-top:auto;
    padding-top:12px;
    border-top:1px solid #edf0ed;
}
.price{
    color:#202522;
    font-size:18px;
    font-weight:750;
    white-space:nowrap;
}
.actions{
    display:flex;
    align-items:center;
    gap:6px;
}
.cart-button{
    padding:8px 11px;
    border:0;
    border-radius:7px;
    background:#318a3e;
    color:white;
    font-family:inherit;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,transform .2s;
}
.cart-button:hover{
    background:#277b34;
    transform:translateY(-1px);
}
.favorite-button{
    width:34px;
    height:34px;
    padding:0;
    border:1px solid #e2e5e2;
    border-radius:7px;
    background:#fff;
    color:#9a4d4d;
    font-size:18px;
    cursor:pointer;
    transition:background .2s,color .2s,transform .2s;
}
.favorite-button:hover{
    background:#fff2f2;
    color:#c03939;
    transform:scale(1.05);
}
.loading{
    padding:70px 20px;
    text-align:center;
    color:#737a75;
    font-size:15px;
}
.empty{
    padding:70px 20px;
    text-align:center;
    border:1px dashed #d5dbd6;
    border-radius:14px;
    background:#fff;
}
.empty h2{
    margin:0 0 8px;
    color:#303632;
}
.empty p{
    margin:0;
    color:#7a817c;
}
.pagination{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:15px;
    margin-top:35px;
}
.pagination button{
    padding:9px 16px;
    border:1px solid #d8ded9;
    border-radius:8px;
    background:#fff;
    color:#3d443f;
    font-family:inherit;
    font-size:13px;
    cursor:pointer;
    transition:background .2s,color .2s,border-color .2s;
}
.pagination button:hover:not(:disabled){
    border-color:#318a3e;
    background:#f0f6f1;
    color:#277b34;
}
.pagination button:disabled{
    cursor:not-allowed;
    opacity:.4;
}
.pagination span{
    color:#656d67;
    font-size:14px;
    font-weight:600;
}
@media(max-width:1000px){
    .books{
        grid-template-columns:repeat(3,1fr);
    }
}
@media(max-width:750px){
    .shop-page{
        padding:0 12px 40px;
    }
    .hero{
        min-height:180px;
        padding:28px;
    }
    .hero h1{
        font-size:30px;
    }
    .books{
        grid-template-columns:repeat(2,1fr);
        gap:14px;
    }
    .cover-wrapper{
        height:280px;
    }
}
@media(max-width:500px){
    .hero{
        min-height:160px;
        padding:24px;
    }
    .hero h1{
        font-size:25px;
    }
    .hero p{
        font-size:14px;
    }
    .search{
        gap:7px;
    }
    .search button{
        padding:0 17px;
    }
    .books{
        grid-template-columns:1fr 1fr;
        gap:10px;
    }
    .cover-wrapper{
        height:230px;
        padding:9px;
    }
    .book-info{
        padding:12px;
    }
    .title{
        font-size:14px;
    }
    .author{
        font-size:12px;
    }
    .price{
        font-size:15px;
    }
    .cart-button{
        padding:7px 8px;
        font-size:11px;
    }
}
</style>