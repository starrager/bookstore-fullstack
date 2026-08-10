<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-brand">
                <span class="brand-mark">B</span>
                <span>BookStore</span>
            </div>

            <div class="auth-header">
                <h1>Welcome back</h1>
                <p>Sign in to your account to continue</p>
            </div>

            <form @submit.prevent="login" class="auth-form" novalidate>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        v-model="email"
                        placeholder="your@email.com"
                        autocomplete="email"
                        required
                    >
                </div>

                <div class="input-group">
                    <div class="label-row">
                        <label for="password">Password</label>
                        <span class="input-hint">Your account password</span>
                    </div>

                    <input
                        id="password"
                        type="password"
                        v-model="password"
                        placeholder="Enter your password"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <button
                    type="submit"
                    class="auth-button"
                    :disabled="loading"
                >
                    <span v-if="!loading">Sign in</span>
                    <span v-else class="loading-content">
                        <span class="spinner"></span>
                        Signing in...
                    </span>
                </button>
            </form>

            <div class="auth-divider">
                <span>Dont have an account?</span>
            </div>

            <router-link to="/register" class="secondary-button">
                Create an account
            </router-link>

            <p class="auth-footer">
                By continuing, you agree to our
                <a href="#">Terms of Service</a>
                and
                <a href="#">Privacy Policy</a>.
            </p>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import {useCartStore} from '@/stores/cart'
import {useToast} from '@erag/vue-toastification'

const toast=useToast()
const cartStore=useCartStore()
const router=useRouter()

const email=ref('')
const password=ref('')
const loading=ref(false)

const login=async()=>{
    if(!email.value||!password.value){
        toast.warning('Please fill in all fields')
        return
    }

    loading.value=true

    try{
        const response=await axios.post('http://localhost:5178/api/auth/login',{
            email:email.value,
            password:password.value
        })

        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))

        await cartStore.getCart()

        toast.success('Authorization successful')
        router.push('/')
    }catch(error){
        console.error(error)
        toast.error(error.response?.data?.error||'Authorization error')
    }finally{
        loading.value=false
    }
}
</script>

<style scoped>
.auth-page{
    min-height:calc(100vh - 80px);
    display:flex;
    justify-content:center;
    align-items:center;
    padding:50px 20px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.auth-card{
    width:100%;
    max-width:400px;
    box-sizing:border-box;
    padding:40px;
    border:1px solid #e1e4e1;
    border-radius:16px;
    background:#fff;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
    animation:cardAppear .35s ease;
}
.auth-brand{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:9px;
    margin-bottom:28px;
    color:#277b34;
    font-size:20px;
    font-weight:700;
}
.brand-mark{
    display:flex;
    justify-content:center;
    align-items:center;
    width:34px;
    height:34px;
    border-radius:8px;
    background:#277b34;
    color:#fff;
    font-size:18px;
    font-weight:700;
}
.auth-header{
    margin-bottom:28px;
    text-align:center;
}
.auth-header h1{
    margin:0 0 8px;
    color:#202522;
    font-size:28px;
    font-weight:700;
    letter-spacing:-.4px;
}
.auth-header p{
    margin:0;
    color:#68706a;
    font-size:14px;
    line-height:1.5;
}
.auth-form{
    display:flex;
    flex-direction:column;
    gap:19px;
}
.input-group{
    display:flex;
    flex-direction:column;
    gap:8px;
}
.input-group label{
    color:#303631;
    font-size:14px;
    font-weight:600;
}
.label-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
}
.input-hint{
    color:#737b75;
    font-size:12px;
}
.input-group input{
    width:100%;
    box-sizing:border-box;
    padding:13px 14px;
    border:1px solid #cfd5d0;
    border-radius:9px;
    outline:none;
    background:#fff;
    color:#202522;
    font-family:inherit;
    font-size:14px;
    transition:border-color .2s,box-shadow .2s;
}
.input-group input::placeholder{
    color:#9aa19c;
}
.input-group input:hover{
    border-color:#aab2ac;
}
.input-group input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.1);
}
.auth-button{
    width:100%;
    min-height:47px;
    margin-top:3px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.auth-button:hover:not(:disabled){
    background:#277532;
    transform:translateY(-1px);
    box-shadow:0 6px 16px rgba(49,138,62,.2);
}
.auth-button:active:not(:disabled){
    transform:translateY(0);
}
.auth-button:disabled{
    opacity:.65;
    cursor:not-allowed;
}
.loading-content{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
}
.spinner{
    width:14px;
    height:14px;
    border:2px solid rgba(255,255,255,.4);
    border-top-color:#fff;
    border-radius:50%;
    animation:spin .7s linear infinite;
}
.auth-divider{
    display:flex;
    align-items:center;
    gap:10px;
    margin:24px 0 14px;
    color:#68706a;
    font-size:13px;
}
.auth-divider::before,
.auth-divider::after{
    content:"";
    flex:1;
    height:1px;
    background:#e1e4e1;
}
.secondary-button{
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:45px;
    box-sizing:border-box;
    border:1px solid #318a3e;
    border-radius:9px;
    color:#277532;
    font-size:14px;
    font-weight:600;
    text-decoration:none;
    transition:background .2s,border-color .2s;
}
.secondary-button:hover{
    background:#f1f8f2;
    border-color:#277532;
}
.auth-footer{
    margin:20px 0 0;
    color:#68706a;
    text-align:center;
    font-size:12px;
    line-height:1.6;
}
.auth-footer a{
    color:#277532;
    font-weight:600;
    text-decoration:none;
}
.auth-footer a:hover{
    text-decoration:underline;
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
@media(max-width:500px){
    .auth-page{
        padding:30px 15px;
    }
    .auth-card{
        padding:30px 22px;
    }
}
</style>