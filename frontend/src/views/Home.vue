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
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
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
            <article v-for="book in books" :key="book.id" class="book" @click="openBookModal(book)">
                <div class="cover-wrapper">
                    <img v-if="book.coverId" :src="`/covers/${book.coverId}.jpg`" alt="cover" class="cover" @error="(e)=>e.target.src='/default-cover.jpg'">
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
                            <button class="cart-button" @click.stop="addToCart(book.id)">In Cart</button>
                            <button class="favorite-button" @click.stop="addToFavorites(book.id)">♡</button>
                        </div>
                    </div>
                </div>
            </article>
        </div>

        <div v-if="showBookModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-book">
                <button class="modal-close" @click="closeModal">×</button>

                <div class="modal-content" v-if="selectedBook">
                    <div class="modal-book-cover">
                        <img :src="`/covers/${selectedBook.coverId}.jpg`" alt="cover" class="cover">
                    </div>

                    <div class="modal-book-info">
                        <span class="modal-category">{{ selectedBook.category?.name||'Book' }}</span>
                        <h2>{{ selectedBook.title }}</h2>
                        <p class="modal-author">{{ selectedBook.author }}</p>

                        <div class="modal-rating">
                            <span class="modal-stars">★</span>
                            <strong>{{ selectedBook.avgRating?.toFixed(1)||'No rating' }}</strong>
                            <span class="modal-rating-text">{{ reviews.length }} {{ reviews.length===1?'review':'reviews' }}</span>
                        </div>

                        <div class="modal-price">{{ selectedBook.price }} ₽</div>

                        <div class="modal-description">
                            <span class="modal-label">About this book</span>
                            <p>{{ selectedBook.description||'No description available.' }}</p>
                        </div>

                        <div class="modal-actions">
                            <button class="modal-cart-button" @click="addToCart(selectedBook.id)">Add to cart</button>
                            <button class="modal-favorite-button" @click="addToFavorites(selectedBook.id)">♡</button>
                        </div>
                    </div>

                    <div class="reviews">
                        <div class="reviews-header">
                            <div>
                                <span class="modal-label">Community</span>
                                <h3>Reviews</h3>
                            </div>
                            <span class="reviews-count">{{ reviews.length }}</span>
                        </div>

                        <div v-if="reviews.length===0" class="no-reviews">
                            <span class="no-reviews-icon">✦</span>
                            <strong>No reviews yet</strong>
                            <p>Be the first to share your thoughts about this book.</p>
                        </div>

                        <div v-for="review in reviews" :key="review.id" class="review">
                            <div class="review-top">
                                <strong>{{ review.user?.name||'Anonymous' }}</strong>
                                <span class="review-rating">★ {{ review.rating }}</span>
                            </div>
                            <p>{{ review.text }}</p>
                        </div>

                        <div v-if="isAuthenticated" class="review-form">
                            <div class="review-form-header">
                                <div>
                                    <span class="modal-label">Your opinion</span>
                                    <h4>Write a review</h4>
                                </div>
                                <span class="review-form-icon">✎</span>
                            </div>

                            <label class="review-field-label">Rating</label>
                            <select v-model="newReview.rating">
                                <option v-for="i in 5" :key="i" :value="i">{{ i }} {{ i===1?'star':'stars' }}</option>
                            </select>

                            <label class="review-field-label">Review</label>
                            <textarea v-model="newReview.text" placeholder="What did you think about this book?"></textarea>

                            <button class="review-submit" @click="submitReview">Publish review</button>
                        </div>

                        <div v-else class="login-review">
                            <strong>Want to share your opinion?</strong>
                            <p>Log in to leave a review.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="pagination" v-if="pagination.total>0">
            <button @click="prevPage" :disabled="pagination.page<=1">Prev</button>
            <span>{{ pagination.page }} / {{ pagination.pages }}</span>
            <button @click="nextPage" :disabled="pagination.page>=pagination.pages">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useToast } from '@erag/vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const reviews = ref([])
const newReview = ref({ rating: 5, text: '' })

const toast = useToast()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const selectedBook = ref(null)
const showBookModal = ref(false)

const search = ref('')
const sort = ref('newest')
const categoryId = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const books = ref([])
const categories = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, total: 0, pages: 1, limit: 10 })

const openBookModal = async (book) => {
    selectedBook.value = book
    showBookModal.value = true
    await fetchReviews(book.id)
}

const closeModal = () => {
    showBookModal.value = false
    selectedBook.value = null
    reviews.value = []
}

const fetchReviews = async (bookId) => {
    try {
        const response = await api.get(`/reviews/book/${bookId}`)
        reviews.value = response.data.reviews || []
    } catch (error) {
        console.error(error)
    }
}

const submitReview = async () => {
    try {
        await api.post('/reviews', {
            bookId: selectedBook.value.id,
            rating: newReview.value.rating,
            text: newReview.value.text
        })
        toast.success('Review left')
        newReview.value = { rating: 5, text: '' }
        await fetchReviews(selectedBook.value.id)
        await fetchBooks()
    } catch (error) {
        console.error(error)
    }
}

const handleImageError = (event, book) => {
    const img = event.target
    const originalSrc = img.src

    if (originalSrc.includes('-L.jpg')) img.src = originalSrc.replace('-L.jpg', '-M.jpg')
    else if (originalSrc.includes('-M.jpg')) img.src = originalSrc.replace('-M.jpg', '-S.jpg')
    else img.style.display = 'none'
}

const fetchCategories = async () => {
    try {
        const response = await api.get('/categories')
        categories.value = response.data
    } catch (error) {
        console.error(error)
    }
}

const fetchBooks = async () => {
    loading.value = true
    try {
        const response = await api.get('/books', {
            params: {
                search: search.value || undefined,
                sort: sort.value || undefined,
                categoryId: categoryId.value || undefined,
                minPrice: minPrice.value || undefined,
                maxPrice: maxPrice.value || undefined,
                page: pagination.value.page,
                limit: 20
            }
        })
        books.value = response.data.books
        pagination.value = response.data.pagination
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const nextPage = async () => {
    if (pagination.value.page < pagination.value.pages) {
        pagination.value.page++
        fetchBooks()
    }
}

const prevPage = async () => {
    if (pagination.value.page > 1) {
        pagination.value.page--
        fetchBooks()
    }
}

const addToCart = async (bookId) => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Войдите в аккаунт')
            return
        }
        await cartStore.addToCart(bookId, 1)
        toast.success(`The book №${bookId} has been added to the cart`)
    } catch (error) {
        console.error(error)
        toast.error('Error adding to the cart')
    }
}

const addToFavorites = async (bookId) => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Войдите в аккаунт')
            return
        }
        await favoritesStore.addFavorite(bookId)
        toast.success(`The book №${bookId} has been added to the favorites`)
    } catch (error) {
        console.error(error)
        toast.error('Error adding to the favorites')
    }
}

const applyFilters = () => {
    pagination.value.page = 1
    fetchBooks()
}

onMounted(async () => {
    fetchCategories()
    fetchBooks()
})
</script>

<style scoped>
.filters{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:30px;
    padding:14px;
    border:1px solid #e1e4e1;
    border-radius:12px;
    background:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,.035);
}
.filters select,
.price-filter input{
    height:42px;
    box-sizing:border-box;
    padding:0 13px;
    border:1px solid #d9dedb;
    border-radius:8px;
    outline:none;
    background:#fff;
    color:#3d443f;
    font-family:inherit;
    font-size:13px;
    cursor:pointer;
    transition:border-color .2s,box-shadow .2s,background .2s;
}
.filters select{
    min-width:175px;
}
.filters select:focus,
.price-filter input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.filters select:hover,
.price-filter input:hover{
    border-color:#bfc9c1;
}
.price-filter{
    display:flex;
    align-items:center;
    gap:8px;
    margin-left:auto;
}
.price-filter input{
    width:115px;
    cursor:text;
}
.price-filter input::placeholder{
    color:#969d98;
}
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
.modal-overlay{
    position:fixed;
    inset:0;
    z-index:9999;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:24px;
    box-sizing:border-box;
    background:rgba(17,24,19,.72);
    backdrop-filter:blur(10px);
    animation:modal-overlay-in .25s ease both;
}
.modal-book{
    position:relative;
    width:100%;
    max-width:900px;
    max-height:92vh;
    overflow-y:auto;
    padding:36px;
    box-sizing:border-box;
    border:1px solid rgba(255,255,255,.8);
    border-radius:22px;
    background:#fff;
    box-shadow:0 30px 90px rgba(0,0,0,.3);
    animation:modal-book-in .4s cubic-bezier(.2,.8,.2,1) both;
    scrollbar-width:thin;
    scrollbar-color:#b9c9bb transparent;
}
.modal-book::before{
    content:"";
    position:absolute;
    top:0;
    left:8%;
    width:84%;
    height:3px;
    border-radius:0 0 5px 5px;
    background:linear-gradient(90deg,#287a35,#63ad6e);
    box-shadow:0 0 20px rgba(49,138,62,.25);
}
.modal-close{
    position:absolute;
    top:18px;
    right:18px;
    z-index:5;
    display:flex;
    align-items:center;
    justify-content:center;
    width:40px;
    height:40px;
    border:1px solid #e0e5e1;
    border-radius:50%;
    background:#fff;
    color:#59615b;
    font-size:24px;
    line-height:1;
    cursor:pointer;
    transition:background .2s,color .2s,transform .25s,box-shadow .2s;
}
.modal-close:hover{
    background:#318a3e;
    color:#fff;
    transform:rotate(90deg);
    box-shadow:0 7px 18px rgba(49,138,62,.22);
}
.modal-content{
    display:grid;
    grid-template-columns:250px 1fr;
    gap:36px;
}
.modal-book-cover{
    display:flex;
    align-items:flex-start;
    justify-content:center;
}
.modal-book-cover .cover{
    width:250px;
    height:365px;
    object-fit:cover;
    border-radius:12px;
    background:#f0f3f0;
    box-shadow:0 18px 38px rgba(31,61,37,.18);
    transition:transform .3s,box-shadow .3s;
}
.modal-book-cover .cover:hover{
    transform:translateY(-5px) rotate(-1deg);
    box-shadow:0 24px 45px rgba(31,61,37,.23);
}
.modal-book-info{
    display:flex;
    flex-direction:column;
    min-width:0;
    padding:8px 35px 0 0;
}
.modal-category{
    align-self:flex-start;
    margin-bottom:12px;
    padding:5px 9px;
    border-radius:6px;
    background:#edf6ee;
    color:#318a3e;
    font-size:10px;
    font-weight:800;
    text-transform:uppercase;
    letter-spacing:.7px;
}
.modal-book-info h2{
    margin:0 0 7px;
    color:#202522;
    font-size:31px;
    line-height:1.15;
    letter-spacing:-.9px;
}
.modal-author{
    margin:0 0 18px;
    color:#737a75;
    font-size:15px;
}
.modal-rating{
    display:flex;
    align-items:center;
    gap:7px;
    margin-bottom:16px;
}
.modal-stars{
    color:#e5a326;
    font-size:20px;
}
.modal-rating strong{
    color:#303732;
    font-size:15px;
}
.modal-rating-text{
    color:#8a918c;
    font-size:13px;
}
.modal-price{
    display:inline-flex;
    align-self:flex-start;
    margin-bottom:22px;
    padding:8px 12px;
    border-radius:8px;
    background:#f1f7f2;
    color:#287a35;
    font-size:21px;
    font-weight:800;
}
.modal-description{
    margin-top:auto;
    padding:17px;
    border:1px solid #e5ebe6;
    border-radius:12px;
    background:#fafcfb;
}
.modal-label{
    display:block;
    margin-bottom:6px;
    color:#318a3e;
    font-size:10px;
    font-weight:800;
    text-transform:uppercase;
    letter-spacing:1px;
}
.modal-description p{
    margin:0;
    color:#69716b;
    font-size:14px;
    line-height:1.65;
}
.modal-actions{
    display:flex;
    gap:9px;
    margin-top:16px;
}
.modal-cart-button{
    flex:1;
    min-height:44px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.modal-cart-button:hover{
    background:#287833;
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(49,138,62,.2);
}
.modal-favorite-button{
    width:46px;
    min-width:46px;
    border:1px solid #dfe5e0;
    border-radius:9px;
    background:#fff;
    color:#9a4d4d;
    font-size:22px;
    cursor:pointer;
    transition:background .2s,color .2s,transform .2s;
}
.modal-favorite-button:hover{
    background:#fff2f2;
    color:#c03939;
    transform:scale(1.04);
}
.reviews{
    grid-column:1 / -1;
    margin-top:2px;
    padding-top:30px;
    border-top:1px solid #e7ebe8;
}
.reviews-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:18px;
}
.reviews-header h3{
    margin:0;
    color:#252a27;
    font-size:23px;
    letter-spacing:-.4px;
}
.reviews-count{
    display:flex;
    align-items:center;
    justify-content:center;
    min-width:34px;
    height:34px;
    padding:0 9px;
    box-sizing:border-box;
    border-radius:50%;
    background:#edf6ee;
    color:#318a3e;
    font-size:13px;
    font-weight:800;
}
.no-reviews{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    min-height:145px;
    padding:25px;
    box-sizing:border-box;
    border:1px dashed #d4ddd6;
    border-radius:13px;
    background:#fafcfb;
    text-align:center;
}
.no-reviews-icon{
    display:flex;
    align-items:center;
    justify-content:center;
    width:38px;
    height:38px;
    margin-bottom:9px;
    border-radius:50%;
    background:#edf6ee;
    color:#318a3e;
    font-size:17px;
}
.no-reviews strong{
    color:#3a413c;
    font-size:14px;
}
.no-reviews p{
    margin:5px 0 0;
    color:#858d87;
    font-size:13px;
}
.review{
    position:relative;
    margin-bottom:12px;
    padding:17px 19px;
    border:1px solid #e4e9e5;
    border-radius:12px;
    background:#fbfcfb;
    transition:transform .2s,border-color .2s,box-shadow .2s;
    animation:review-in .35s ease both;
}
.review:hover{
    transform:translateY(-2px);
    border-color:#cdd9cf;
    box-shadow:0 8px 20px rgba(31,61,37,.07);
}
.review-top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
}
.review-top strong{
    color:#303732;
    font-size:14px;
}
.review-rating{
    padding:4px 8px;
    border-radius:6px;
    background:#fff7e7;
    color:#c48919;
    font-size:12px;
    font-weight:700;
}
.review p{
    margin:10px 0 0;
    color:#69716b;
    font-size:14px;
    line-height:1.65;
}
.review-form{
    margin-top:25px;
    padding:26px;
    border:1px solid #dce6de;
    border-radius:15px;
    background:linear-gradient(145deg,#f9fcf9,#f2f7f3);
    box-shadow:0 8px 22px rgba(31,61,37,.04);
}
.review-form-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:20px;
}
.review-form h4{
    margin:0;
    color:#252a27;
    font-size:20px;
}
.review-form-icon{
    display:flex;
    align-items:center;
    justify-content:center;
    width:38px;
    height:38px;
    border-radius:9px;
    background:#e8f3e9;
    color:#318a3e;
    font-size:18px;
}
.review-field-label{
    display:block;
    margin:0 0 7px;
    color:#4c554f;
    font-size:12px;
    font-weight:700;
}
.review-form select,
.review-form textarea{
    width:100%;
    box-sizing:border-box;
    border:1px solid #d5ded7;
    border-radius:9px;
    outline:none;
    background:#fff;
    color:#303732;
    font-family:inherit;
    font-size:14px;
    transition:border-color .2s,box-shadow .2s,transform .2s;
}
.review-form select{
    height:45px;
    padding:0 12px;
    margin-bottom:16px;
    cursor:pointer;
}
.review-form textarea{
    min-height:160px;
    padding:14px;
    resize:vertical;
    line-height:1.6;
}
.review-form textarea::placeholder{
    color:#9ba29d;
}
.review-form select:focus,
.review-form textarea:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.09);
}
.review-submit{
    width:100%;
    min-height:46px;
    margin-top:14px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    transition:transform .2s,background .2s,box-shadow .2s;
}
.review-submit:hover{
    background:#287833;
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(49,138,62,.2);
}
.review-submit:active{
    transform:translateY(0) scale(.98);
}
.login-review{
    margin-top:22px;
    padding:20px;
    border-radius:12px;
    background:#f5f7f5;
    text-align:center;
}
.login-review strong{
    color:#3a413c;
    font-size:14px;
}
.login-review p{
    margin:5px 0 0;
    color:#7a827c;
    font-size:13px;
}
@keyframes modal-overlay-in{
    from{
        opacity:0;
    }
    to{
        opacity:1;
    }
}
@keyframes modal-book-in{
    from{
        opacity:0;
        transform:translateY(25px) scale(.96);
    }
    to{
        opacity:1;
        transform:translateY(0) scale(1);
    }
}
@keyframes review-in{
    from{
        opacity:0;
        transform:translateY(8px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@media(max-width:700px){
    .modal-overlay{
        padding:12px;
        align-items:flex-end;
    }
    .modal-book{
        max-height:94vh;
        padding:27px 20px;
        border-radius:18px 18px 12px 12px;
    }
    .modal-content{
        grid-template-columns:1fr;
        gap:20px;
    }
    .modal-book-cover .cover{
        width:180px;
        height:265px;
    }
    .modal-book-info{
        padding:0;
    }
    .modal-book-info h2{
        font-size:25px;
    }
    .reviews{
        grid-column:auto;
    }
}
</style>