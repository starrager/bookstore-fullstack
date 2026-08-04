import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '../api/api'



export const useFavoritesStore=defineStore('favorites',()=>{
    const books=ref([])
    const loading=ref(false)

    const getFavorites=async()=>{
        loading.value=true
        try{
            const response=await api.get('/api/favorites')
            books.value=response.data||[]

        }catch(error){
            console.error(error)
            throw error
        }finally{loading.value=false}
    }

    const addFavorite=async(bookId:Number)=>{
        try{
            await api.post('/api/favorites',{bookId})
            await getFavorites()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    const removeFavorite=async(bookId:Number)=>{
        try{
            await api.delete(`/api/favorites/${bookId}`)
            await getFavorites()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    const isFavorite=async(bookId:Number)=>{
        try{
            const response=await api.get(`/api/favorites/check/${bookId}`)
            return response.data.isFavorite
        }catch(error){
            console.error(error)
            return false
        }
    }
    return {books,loading,getFavorites,addFavorite,removeFavorite,isFavorite}
})