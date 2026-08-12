import {defineStore} from 'pinia'
import type { StringMappingType } from 'typescript'
import {ref} from 'vue'

interface User{
    id:number,
    name:string,
    email:string,
    role:string
}

export const useAuthStore=defineStore('auth',()=>{
    const isAuthenticated=ref(false)
    const isAdmin=ref(false)
    const user=ref<User|null>(null)

    const checkAuth=()=>{
        const token=localStorage.getItem('token')
        const userData=localStorage.getItem('user')

        isAuthenticated.value=!!token

        if(token&&userData){
            try{
                user.value=JSON.parse(userData)
                isAdmin.value=user.value?.role==='admin'
            }catch(error){isAdmin.value=false}
        }else{
            isAdmin.value=false
            user.value=null
        }
    }

    const logout=()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        isAuthenticated.value=false
        isAdmin.value=false
        user.value=null
    }
    return {isAuthenticated,isAdmin,user,checkAuth,logout}
})