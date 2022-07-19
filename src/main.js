import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
// import io from "socket.io-client";
import store from "./store";
// import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// import VuejsDialog from "vuejs-dialog";
// import VueSimpleAlert from "vue-simple-alert";

// Vue.use(VueSimpleAlert);


process.env.TZ = "Europe/Bucharest";

Vue.config.productionTip = false;
const VUE_APP_HOST = process.env.VUE_APP_HOST;
const SERVER_PORT = process.env.VUE_APP_API_URI || 3000;
// const API_URL = process.env.NODE_ENV === "production" ? "/" : `http://localhost:${SERVER_PORT}/`;
// const API_URL = process.env.NODE_ENV === "production" ? "/" : `http://${VUE_APP_HOST}:${SERVER_PORT}/`;
const API_URL = `http://${VUE_APP_HOST}:${SERVER_PORT}/`;


let base = null

var env = process.env.NODE_ENV || 'development';
switch (env) {
    case 'production': {
        // Setup development config
        base = axios.create({
            // baseURL: API_URL,
            withCredentials: true
        });
    }
    break;
    case 'development': {
        // Setup production config
        base = axios.create({
            baseURL: API_URL,
            withCredentials: true
        });
    }
        break;
}

// console.
// if(process.env.NODE_ENV === "production") {
    
// } else {
//     const base = axios.create({
//         baseURL: API_URL,
//         withCredentials: true
//     });
// }


console.log(API_URL)
// const socket = io(API_URL, { autoConnect: false });
// const socket = io(API_URL);

Vue.prototype.$http = base;
// Vue.prototype.$sock = socket;
Vue.prototype.$windowHeight = window.screen.availHeight;

export const bus = new Vue();




base.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.status == 401) {
      console.log("send me to login")
    }
    return Promise.reject(error);
  })

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Vue.use(VuejsDialog);

export default new Vue({
    store,
    router,
    render: h => h(App)
}).$mount("#app");
