<template>
    <div class="auth-page">
        <div class="auth-card register-card">
            <div class="auth-brand">
                <span class="brand-mark">B</span>
                <span>BookStore</span>
            </div>

            <div class="auth-header">
                <h1>Create account</h1>
                <p>Create your account and start discovering new books</p>
            </div>

            <form @submit.prevent="checkPassword" class="auth-form" novalidate>
                <div class="input-group">
                    <label for="name">Nickname</label>
                    <input
                        id="name"
                        type="text"
                        v-model="name"
                        placeholder="Enter your nickname"
                        autocomplete="username"
                        required
                    >
                </div>

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
                    <label for="password">Password</label>

                    <input
                        id="password"
                        type="password"
                        v-model="password1"
                        placeholder="Create a password"
                        autocomplete="new-password"
                        required
                    >

                    <div v-if="password1" class="password-strength">
                        <div class="strength-header">
                            <span>Password strength</span>
                            <strong :class="strengthClass">
                                {{ strengthText }}
                            </strong>
                        </div>

                        <div class="strength-bar">
                            <div
                                class="strength-fill"
                                :class="strengthClass"
                                :style="{width:strengthPercent+'%'}"
                            ></div>
                        </div>

                        <div class="password-rules">
                            <div :class="{valid:passwordLength}">
                                <span>{{ passwordLength?'✓':'○' }}</span>
                                At least 8 characters
                            </div>

                            <div :class="{valid:passwordUpper}">
                                <span>{{ passwordUpper?'✓':'○' }}</span>
                                One uppercase letter
                            </div>

                            <div :class="{valid:passwordNumber}">
                                <span>{{ passwordNumber?'✓':'○' }}</span>
                                One number
                            </div>

                            <div :class="{valid:passwordSpecial}">
                                <span>{{ passwordSpecial?'✓':'○' }}</span>
                                One special character
                            </div>
                        </div>
                    </div>
                </div>

                <div class="input-group">
                    <label for="password2">Confirm password</label>

                    <input
                        id="password2"
                        type="password"
                        v-model="password2"
                        placeholder="Repeat your password"
                        autocomplete="new-password"
                        required
                        :class="{
                            'input-error':password2&&!passwordMatch,
                            'input-success':password2&&passwordMatch
                        }"
                    >

                    <span
                        v-if="password2&&!passwordMatch"
                        class="field-error"
                    >
                        Passwords do not match
                    </span>

                    <span
                        v-if="password2&&passwordMatch"
                        class="field-success"
                    >
                        Passwords match
                    </span>
                </div>

                <button
                    type="submit"
                    class="auth-button"
                    :disabled="loading"
                >
                    <span v-if="!loading">Create account</span>

                    <span v-else class="loading-content">
                        <span class="spinner"></span>
                        Creating account...
                    </span>
                </button>
            </form>

            <div class="auth-divider">
                <span>Already have an account?</span>
            </div>

            <router-link to="/login" class="secondary-button">
                Sign in
            </router-link>

            <p class="auth-footer">
                By creating an account, you agree to our
                <a href="#">Terms of Service</a>
                and
                <a href="#">Privacy Policy</a>.
            </p>
        </div>
    </div>
</template>

<script setup>
import {ref,computed} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import {useToast} from '@erag/vue-toastification'

const toast=useToast()
const router=useRouter()

const name=ref('')
const email=ref('')
const password1=ref('')
const password2=ref('')
const loading=ref(false)

const passwordLength=computed(()=>{
    return password1.value.length>=8
})

const passwordUpper=computed(()=>{
    return /[A-Z]/.test(password1.value)
})

const passwordNumber=computed(()=>{
    return /\d/.test(password1.value)
})

const passwordSpecial=computed(()=>{
    return /[^A-Za-z0-9]/.test(password1.value)
})

const passwordScore=computed(()=>{
    return [
        passwordLength.value,
        passwordUpper.value,
        passwordNumber.value,
        passwordSpecial.value
    ].filter(Boolean).length
})

const strengthText=computed(()=>{
    if(passwordScore.value<=1)return 'Weak'
    if(passwordScore.value<=2)return 'Medium'
    if(passwordScore.value===3)return 'Good'
    return 'Strong'
})

const strengthClass=computed(()=>{
    if(passwordScore.value<=1)return 'weak'
    if(passwordScore.value<=2)return 'medium'
    if(passwordScore.value===3)return 'good'
    return 'strong'
})

const strengthPercent=computed(()=>{
    return passwordScore.value*25
})

const passwordMatch=computed(()=>{
    return password1.value===password2.value
})

const checkPassword=async()=>{
    if(!name.value||!email.value||!password1.value||!password2.value){
        toast.warning('Please fill in all fields')
        return
    }

    if(password1.value.length<8){
        toast.warning('Password must contain at least 8 characters')
        return
    }

    if(!passwordMatch.value){
        toast.warning('The passwords do not match')
        return
    }

    if(passwordScore.value<3){
        toast.warning('Please create a stronger password')
        return
    }

    await register()
}

const register=async()=>{
    loading.value=true

    try{
        const response=await axios.post('http://localhost:5178/api/auth/register',{
            name:name.value,
            email:email.value,
            password:password1.value
        })

        if(response.data.token){
            localStorage.setItem('token',response.data.token)
            localStorage.setItem('user',JSON.stringify(response.data.user))
        }

        toast.success('Registration is successful')

        name.value=''
        email.value=''
        password1.value=''
        password2.value=''

        router.push('/books')
    }catch(error){
        console.error(error)
        toast.error(error.response?.data?.error||'Registration error')
    }finally{
        loading.value=false
    }
}
</script>

<style scoped>
.auth-page{
    min-height:calc(100vh  - 80px);
    display:flex;
    justify-content:center;
    align-items:center;
    padding:45px 20px;
    background:#f5f6f4;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.auth-card{
    width:100%;
    max-width:400px;
    box-sizing:border-box;
    padding:38px 40px;
    border:1px solid #e1e4e1;
    border-radius:16px;
    background:#fff;
    box-shadow:0 10px 30px rgba(0,0,0,.07);
    animation:cardAppear .35s ease;
}
.register-card{
    max-width:420px;
}
.auth-brand{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:9px;
    margin-bottom:25px;
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
    margin-bottom:25px;
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
    gap:16px;
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
.input-group input.input-error{
    border-color:#d64545;
    box-shadow:0 0 0 3px rgba(214,69,69,.08);
}
.input-group input.input-success{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.08);
}
.password-strength{
    padding:12px;
    border:1px solid #e2e5e2;
    border-radius:9px;
    background:#fafbfa;
}
.strength-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:8px;
    color:#68706a;
    font-size:12px;
}
.strength-header strong{
    font-size:12px;
}
.weak{
    color:#d43d3d;
}
.medium{
    color:#c28b00;
}
.good{
    color:#688d27;
}
.strong{
    color:#27823a;
}
.strength-bar{
    width:100%;
    height:5px;
    overflow:hidden;
    border-radius:5px;
    background:#e4e7e4;
}
.strength-fill{
    height:100%;
    border-radius:5px;
    transition:width .25s,background .25s;
}
.strength-fill.weak{
    background:#d43d3d;
}
.strength-fill.medium{
    background:#d7a400;
}
.strength-fill.good{
    background:#7da32e;
}
.strength-fill.strong{
    background:#2d9843;
}
.password-rules{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:6px 12px;
    margin-top:10px;
}
.password-rules div{
    color:#737b75;
    font-size:11px;
    line-height:1.4;
}
.password-rules div span{
    display:inline-block;
    width:14px;
    color:#929992;
}
.password-rules div.valid{
    color:#397844;
}
.password-rules div.valid span{
    color:#318a3e;
}
.field-error{
    color:#c93636;
    font-size:12px;
}
.field-success{
    color:#31813d;
    font-size:12px;
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
    margin:22px 0 14px;
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
    .password-rules{
        grid-template-columns:1fr;
    }
}
</style>