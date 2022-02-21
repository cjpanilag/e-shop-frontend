import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import product from "./product";
import cart from "./cart";
import shop from "./shop";
import user from "./user";
import order from "./order";
import shipment from "./shipment";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    product,
    cart,
    shop,
    user,
    order,
    shipment,
  },
});
