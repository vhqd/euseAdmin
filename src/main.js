// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import Store from './store'
import axios from 'axios'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/base.css'

Vue.use(VueQuillEditor);
Vue.use(ElementUI);
axios.defaults.headers.common['Authorization'] = Store.state.token;

axios.interceptors.request.use(
  config => {
    if (Store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${Store.state.token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');//获取浏览器缓存的用户信息

  if (token) { //如果有就直接到首页咯
    next();
  } else {
    if (to.path == '/login') { //如果是登录页面路径，就直接next()
      next();
    } else { //不然就跳转到登录；
      next('/login');
    }
  }
})

  Vue.filter('getDate', function (timeStamp, isData) {
  var date = new Date();
  date.setTime(timeStamp * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  if (isData) {
    return y + '-' + m + '-' + d;
  } else {
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  Store,
  components: { App },
  template: '<App/>'
})
