import axios from "axios";

export default {
  namespaced: true,

  state: {
    cart: {},
    response: {
      code: null,
      message: null,
    },
  },

  getters: {
    cart(state) {
      return state.cart;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_CART(state, data) {
      state.cart = data;
    },

    SET_RESPONSE(state, { code, message }) {
      state.response.code = code;
      state.response.message = message;
    },
  },

  actions: {
    /**
     * Add to cart
     *
     * @param {*} param0
     * @param {*} form
     */
    async createCart({ commit }, form) {
      let response;
      try {
        response = await axios.post("/cart", form);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        console.log(error);
        let { code, message } = error.response;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * Get user cart
     *
     * @param {*} param0
     * @param {*} params
     */
    async getCart({ commit }, params = {}) {
      let response;
      try {
        response = await axios.get("/cart", { params });
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
        commit("SET_CART", response.data.data);
      } catch (error) {
        let { code, message } = error.response;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async deleteCart({ commit }, cartId) {
      let response;
      try {
        response = await axios.delete(`/cart/${cartId}`);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response;
        commit("SET_RESPONSE", { code, message });
      }
    },
  },
};
