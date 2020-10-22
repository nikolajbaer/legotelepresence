import Vue from 'vue';

// Core application bits
import App from './components/App.vue'
import store from './store.js';
import router from './router.js';

/* Vue Material Components */
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(VueMaterial)
/*
// TODO import only selected components
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
*/

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
