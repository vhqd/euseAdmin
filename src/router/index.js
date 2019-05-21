import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Main from '@/components/main'
import Login from '@/components/Login'
import Category from '@/components/Category'
import Articles from '@/components/Articles'
import Users from '@/components/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '',
          name: 'home',
          component: Main
        },
        {
          path: 'category',
          name: 'category',
          component: Category
        },
        {
          path:'articles',
          name:'articles',
          component:Articles
        },
        {
          path:'users',
          name:'users',
          component:Users
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
