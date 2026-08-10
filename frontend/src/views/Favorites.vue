<template>
    <div class="favorites-page">
        <div v-if="favoritesStore.loading" class="loading">
            <span class="spinner"></span>
            Loading...
        </div>

        <div v-else-if="favoritesStore.books.length===0" class="empty">
            <h2>Favorites are empty</h2>
            <p>Add books so you don't lose them</p>
            <router-link to="/" class="btn-continue">Continue shopping</router-link>
        </div>

        <div v-else class="favorites-content">
            <div class="favorites-header">
                <h1>Favorites</h1>
                <span class="favorites-count">{{ favoritesStore.books.length }} books</span>
            </div>

            <div class="books-grid">
                <div v-for="book in favoritesStore.books" :key="book.id" class="book-card">
                    <div class="cover-wrapper">
                        <img
                            v-if="book.coverId"
                            :src="`/covers/${book.coverId}.jpg`"
                            alt="cover"
                            class="cover"
                            @error="(e)=>e.target.style.display='none'"
                        >
                    </div>

                    <div class="book-info">
                        <h3>{{ book.title }}</h3>
                        <p class="author">{{ book.author }}</p>
                        <p class="price">{{ book.price }} ₽</p>

                        <div class="actions">
                            <button class="btn-cart" @click="addToCart(book.id)">
                                In Cart
                            </button>

                            <button class="btn-remove" @click="removeFromFavorites(book.id)">
                                Remove
                            </button>
                        </div>
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
import { useToast } from '@erag/vue-toastification';

const toast=useToast()
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
        toast.success('Book added to cart')
    }catch(error){
        console.error(error)
        toast.error('Error add to cart')
    }
}

const removeFromFavorites=async(bookId)=>{
    try{
        await favoritesStore.removeFavorite(bookId)
        toast.success('Book deleted from favorites')
    }catch(error){
        console.error(error)
        toast.error('Error remove from cart')
    }
}

onMounted(()=>{
    favoritesStore.getFavorites()
})
</script>

<style scoped>
.favorites-page{
    min-height:calc(100vh - 80px);
    padding:45px 20px 60px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.favorites-content{
    max-width:1050px;
    margin:0 auto;
}
.favorites-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
    animation:pageAppear .35s ease;
}
.favorites-header h1{
    margin:0;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.favorites-count{
    padding:6px 13px;
    border:1px solid #dfe3df;
    border-radius:20px;
    background:#fff;
    color:#68706a;
    font-size:13px;
}
.books-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
}
.book-card{
    overflow:hidden;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:13px;
    box-shadow:0 8px 25px rgba(0,0,0,.055);
    transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
    animation:cardAppear .4s ease both;
}
.book-card:nth-child(2){
    animation-delay:.05s;
}
.book-card:nth-child(3){
    animation-delay:.1s;
}
.book-card:nth-child(4){
    animation-delay:.15s;
}
.book-card:hover{
    transform:translateY(-4px);
    border-color:#d6ddd7;
    box-shadow:0 12px 28px rgba(0,0,0,.09);
}
.cover-wrapper{
    height:250px;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:15px;
    box-sizing:border-box;
    background:#f0f2f0;
}
.cover{
    width:auto;
    max-width:100%;
    height:100%;
    object-fit:cover;
    border-radius:6px;
    box-shadow:0 4px 10px rgba(0,0,0,.08);
    transition:transform .25s ease;
}
.book-card:hover .cover{
    transform:translateY(-3px);
}
.book-info{
    padding:17px;
}
.book-info h3{
    margin:0 0 5px;
    overflow:hidden;
    color:#202522;
    font-size:15px;
    font-weight:650;
    line-height:1.4;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.author{
    margin:0;
    color:#68706a;
    font-size:12px;
}
.price{
    margin:12px 0 14px;
    color:#277532;
    font-size:17px;
    font-weight:700;
}
.actions{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:7px;
}
.btn-cart,
.btn-remove{
    min-height:38px;
    padding:0 8px;
    border-radius:8px;
    font-family:inherit;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s;
}
.btn-cart{
    border:1px solid #318a3e;
    background:#318a3e;
    color:#fff;
}
.btn-cart:hover{
    background:#277532;
    border-color:#277532;
    transform:translateY(-1px);
}
.btn-remove{
    border:1px solid #d5dad6;
    background:#fff;
    color:#68706a;
}
.btn-remove:hover{
    border-color:#d65a5a;
    background:#fff6f6;
    color:#c13e3e;
    transform:translateY(-1px);
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
    margin:0 0 8px;
    color:#202522;
    font-size:24px;
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
@media(max-width:900px){
    .books-grid{
        grid-template-columns:repeat(3,1fr);
    }
}
@media(max-width:650px){
    .favorites-page{
        padding:30px 15px 45px;
    }
    .books-grid{
        grid-template-columns:repeat(2,1fr);
        gap:14px;
    }
    .cover-wrapper{
        height:220px;
    }
}
@media(max-width:450px){
    .favorites-page{
        padding:25px 12px 40px;
    }
    .favorites-header h1{
        font-size:24px;
    }
    .favorites-count{
        font-size:11px;
    }
    .books-grid{
        grid-template-columns:1fr;
    }
    .cover-wrapper{
        height:270px;
    }
}
@media(prefers-reduced-motion:reduce){
    .favorites-header,
    .book-card,
    .empty{
        animation:none;
    }
    .book-card,
    .cover,
    .btn-cart,
    .btn-remove,
    .btn-continue{
        transition:none;
    }
}
</style>