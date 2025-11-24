// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import router from './router'
import './firebase' // if you have initialization here

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

