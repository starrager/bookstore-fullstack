<template>
    <header class="header">
        <div class="header-inner">
            <button class="logo" @click="router.push('/')">
                <span class="logo-mark">B</span>
                <span class="logo-text">BookStore</span>
            </button>

            <nav class="navigation">
                <button class="nav-button" @click="router.push('/books')">
                    Books
                </button>

                <button class="nav-button" @click="router.push('/favorites')">
                    Favorites
                </button>

                <button class="nav-button" @click="router.push('/orders')">
                    Orders
                </button>

                <button class="nav-button cart-button" @click="router.push('/cart')">
                    Cart
                </button>

                <button v-if="isAdmin" class="nav-button admin-button" @click="router.push('/admin/books')">
                    Admin
                </button>

                <button v-if="isAuthenticated" class="nav-button" @click="router.push('/profile')">
                    Profile
                </button>

            </nav>

            <button v-if="isAuthenticated" class="logout-button" @click="logout">
                Exit
            </button>

            <button v-else class="register" @click="router.push('/register')">
                Register
            </button>
        </div>
    </header>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {useToast} from '@erag/vue-toastification'
import {ref,onMounted} from 'vue'
import { useAuthStore } from '@/stores/auth'
import {storeToRefs} from 'pinia'

const toast=useToast()
const router=useRouter()
const authStore=useAuthStore()
const front=ref(false)
const {isAuthenticated,isAdmin}=storeToRefs(authStore)

const checkAuth=()=>{
    const token=localStorage.getItem('token')
    const userData=localStorage.getItem('user')

    isAuthenticated.value=!!token

    if(token&&userData){
        const user=JSON.parse(userData)
        isAdmin.value=user.role==='admin'
    }else isAdmin.value=false
}

const logout=async()=>{
    if(confirm('Do you really want to log out of your account?')){
        authStore.logout()
        toast.success('Left success')
        router.push('/login')
    }else{
        toast.error('Error, please repeat later')
    }
}

onMounted(checkAuth)
</script>

<style scoped>
.header{
    width:100%;
    box-sizing:border-box;
    padding:0 10px;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    flex-shrink:0;
}
.header-inner{
    position:relative;
    display:flex;
    align-items:center;
    width:100%;
    max-width:1150px;
    min-height:60px;
    box-sizing:border-box;
    margin:10px auto;
    padding:6px 14px;
    overflow:hidden;
    border:1px solid #dfe5df;
    border-radius:16px;
    background:rgba(255,255,255,.96);
    box-shadow:0 6px 24px rgba(31,61,37,.08);
    transition:box-shadow .3s,transform .3s;
}
.header-inner::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:3px;
    background:linear-gradient(90deg,#277b34,#5aae68,#277b34);
}
.header-inner:hover{
    box-shadow:0 10px 30px rgba(31,61,37,.11);
    transform:translateY(-1px);
}
.logo{
    display:flex;
    align-items:center;
    gap:11px;
    margin-right:45px;
    padding:6px;
    border:0;
    background:transparent;
    color:#202522;
    font-family:inherit;
    cursor:pointer;
}
.logo-mark{
    display:flex;
    justify-content:center;
    align-items:center;
    width:42px;
    height:42px;
    border-radius:11px;
    background:linear-gradient(135deg,#318a3e,#246f30);
    color:#fff;
    font-size:20px;
    font-weight:800;
    box-shadow:0 5px 12px rgba(49,138,62,.22);
    transition:transform .25s,box-shadow .25s;
}
.logo:hover .logo-mark{
    transform:rotate(-4deg) scale(1.05);
    box-shadow:0 7px 16px rgba(49,138,62,.3);
}
.logo-text{
    color:#202522;
    font-size:21px;
    font-weight:750;
    letter-spacing:-.5px;
}
.navigation{
    display:flex;
    align-items:center;
    gap:5px;
    flex:1;
}
.nav-button{
    position:relative;
    padding:12px 16px;
    border:0;
    border-radius:9px;
    background:transparent;
    color:#444c46;
    font-family:inherit;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,color .2s,transform .2s;
}
.nav-button::after{
    content:"";
    position:absolute;
    right:14px;
    bottom:4px;
    left:14px;
    height:2px;
    border-radius:2px;
    background:#318a3e;
    transform:scaleX(0);
    transform-origin:center;
    transition:transform .2s;
}
.nav-button:hover{
    background:#f1f7f2;
    color:#277b34;
    transform:translateY(-1px);
}
.nav-button:hover::after{
    transform:scaleX(1);
}
.nav-button:active{
    transform:scale(.97);
}
.cart-button{
    color:#277b34;
    font-weight:700;
}
.admin-button{
    color:#7357a5;
}
.admin-button:hover{
    background:#f5f1fa;
    color:#62478f;
}
.admin-button::after{
    background:#7357a5;
}
.logout-button{
    margin-left:12px;
    padding:11px 17px;
    border:1px solid #ead6d6;
    border-radius:9px;
    background:#fffafa;
    color:#b53a3a;
    font-family:inherit;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s;
}
.logout-button:hover{
    border-color:#e4bcbc;
    background:#fff1f1;
    color:#a52f2f;
    transform:translateY(-1px);
}
.logout-button:active{
    transform:scale(.97);
}
.register{
    margin-left:12px;
    padding:11px 17px;
    border:1px solid #ead6d6;
    border-radius:9px;
    background:#fffafa;
    color:rgb(17, 143, 17);
    font-family:inherit;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .2s;
}
.register:hover{
    border-color:#e4bcbc;
    background:#fff1f1;
    color:green;
    transform:translateY(-1px);
}
.register:active{
    transform:scale(.97);
}
@media(max-width:900px){
    .header-inner{
        max-width:100%;
    }
    .logo{
        margin-right:20px;
    }
    .logo-text{
        font-size:18px;
    }
    .nav-button{
        padding:11px 12px;
        font-size:14px;
    }
}
@media(max-width:700px){
    .header{
        padding:0 10px;
    }
    .header-inner{
        min-height:64px;
        margin:10px auto;
        padding:8px 10px;
        overflow-x:auto;
    }
    .logo{
        margin-right:12px;
    }
    .logo-text{
        display:none;
    }
    .navigation{
        flex:none;
    }
    .nav-button{
        padding:10px 11px;
        font-size:13px;
    }
    .logout-button{
        margin-left:6px;
        padding:10px 12px;
        font-size:13px;
    }
    .register-button{
        margin-left:6px;
        padding:10px 12px;
        font-size:13px;
    }
}
</style>