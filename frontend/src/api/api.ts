import axios from 'axios'

const api=axios.create({
    baseURL:'http://localhost:5178',
    headers:{
        'Content-Type':'application/jsom'
    }
})

export default api