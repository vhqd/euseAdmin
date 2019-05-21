import axios from 'axios'
const baseurl = 'http://127.0.0.1:3000'
export default {
    login: (user) => {
        return axios.post(baseurl+'/api/user/login',user)
    },
    getusers:()=>{
        return axios.get(baseurl+'/api/user/users')
    },
    deleteuser:(user)=>{
        return axios.post(baseurl+'/api/user/deleteuser',user)
    }
}