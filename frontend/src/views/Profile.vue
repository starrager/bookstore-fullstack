<template>
    <div class="profile-container">
        <div class="profile-decoration decoration-one"></div>
        <div class="profile-decoration decoration-two"></div>

        <div class="profile-card">
            <div class="profile-header">
                <div>
                    <span class="profile-label">ACCOUNT</span>
                    <h1>Profile</h1>
                    <p>Manage your personal information and password.</p>
                </div>
            </div>

            <div v-if="loading" class="loading">Loading...</div>

            <div v-else>
                <div class="form-section">
                    <h2>Personal information</h2>

                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" v-model="form.name">
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" v-model="form.email">
                    </div>

                    <button class="btn-save" @click="updateProfile">
                        <span>Save changes</span>
                        <span class="button-arrow">→</span>
                    </button>
                </div>

                <div class="divider"></div>

                <div class="form-section password-section">
                    <div class="section-title">
                        <div>
                            <span class="section-label">SECURITY</span>
                            <h2>Change password</h2>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Current password</label>
                        <input type="password" v-model="passwordForm.currentPassword">
                    </div>

                    <div class="form-group">
                        <label>New password</label>
                        <input type="password" v-model="passwordForm.newPassword">
                    </div>

                    <button class="btn-password" @click="updatePassword">
                        <span>Change password</span>
                        <span class="button-arrow">→</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api'
import { useToast } from '@erag/vue-toastification'

const toast=useToast()
const loading=ref(true)

const form=ref({
    name:'',
    email:'',
    role:''
})

const passwordForm=ref({
    currentPassword: '',
    newPassword: ''
})

const fetchProfile=async()=>{
    loading.value=true
    try{
        const response=await api.get('/users/me')
        form.value={
            name:response.data.name||'',
            email:response.data.email||'',
            role:response.data.role||''
        }
    }catch(error){
        toast.error('Error loading profile')
        console.error(error)
    }finally{
        loading.value=false
    }
}

const updateProfile=async()=>{
    try{
        await api.put('/users/me', {
            name: form.value.name,
            email: form.value.email
        })
        toast.success('Profile updated')

        const userData=localStorage.getItem('user')
        if(userData){
            const user=JSON.parse(userData)
            user.name=form.value.name
            user.email=form.value.email
            localStorage.setItem('user',JSON.stringify(user))
        }
    }catch(error){
        toast.error(error.response?.data?.error||'Error updating profile')
        console.error(error)
    }
}

const updatePassword=async()=>{
    try{
        if(!passwordForm.value.currentPassword||!passwordForm.value.newPassword) {
            toast.warning('Please fill in all fields')
            return
        }
        await api.put('/users/me/password',{
            currentPassword:passwordForm.value.currentPassword,
            newPassword:passwordForm.value.newPassword
        })
        toast.success('Password changed')
        passwordForm.value.currentPassword=''
        passwordForm.value.newPassword=''
    } catch(error){
        console.error('error:',error.response?.data)
        toast.error(error.response?.data?.error||'Error changing password')
        console.error(error)
    }
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-container{
    position:relative;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    min-height:80vh;
    padding:35px 20px 80px;
    box-sizing:border-box;
    overflow:hidden;
}
.profile-container::before{
    content:"";
    position:absolute;
    top:50px;
    left:50%;
    width:600px;
    height:600px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(49,138,62,.07) 0%,rgba(49,138,62,0) 70%);
    transform:translateX(-50%);
    pointer-events:none;
}
.profile-decoration{
    position:absolute;
    border:1px solid rgba(49,138,62,.08);
    border-radius:50%;
    pointer-events:none;
}
.decoration-one{
    width:420px;
    height:420px;
    top:-180px;
    right:-150px;
    animation:decoration-float 8s ease-in-out infinite;
}
.decoration-two{
    width:300px;
    height:300px;
    bottom:-150px;
    left:-130px;
    animation:decoration-float 10s 1s ease-in-out infinite reverse;
}
.profile-card{
    position:relative;
    z-index:2;
    width:100%;
    max-width:560px;
    padding:38px;
    box-sizing:border-box;
    border:1px solid rgba(221,228,222,.9);
    border-radius:20px;
    background:rgba(255,255,255,.94);
    box-shadow:0 20px 60px rgba(31,61,37,.09);
    backdrop-filter:blur(12px);
    animation:profile-enter .6s ease both;
}
.profile-card::before{
    content:"";
    position:absolute;
    top:0;
    left:10%;
    width:80%;
    height:3px;
    border-radius:0 0 5px 5px;
    background:linear-gradient(90deg,#277b34,#65b873);
    box-shadow:0 0 18px rgba(49,138,62,.25);
}
.profile-header{
    margin-bottom:35px;
}
.profile-label,
.section-label{
    display:block;
    margin-bottom:8px;
    color:#318a3e;
    font-size:10px;
    font-weight:800;
    letter-spacing:2.5px;
}
.profile-header h1{
    margin:0 0 8px;
    color:#202522;
    font-size:36px;
    line-height:1.1;
    letter-spacing:-1.3px;
}
.profile-header p{
    margin:0;
    color:#7a827c;
    font-size:14px;
    line-height:1.6;
}
.form-section h2{
    margin:0 0 22px;
    color:#252a27;
    font-size:19px;
    letter-spacing:-.3px;
}
.form-group{
    margin-bottom:18px;
}
.form-group label{
    display:block;
    margin-bottom:7px;
    color:#4d554f;
    font-size:12px;
    font-weight:700;
}
.form-group input{
    width:100%;
    height:46px;
    padding:0 14px;
    box-sizing:border-box;
    border:1px solid #d9dedb;
    border-radius:9px;
    outline:none;
    background:#fff;
    color:#252a27;
    font-family:inherit;
    font-size:14px;
    transition:border-color .25s,box-shadow .25s,transform .25s;
}
.form-group input:hover{
    border-color:#bbc6bd;
}
.form-group input:focus{
    border-color:#318a3e;
    box-shadow:0 0 0 3px rgba(49,138,62,.09),0 4px 12px rgba(49,138,62,.05);
    transform:translateY(-1px);
}
.btn-save,
.btn-password{
    display:flex;
    align-items:center;
    justify-content:space-between;
    width:100%;
    height:46px;
    padding:0 16px 0 19px;
    border:0;
    border-radius:9px;
    color:#fff;
    font-family:inherit;
    font-size:13px;
    font-weight:700;
    cursor:pointer;
    transition:transform .25s,box-shadow .25s,background .25s;
}
.btn-save{
    background:#318a3e;
}
.btn-password{
    background:#2c5964;
}
.btn-save:hover{
    background:#287833;
    transform:translateY(-2px);
    box-shadow:0 9px 20px rgba(49,138,62,.22);
}
.btn-password:hover{
    background:#254d57;
    transform:translateY(-2px);
    box-shadow:0 9px 20px rgba(44,89,100,.2);
}
.btn-save:active,
.btn-password:active{
    transform:translateY(0) scale(.98);
}
.button-arrow{
    display:flex;
    align-items:center;
    justify-content:center;
    width:27px;
    height:27px;
    border-radius:7px;
    background:rgba(255,255,255,.12);
    font-size:17px;
    transition:transform .25s,background .25s;
}
.btn-save:hover .button-arrow,
.btn-password:hover .button-arrow{
    transform:translateX(3px);
    background:rgba(255,255,255,.2);
}
.divider{
    height:1px;
    margin:34px 0;
    background:#e7ebe8;
}
.password-section{
    animation:section-enter .7s .1s ease both;
}
.section-title{
    margin-bottom:22px;
}
.section-title h2{
    margin:0;
}
.loading{
    padding:50px 0;
    color:#7a827c;
    font-size:14px;
    text-align:center;
    animation:loading-pulse 1.3s ease-in-out infinite;
}
@keyframes profile-enter{
    from{
        opacity:0;
        transform:translateY(25px) scale(.98);
    }
    to{
        opacity:1;
        transform:translateY(0) scale(1);
    }
}
@keyframes section-enter{
    from{
        opacity:0;
        transform:translateY(12px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes decoration-float{
    0%,100%{
        transform:translate(0,0) rotate(0);
    }
    50%{
        transform:translate(12px,15px) rotate(5deg);
    }
}
@keyframes loading-pulse{
    0%,100%{
        opacity:.4;
    }
    50%{
        opacity:1;
    }
}
@media(max-width:600px){
    .profile-container{
        padding:30px 12px 55px;
    }
    .profile-card{
        padding:28px 20px;
        border-radius:16px;
    }
    .profile-header h1{
        font-size:31px;
    }
    .decoration-one{
        width:300px;
        height:300px;
    }
    .decoration-two{
        width:220px;
        height:220px;
    }
}
</style>