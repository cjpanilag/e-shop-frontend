import axios from "axios";

export default {
  namespaced: true,

  state: {
    orders: {},
    reponse: {
      code: null,
      message: null,
    },
    deleteResponse: {
      code: null,
      message: null,
    },
  },

  getters: {
    response(state) {
      return state.response;
    },

    deleteResponse(state) {
      return state.deleteResponse;
    },

    orders(state) {
      return state.orders;
    },
  },

  mutations: {
    SET_RESPONSE(state, value) {
      state.response = value;
    },

    SET_DELETE_RESPONSE(state, value) {
      state.deleteResponse = value;
    },

    SET_ORDERS(state, value) {
      state.orders = value;
    },
  },

  actions: {
    async createOrder({ commit }, data) {
      let response;
      try {
        response = await axios.post("/order", data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let code = error.response.status;
        let { message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getOrder({ commit }, filter = null) {
      let response;
      try {
        response =
          filter != null
            ? await axios.get(`/order?filter=${filter}`)
            : await axios.get("/order");
        commit("SET_ORDERS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let code = error.response.status;
        let { message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async deleteOrder({ commit }, orderId) {
      let response;
      try {
        response = await axios.delete(`/order/${orderId}`);
        let { code, message } = response.data;
        commit("SET_DELETE_RESPONSE", { code, message });
      } catch (error) {
        let code = error.response.status;
        let { message } = error.response.data;
        commit("SET_DELETE_RESPONSE", { code, message });
      }
    },
  },
};
