<template>
    <div class="admin-books">
        <div class="admin-header">
            <h1>Book Management</h1>
            <button class="btn-create" @click="openCreateModal">+ Add Book</button>
        </div>
        
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="books.length===0">No books yet</div>

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
                    <tr v-for="book in books":key="book.id">
                        <td>{{ book.id }}</td>
                        <td>{{ book.title }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ book.price }} ₽</td>
                        <td>{{ book.stock }}</td>
                        <td class="actions">
                            <button class="btn-edit" @click="openEditModal(book)">EDIT</button>
                            <button class="btn-remove" @click="deleteBook(book.id)">REMOVE</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <h2>Add Book</h2>
                <form @submit.prevent="createBook">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" v-model="createForm.title" required>
                    </div>
                    <div class="form-group">
                        <label>Author *</label>
                        <input type="text" v-model="createForm.author" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                        <label>Price *</label>
                        <input type="number" v-model="createForm.price" required min="0">
                    </div>
                    <div class="form-group">
                        <label>Stock *</label>
                        <input type="number" v-model="createForm.stock" required min="0">
                    </div>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select v-model="createForm.categoryId">
                            <option value="">No Category</option>
                            <option v-for="cat in categories":key="cat.id" :value="cat.id">{{cat.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="createForm.description" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-submit">Create</button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showEditModal" class="modal-overlay" @mousedown="(e)=>{
            if(e.target===e.currentTarget)dragStart=true
        }"
        @mouseup="(e)=>{
            if(e.target===e.currentTarget&&dragStart)closeModal()
            dragStart=false
        }">
            <div class="modal">
                <h2>Edit Book</h2>
                <form @submit.prevent="updateBook">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" v-model="editForm.title" required>
                    </div>
                    <div class="form-group">
                        <label>Author *</label>
                        <input type="text" v-model="editForm.author" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                        <label>Price *</label>
                        <input type="number" v-model="editForm.price" required min="0">
                    </div>
                    <div class="form-group">
                        <label>Stock *</label>
                        <input type="number" v-model="editForm.stock" required min="0">
                    </div>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select v-model="editForm.categoryId">
                            <option value="">No Category</option>
                            <option v-for="cat in categories":key="cat.id" :value="cat.id">{{cat.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea v-model="editForm.description" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-submit">Save</button>
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
        const response=await api.get('/api/books?limit=1000')
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

onMounted(async()=>{
    await fetchCategories()
    await fetchBooks()
})
</script>

<style scoped>
.admin-books{
    max-width:75% !important;
    margin:0 auto !important;
    padding:0 20px !important;
}
.admin-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:30px;
}
.admin-header h1{
    margin:0;
    font-size:28px;
}
.btn-create{
    padding:10px 24px;
    background:#2e7d32;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-size:16px;
}
.btn-create:hover{
    background:#1e5a22;
}
.books-table-wrapper{
    overflow-x:auto;
}
.books-table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 2px 8px rgba(0,0,0,0.06);
}
.books-table th{
    background:#f5f5f5;
    text-align:left;
    padding:12px 16px;
    font-weight:600;
}
.books-table td{
    padding:10px 16px;
    border-bottom:1px solid #eee;
}
.actions{
    display:flex;
    gap:8px;
}
.actions button{
    padding:6px 12px;
    border:none;
    border-radius:6px;
    cursor:pointer;
    font-size:16px;
}
.btn-edit{
    background:#ffc107;
    color:#333;
}
.btn-edit:hover{
    background:#e0a800;
}
.btn-delete{
    background:#e74c3c;
    color:white;
}
.btn-delete:hover{
    background:#c0392b;
}
.loading,.empty{
    text-align:center;
    padding:60px 0;
    color:#999;
}

.modal-overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.5);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:1000;
}
.modal{
    background:white;
    padding:30px;
    border-radius:16px;
    max-width:550px;
    width:90%;
    max-height:90vh;
    overflow-y:auto;
}
.modal h2{
    margin-top:0;
}
.form-group{
    margin-bottom:14px;
}
.form-group label{
    display:block;
    margin-bottom:4px;
    font-weight:500;
}
.form-group input,
.form-group select,
.form-group textarea{
    width:100%;
    padding:8px 12px;
    border:1px solid #ccc;
    border-radius:6px;
    font-size:15px;
}
.form-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
}
.form-actions{
    display:flex;
    gap:12px;
    justify-content:flex-end;
    margin-top:16px;
}
.btn-cancel{
    padding:8px 20px;
    background:#e0e0e0;
    border:none;
    border-radius:6px;
    cursor:pointer;
}
.btn-submit{
    padding:8px 20px;
    background:#2e7d32;
    color:white;
    border:none;
    border-radius:6px;
    cursor:pointer;
}
.btn-submit:hover{
    background:#1e5a22;
}
</style>