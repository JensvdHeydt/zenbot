// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import { loadAllSessions, loadAllSelectors } from './store/actions'

Vue.config.productionTip = false

Vue.use(require('vue-moment'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
    }
  }
})

loadAllSessions(store)
loadAllSelectors(store)
