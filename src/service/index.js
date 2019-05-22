import axios from 'axios'
const baseurl = 'http://127.0.0.1:3000'
export default {
    login: (user) => {
        return axios.post(baseurl+'/api/user/login',user)
    },
    adduser:(data)=>{
        return axios.post(baseurl+'/api/user/adduser',data)
    },
    edituser:(data)=>{
        return axios.post(baseurl+'/api/user/edituser',data)
    },
    getusers:()=>{
        return axios.get(baseurl+'/api/user/users')
    },
    deleteuser:(user)=>{
        return axios.post(baseurl+'/api/user/deleteuser',user)
    },
    getcategorys:()=>{
        return axios.get(baseurl+'/api/category/category')
    },
    addCategory:(data)=>{
        return axios.post(baseurl+'/api/category/addcategory',data)
    }
}