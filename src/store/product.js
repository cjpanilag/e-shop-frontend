import axios from "axios";

export default {
  namespaced: true,

  state: {
    products: {},
    singleProduct: {},
    response: {
      code: null,
      message: null,
    },
  },

  getters: {
    products(state) {
      return state.products;
    },

    singleProduct(state) {
      return state.singleProduct;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_PRODUCTS(state, data) {
      state.products = data;
    },

    SET_SINGLE_PRODUCT(state, data) {
      state.singleProduct = data;
    },

    SET_RESPONSE(state, { code, message }) {
      state.response.code = code;
      state.response.message = message;
    },
  },

  actions: {
    /**
     * Create new product
     *
     * @param {*} param0
     * @param {*} form
     */
    async createProduct({ commit }, form) {
      let response;
      try {
        response = await axios.post("/admin/store/product", form, {
          header: {
            "Content-Type": "multipart/form-data",
          },
        });
        commit("SET_SINGLE_PRODUCT", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * Getting all products
     *
     * @param {commit}
     * @param {params}
     */
    async getProducts({ commit }, params = {}) {
      let response;
      try {
        response = await axios.get("/store/product", { params });
        commit("SET_PRODUCTS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    /**
     * Getting single products base on product_id
     *
     * @param {commit}
     * @param {params}
     */
    async getSingleProduct({ commit }, productId) {
      let response;
      try {
        response = await axios.get(`/store/product/${productId}`);
        commit("SET_SINGLE_PRODUCT", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getStoreOwnerProduct({ commit }, storeId) {
      let response;
      try {
        response = await axios.get(`/admin/store/product/${storeId}`);
        commit("SET_PRODUCTS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async updateProduct({ commit }, { id, form }) {
      let response;
      try {
        response = await axios.put(`/admin/store/product/${id}`, form);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },
  },
};
