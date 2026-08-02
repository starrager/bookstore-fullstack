import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '../api/api'

interface CartItem{
    id:number,
    quantity:number,
    book:{
        id:number,
        title:string,
        author:string,
        price:number,
        description?:string,
        coverId?:number
    }
}

export const useCartStore=defineStore('cart',()=>{
    const items=ref<CartItem[]>([])
    const loading=ref(false)

    const getCart=async()=>{
        loading.value=true
        try{
            const response=await api.get('/api/cart')
            items.value=response.data.items||[]

        }catch(error){console.error(error)}
        finally{loading.value=false}
    }

    const addToCart=async(bookId:Number,quantity=1)=>{
        try{
            await api.post('/api/cart/add',{bookId,quantity})
            await getCart()
        }catch(error){
            console.error(error)
            throw error
        }
    }

    const removeFromCart=async(itemId:Number)=>{
        try{
            await api.delete(`/api/cart/item/${itemId}`)
            await getCart()

        }catch(error){
            console.error(error)
            throw error
        }
    }

    const clearCart=async()=>{
        try{
            await api.delete('/api/cart/clear')
            await getCart()

        }catch(error){
            console.error(error)
            throw error
        }
    }

    const totalPrice=async()=>{
        return items.value.reduce((sum,item)=>{
            return sum+(item.book.price*item.quantity)
        },0)
    }

    const totalItems=()=>{
        return items.value.reduce((sum,item)=>sum+item.quantity,0)
    }

    return {items,loading,getCart,addToCart,removeFromCart,clearCart,totalPrice,totalItems}
})