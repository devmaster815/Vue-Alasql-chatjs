import Vue from 'vue'
import App from './App.vue'
import alasqlJs from '../node_modules/alasql/dist/alasql.min.js'

Vue.config.productionTip = false

const alasql = {
  install () {
      Vue.prototype.alasql = alasqlJs
  }
}
Vue.use(alasql)

new Vue({
  render: h => h(App),
}).$mount('#app')
