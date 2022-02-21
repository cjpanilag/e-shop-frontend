import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import moment from "moment";
import baseURL from "@/api";

const axios = require("axios");

Vue.prototype.moment = moment;

//referencing subscriber for header default config
require("@/store/subscriber");

// default API base URL
axios.defaults.baseURL = baseURL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.get["Content-Type"] = "application/json";

Vue.config.productionTip = false;

store.dispatch("auth/self", localStorage.getItem("token")).then(() => {
  new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
