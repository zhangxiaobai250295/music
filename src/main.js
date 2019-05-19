import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'lib-flexible';
import './assets/css/reset.css';
import './assets/fonts/iconfont.css';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueLazyLoad from 'vue-lazyload';
import 'swiper/dist/css/swiper.css';
import './assets/css/common.css';


Vue.config.productionTip = false;
Vue.use(VueAwesomeSwiper, /* { default global options } */);

Vue.use(VueLazyLoad, {
  loading: '/load.gif'
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
