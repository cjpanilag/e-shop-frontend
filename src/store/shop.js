import axios from "axios";

export default {
  namespaced: true,

  state: {
    shop: {},
    response: {
      code: null,
      message: null,
    },
  },

  getters: {
    singleShop(state) {
      return state.shop;
    },

    shops(state) {
      return state.shop;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_SHOP(state, data) {
      state.shop = data;
    },

    SET_RESPONSE(state, { code, message }) {
      state.response.code = code;
      state.response.message = message;
    },
  },

  actions: {
    /**
     *
     * @param {*} param0
     * @param {*} data
     */
    async createShop({ commit }, data) {
      let response;
      try {
        response = await axios.post("/store", data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * GET SINGLE SHOP DETAILS
     * @param {*} param0
     * @param {*} shopId
     */
    async getSingleShop({ commit }, shopId) {
      let response;
      try {
        response = await axios.get(`/store/${shopId}`);
        commit("SET_SHOP", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * Get all shop of owner
     *
     * @param {*} param0
     */
    async getOwnerShop({ commit }) {
      let response;
      try {
        response = await axios.get("/admin/store?full_data");
        commit("SET_SHOP", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },
  },
};
