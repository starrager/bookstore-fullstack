<template>

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
const showdEditModal=ref(false)

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
        const response=await api.get('/api/books')
        books.value=response.data.books||response.data||[]
    }catch(error){toast.error('Error loading books')}
    finally{loading.value=false}
}

const fetchCategories=async()=>{
    loading.value=true
    try{
        const response=await api.get('/api/categories')
        categories.value=response.data

    }catch(error){toast.error('Error loading categories: ',error)}
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
    showdEditModal.value=true
}

const closeModal=()=>{
    showCreateModal.value=false
    showdEditModal.value=false
}

const createBook=async()=>{
    try{
        const data={
            ...createFrom.value,
            price:Number(createForm.value.price),
            stock:Number(createForm.value.stock),
            categoryId:createForm.value.categoryId?Number(createFrom.value.categoryId):undefined
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

const deleteBook=async()=>{
    if(!confirm('Remove book?'))retrun
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
    max-width:1100px;
    margin:40px auto;
    padding:0 20px;
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