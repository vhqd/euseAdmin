import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        firstCategory:[],
        secCategory: []
    },
    mutations: {
        setSecCategory(state,payload){
            state.secCategory = payload
        },
        firstCategory(state,payload){
            state.firstCategory = payload
        }
    },
    getters: {
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