import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        allCategory: [],
        firstCategory: [],
        secCategory: [],
        tabs: localStorage.getItem('tabs') ? JSON.parse(localStorage.getItem('tabs')) : [],
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setToken(state, payload) {
            state.token = payload
        },
        setTabs(state, payload) {
            state.tabs = payload
        },
        setAllCategory(state, payload) {
            state.allCategory = payload
        },
        setSecCategory(state, payload) {
            state.secCategory = payload
        },
        firstCategory(state, payload) {
            state.firstCategory = payload
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getToken(state) {
            return state.token
        },
        getTabs(state) {
            return state.tabs
        },
        getAllCategory(state) {
            return state.allCategory
        },
        getSecCategory(state) {
            return state.secCategory
        },
        getFirstCategory(state) {
            return state.firstCategory
        },
        getAllCate(state){
            let allcate = state.allCategory
            allcate = allcate.slice(1,allcate.length)
            for(let i = 0 ; i < allcate.length ; i++){
                let childdata = allcate[i].children;
                handChild(childdata);
                allcate[i].label = allcate[i].categoryname
                allcate[i].value = allcate[i]._id
            }
            return allcate
        }
    },

    actions: {

    }
})

function handChild(data){
    for(let i = 0 ; i < data.length ; i++){
        data[i].label = data[i].categoryname
        data[i].value = data[i]._id
        let child = data[i].children;
        for(let j = 0 ; j < child.length ; j++ ){
            child[j].label = child[j].categoryname
            child[j].value = child[j]._id
        }
    }
}

export default store