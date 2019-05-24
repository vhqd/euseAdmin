import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        allCategory:[],
        firstCategory:[],
        secCategory: [],
        user:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
        token:localStorage.getItem('token') ? localStorage.getItem('token') : null
    },
    mutations: {
        setUser(state,payload){
            state.user = payload
        },
        setToken(state,payload){
            state.token = payload
        },
        setAllCategory(state,payload){
            state.allCategory = payload
        },
        setSecCategory(state,payload){
            state.secCategory = payload
        },
        firstCategory(state,payload){
            state.firstCategory = payload
        }
    },
    getters: {
        getUser(state){
            return state.user
        },
        getToken(state){
            return state.token
        },
        getAllCategory(state){
            return state.allCategory
        },
        getSecCategory(state){
            return state.secCategory
        },
        getFirstCategory(state){
            return state.firstCategory
        }
    },

    actions: {

    }
})

export default store