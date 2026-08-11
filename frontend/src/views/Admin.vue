<template>
    <div class="admin-page">
        <div class="admin-container">
            <div class="admin-header">
                <div>
                    <h1>Book management</h1>
                    <p>Manage books, prices and stock</p>
                </div>

                <button class="btn-add" @click="showCreateModal=true">
                    <span>+</span>
                    Add book
                </button>
            </div>

            <div class="admin-filters">
                <input type="text" v-model="search" @input="applyFilters" placeholder="search by titles" class="filter-input">

                <select v-model="sort" @change="applyFilters" class="filter-select">
                    <option value="newest">By novelty</option>
                    <option value="price_asc">Price ↑</option>
                    <option value="price_desc">Price ↓</option>
                </select>

                <select v-model="categoryId" @change="applyFilters" class="filter-select">
                    <option value="">All categories</option>
                    <option v-for="cat in categories":key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>

                <button class="btn-reset" @click="resetFilters">Reset</button>
            </div>

            <div v-if="loading" class="loading">
                <span class="spinner"></span>
                Loading...
            </div>

            <div v-else-if="books.length===0" class="empty">
                <h2>No books yet</h2>
                <p>Add your first book to the catalog.</p>
                <button class="btn-add" @click="showCreateModal=true">
                    Add book
                </button>
            </div>

            <div v-else class="books-table-wrapper">
                <table class="books-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>In Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="book in books" :key="book.id">
                            <td class="book-id">{{ book.id }}</td>

                            <td class="book-title">
                                <strong>{{ book.title }}</strong>
                            </td>

                            <td class="book-author">
                                {{ book.author }}
                            </td>

                            <td class="book-price">
                                {{ book.price }} ₽
                            </td>

                            <td>
                                <span
                                    class="stock"
                                    :class="{ 'stock-empty': book.stock===0 }"
                                >
                                    {{ book.stock }}
                                </span>
                            </td>

                            <td class="actions">
                                <button
                                    class="btn-edit"
                                    @click="openEditModal(book)"
                                >
                                    Edit
                                </button>

                                <button
                                    class="btn-remove"
                                    @click="deleteBook(book.id)"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div
            v-if="showCreateModal"
            class="modal-overlay"
            @click.self="closeModal"
        >
            <div class="modal">
                <div class="modal-header">
                    <div>
                        <h2>Add book</h2>
                        <p>Create a new book in the catalog</p>
                    </div>

                    <button class="modal-close" @click="closeModal">
                        ×
                    </button>
                </div>

                <form @submit.prevent="createBook">
                    <div class="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            v-model="createForm.title"
                            placeholder="Book title"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Author *</label>
                        <input
                            type="text"
                            v-model="createForm.author"
                            placeholder="Author name"
                            required
                        >
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Price *</label>
                            <input
                                type="number"
                                v-model="createForm.price"
                                placeholder="0"
                                required
                                min="0"
                            >
                        </div>

                        <div class="form-group">
                            <label>Stock *</label>
                            <input
                                type="number"
                                v-model="createForm.stock"
                                placeholder="0"
                                required
                                min="0"
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Category</label>

                        <select v-model="createForm.categoryId">
                            <option value="">No Category</option>

                            <option
                                v-for="cat in categories"
                                :key="cat.id"
                                :value="cat.id"
                            >
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Description</label>

                        <textarea
                            v-model="createForm.description"
                            rows="3"
                            placeholder="Book description"
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            @click="closeModal"
                            class="btn-cancel"
                        >
                            Cancel
                        </button>

                        <button type="submit" class="btn-submit">
                            Create book
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div
            v-if="showEditModal"
            class="modal-overlay"
            @mousedown="(e)=>{
                if(e.target===e.currentTarget)dragStart=true
            }"
            @mouseup="(e)=>{
                if(e.target===e.currentTarget&&dragStart)closeModal()
                dragStart=false
            }"
        >
            <div class="modal">
                <div class="modal-header">
                    <div>
                        <h2>Edit book</h2>
                        <p>Update book information</p>
                    </div>

                    <button class="modal-close" @click="closeModal">
                        ×
                    </button>
                </div>

                <form @submit.prevent="updateBook">
                    <div class="form-group">
                        <label>Title *</label>

                        <input
                            type="text"
                            v-model="editForm.title"
                            placeholder="Book title"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Author *</label>

                        <input
                            type="text"
                            v-model="editForm.author"
                            placeholder="Author name"
                            required
                        >
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Price *</label>

                            <input
                                type="number"
                                v-model="editForm.price"
                                placeholder="0"
                                required
                                min="0"
                            >
                        </div>

                        <div class="form-group">
                            <label>Stock *</label>

                            <input
                                type="number"
                                v-model="editForm.stock"
                                placeholder="0"
                                required
                                min="0"
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Category</label>

                        <select v-model="editForm.categoryId">
                            <option value="">No Category</option>

                            <option
                                v-for="cat in categories"
                                :key="cat.id"
                                :value="cat.id"
                            >
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Description</label>

                        <textarea
                            v-model="editForm.description"
                            rows="3"
                            placeholder="Book description"
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            @click="closeModal"
                            class="btn-cancel"
                        >
                            Cancel
                        </button>

                        <button type="submit" class="btn-submit">
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import api from '../api/api'
import {useToast} from '@erag/vue-toastification'

const toast=useToast()
const books=ref([])
const categories=ref([])
const loading=ref(false)
const showCreateModal=ref(false)
const showEditModal=ref(false)
const dragStart=ref(false)
const search=ref('')
const sort=ref('newest')
const categoryId=ref('')

const createForm=ref({
    title:'',
    author:'',
    price:0,
    stock:0,
    categoryId:'',
    description:''
})

const editForm=ref({
    id:null,
    title:'',
    author:'',
    price:0,
    stock:0,
    categoryId:'',
    description:''
})

const fetchBooks=async()=>{
    loading.value=true
    try{
        const response=await api.get('/api/books?limit=1000',{
            params:{
                search:search.value||undefined,
                sort:sort.value||undefined,
                categoryId:categoryId.value||undefined
            }
        })
        books.value=response.data.books||response.data||[]
    }catch(error){toast.error('Error loading books')}
    finally{loading.value=false}
}

const fetchCategories=async()=>{
    loading.value=true
    try{
        const response=await api.get('/api/categories')
        categories.value=response.data

    }catch(error){toast.error('Error loading categories')}
}

const openCreateModal=()=>{
    createForm.value={
        title: '',
        author: '',
        price: 0,
        stock: 0,
        categoryId: '',
        description: ''
    }
    showCreateModal.value=true
}

const openEditModal=(book)=>{
    editForm.value={
        id:book.id,
        title:book.title||'',
        author:book.author||'',
        price:book.price||0,
        stock:book.stock||0,
        categoryId:book.categoryId||'',
        description:book.description||''
    }
    showEditModal.value=true
}

const closeModal=()=>{
    showCreateModal.value=false
    showEditModal.value=false
}

const createBook=async()=>{
    try{
        const data={
            ...createForm.value,
            price:Number(createForm.value.price),
            stock:Number(createForm.value.stock),
            categoryId:createForm.value.categoryId?Number(createForm.value.categoryId):undefined
        }
        await api.post('/api/books',data)
        toast.success('The book was created')
        closeModal()
        await fetchBooks()
    }catch(error){toast.error(error.response?.data?.error||'Creation error')}
}

const updateBook=async()=>{
    try{
        const data={
            ...editForm.value,
            price:Number(editForm.value.price),
            stock:Number(editForm.value.stock),
            categoryId:editForm.value.categoryId?Number(editForm.value.categoryId):undefined
        }
        await api.put(`/api/books/${editForm.value.id}`,data)
        toast.success('The book has been updated')
        closeModal()
        await fetchBooks()
    }catch(error){toast.error(error.response?.data?.error||'Update error')}
}

const deleteBook=async(id)=>{
    if(!confirm('Remove book?'))return
    try{
        await api.delete(`/api/books/${id}`)
        toast.success('The book has been removed')
        await fetchBooks()
    }catch(error){toast.error(error.response?.data?.error||'Deletion error')}
}

const applyFilters=()=>{
    fetchBooks()
}

const resetFilters=()=>{
    search.value=''
    sort.value='newest'
    categoryId.value=''
    fetchBooks()
}

onMounted(async()=>{
    await fetchCategories()
    await fetchBooks()
})
</script>

<style scoped>
.admin-filters{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:25px;
    padding:14px;
    border:1px solid #e1e4e1;
    border-radius:12px;
    background:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,.035);
}
.filter-input,
.filter-select{
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
    transition:border-color .2s,box-shadow .2s,background .2s;
}
.filter-input{
    flex:1;
    min-width:200px;
}
.filter-select{
    min-width:165px;
    cursor:pointer;
}
.filter-input:focus,
.filter-select:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.filter-input:hover,
.filter-select:hover{
    border-color:#bfc9c1;
}
.filter-input::placeholder{
    color:#969d98;
}
.btn-reset{
    height:42px;
    padding:0 17px;
    border:1px solid #d9dedb;
    border-radius:8px;
    background:#f7f8f7;
    color:#59615b;
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s;
}
.btn-reset:hover{
    border-color:#c5cdc6;
    background:#eef1ee;
    color:#303731;
    transform:translateY(-1px);
}
.btn-reset:active{
    transform:scale(.97);
}
@media(max-width:750px){
    .admin-filters{
        flex-wrap:wrap;
    }
    .filter-input{
        width:100%;
        min-width:0;
        flex:none;
    }
    .filter-select{
        flex:1;
        min-width:150px;
    }
    .btn-reset{
        padding:0 20px;
    }
}
@media(max-width:500px){
    .admin-filters{
        flex-direction:column;
        align-items:stretch;
        padding:10px;
    }
    .filter-input,
    .filter-select,
    .btn-reset{
        width:100%;
    }
}
.admin-page{
    min-height:calc(100vh - 80px);
    padding:45px 20px 60px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.admin-container{
    max-width:1100px;
    margin:0 auto;
}
.admin-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    margin-bottom:28px;
    animation:pageAppear .35s ease;
}
.admin-header h1{
    margin:0 0 6px;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.admin-header p{
    margin:0;
    color:#68706a;
    font-size:14px;
}
.btn-add{
    display:inline-flex;
    justify-content:center;
    align-items:center;
    gap:7px;
    min-height:43px;
    padding:0 18px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
    box-shadow:0 5px 14px rgba(49,138,62,.12);
    transition:background .2s,transform .2s,box-shadow .2s;
}
.btn-add span{
    font-size:18px;
    line-height:1;
    font-weight:400;
}
.btn-add:hover{
    background:#277532;
    transform:translateY(-1px);
    box-shadow:0 7px 18px rgba(49,138,62,.2);
}
.books-table-wrapper{
    overflow:hidden;
    background:#fff;
    border:1px solid #e1e4e1;
    border-radius:14px;
    box-shadow:0 8px 25px rgba(0,0,0,.055);
    animation:cardAppear .4s ease;
}
.books-table{
    width:100%;
    border-collapse:collapse;
}
.books-table thead{
    background:#fafbfa;
}
.books-table th{
    padding:14px 16px;
    border-bottom:1px solid #e1e4e1;
    color:#68706a;
    text-align:left;
    font-size:11px;
    font-weight:650;
    letter-spacing:.3px;
    text-transform:uppercase;
}
.books-table td{
    padding:15px 16px;
    border-bottom:1px solid #edf0ed;
    color:#4e5650;
    font-size:13px;
}
.books-table tbody tr{
    transition:background .2s;
}
.books-table tbody tr:hover{
    background:#fafcf9;
}
.books-table tbody tr:last-child td{
    border-bottom:0;
}
.book-id{
    width:45px;
    color:#929992!important;
    font-size:12px!important;
}
.book-title{
    max-width:260px;
}
.book-title strong{
    display:block;
    overflow:hidden;
    color:#202522;
    font-weight:600;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.book-author{
    color:#68706a!important;
}
.book-price{
    color:#277532!important;
    font-weight:650;
    white-space:nowrap;
}
.stock{
    display:inline-flex;
    justify-content:center;
    min-width:34px;
    padding:4px 8px;
    border-radius:6px;
    background:#edf7ef;
    color:#31813d;
    font-size:12px;
    font-weight:600;
}
.stock-empty{
    background:#fff0f0;
    color:#c13e3e;
}
.actions{
    display:flex;
    justify-content:flex-end;
    gap:7px;
    white-space:nowrap;
}
.btn-edit,
.btn-remove{
    min-height:34px;
    padding:0 11px;
    border-radius:7px;
    font-family:inherit;
    font-size:11px;
    font-weight:600;
    text-transform:uppercase;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s;
}
.btn-edit{
    border:1px solid #318a3e;
    background:#fff;
    color:#318a3e;
}
.btn-edit:hover{
    background:#f1f8f2;
    border-color:#277532;
    color:#277532;
    transform:translateY(-1px);
}
.btn-remove{
    border:1px solid #e1cccc;
    background:#fff;
    color:#c13e3e;
}
.btn-remove:hover{
    border-color:#d65a5a;
    background:#fff5f5;
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
    margin:60px auto;
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
    font-size:22px;
}
.empty p{
    margin:0 0 22px;
    color:#68706a;
    font-size:14px;
}
.modal-overlay{
    position:fixed;
    z-index:1000;
    inset:0;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:20px;
    box-sizing:border-box;
    background:rgba(25,30,26,.42);
    backdrop-filter:blur(3px);
    animation:overlayAppear .2s ease;
}
.modal{
    width:100%;
    max-width:500px;
    max-height:calc(100vh - 40px);
    overflow:auto;
    padding:28px;
    box-sizing:border-box;
    border:1px solid #e1e4e1;
    border-radius:15px;
    background:#fff;
    box-shadow:0 20px 60px rgba(0,0,0,.16);
    animation:modalAppear .25s ease;
}
.modal-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:20px;
    margin-bottom:24px;
}
.modal-header h2{
    margin:0 0 5px;
    color:#202522;
    font-size:21px;
    font-weight:700;
}
.modal-header p{
    margin:0;
    color:#68706a;
    font-size:12px;
}
.modal-close{
    display:flex;
    justify-content:center;
    align-items:center;
    width:30px;
    height:30px;
    padding:0;
    border:0;
    border-radius:7px;
    background:#f2f4f2;
    color:#68706a;
    font-size:21px;
    line-height:1;
    cursor:pointer;
    transition:background .2s,color .2s,transform .2s;
}
.modal-close:hover{
    background:#e9ece9;
    color:#202522;
    transform:rotate(90deg);
}
.form-group{
    display:flex;
    flex-direction:column;
    gap:7px;
    margin-bottom:16px;
}
.form-group label{
    color:#303631;
    font-size:13px;
    font-weight:600;
}
.form-group input,
.form-group select,
.form-group textarea{
    width:100%;
    box-sizing:border-box;
    padding:11px 12px;
    border:1px solid #cfd5d0;
    border-radius:8px;
    outline:none;
    background:#fff;
    color:#202522;
    font-family:inherit;
    font-size:13px;
    transition:border-color .2s,box-shadow .2s;
}
.form-group textarea{
    min-height:85px;
    resize:vertical;
}
.form-group input::placeholder,
.form-group textarea::placeholder{
    color:#9aa19c;
}
.form-group input:hover,
.form-group select:hover,
.form-group textarea:hover{
    border-color:#aab2ac;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.form-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:14px;
}
.form-actions{
    display:flex;
    justify-content:flex-end;
    gap:9px;
    margin-top:23px;
    padding-top:18px;
    border-top:1px solid #e7e9e7;
}
.btn-cancel,
.btn-submit{
    min-height:41px;
    padding:0 17px;
    border-radius:8px;
    font-family:inherit;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s,box-shadow .2s;
}
.btn-cancel{
    border:1px solid #d5dad6;
    background:#fff;
    color:#68706a;
}
.btn-cancel:hover{
    background:#f5f6f4;
    color:#303631;
    transform:translateY(-1px);
}
.btn-submit{
    border:1px solid #318a3e;
    background:#318a3e;
    color:#fff;
}
.btn-submit:hover{
    border-color:#277532;
    background:#277532;
    transform:translateY(-1px);
    box-shadow:0 5px 14px rgba(49,138,62,.18);
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
@keyframes overlayAppear{
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
@keyframes spin{
    to{
        transform:rotate(360deg);
    }
}
@media(max-width:800px){
    .admin-page{
        padding:30px 15px 45px;
    }
    .books-table-wrapper{
        overflow-x:auto;
    }
    .books-table{
        min-width:800px;
    }
}
@media(max-width:600px){
    .admin-page{
        padding:25px 12px 40px;
    }
    .admin-header{
        align-items:flex-start;
    }
    .admin-header h1{
        font-size:24px;
    }
    .admin-header p{
        font-size:12px;
    }
    .btn-add{
        min-height:40px;
        padding:0 13px;
        font-size:12px;
    }
    .modal{
        padding:22px;
        border-radius:13px;
    }
}
@media(max-width:450px){
    .form-row{
        grid-template-columns:1fr;
        gap:0;
    }
    .form-actions{
        flex-direction:column-reverse;
    }
    .btn-cancel,
    .btn-submit{
        width:100%;
    }
}
@media(prefers-reduced-motion:reduce){
    .admin-header,
    .books-table-wrapper,
    .empty,
    .modal-overlay,
    .modal{
        animation:none;
    }
    .btn-add,
    .btn-edit,
    .btn-remove,
    .modal-close,
    .btn-cancel,
    .btn-submit{
        transition:none;
    }
}
</style>