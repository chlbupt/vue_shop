import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入图标库
import './assets/fonts/iconfont.css'
// 引入全局样式
import './assets/css/global.css'
// 引入axios
import axios from './util/http.js'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
