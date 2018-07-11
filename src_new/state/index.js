import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        user:null,
        activeName:"Area"
    },
    mutations:{
        setUser(state,user){
            state.user=user;
        },
        setActive(state,activeName){
            state.activeName=activeName
        },
        logout(state){
            state.user=null
        }
    },
    actions:{
        setUser({commit},payload){
            commit("setUser",payload)
        },
        setActive({commit},payload){
            commit("setActive",payload)
        },
        logout({commit}){
            commit("logout");
        }
    }
});