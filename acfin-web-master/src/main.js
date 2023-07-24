import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import session from './plugins/session'
import './utils/filters'
import store from './store'
import meta from './meta'
import users from '@/utils/webapi/users'
import VueSignaturePad from 'vue-signature-pad'
import VueCharts from 'vue-chartjs'

Vue.config.productionTip = false
Vue.prototype.$metaData = meta
Vue.prototype.$users = users

Vue.use(VueSignaturePad)
Vue.use(VueCharts)

new Vue({
  router,
  vuetify,
  store,
  session,
  render: (h) => h(App)
}).$mount('#app')
