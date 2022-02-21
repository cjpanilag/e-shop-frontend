import axios from "axios";

export default {
  namespaced: true,

  state: {
    shipment: {},
    reponse: {
      code: null,
      message: null,
    },
  },

  getters: {
    shipment(state) {
      return state.shipment;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_SHIPMENT(state, value) {
      state.shipment = value;
    },

    SET_RESPONSE(state, value) {
      state.response = value;
    },
  },

  actions: {
    /**
     * Update the order status
     *
     * @param {*} param0
     * @param {*} orderId
     */
    async updateShipment({ commit }, data) {
      let response;
      try {
        response = await axios.post(
          `/admin/shipment/update/${data.orderId}`,
          JSON.stringify({ status: data.status })
        );
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let code = error.response.status;
        let { message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },
  },
};
