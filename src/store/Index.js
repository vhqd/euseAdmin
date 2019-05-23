import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        allCategory:[],
        firstCategory:[],
        secCategory: []
    },
    mutations: {
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