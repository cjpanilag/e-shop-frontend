import axios from "axios";

export default {
  namespaced: true,

  state: {
    users: {},
    countedUsers: {},
    countedPendingUsers: {},
    archiveUsers: {},
    userCategory: [],
    response: {
      code: null,
      message: null,
    },
  },

  getters: {
    users(state) {
      return state.users;
    },

    countedUsers(state) {
      return state.countedUsers;
    },

    countedPendingUsers(state) {
      return state.countedPendingUsers;
    },

    archiveUsers(state) {
      return state.archiveUsers;
    },

    userCategory(state) {
      return state.userCategory;
    },

    response(state) {
      return state.response;
    },
  },

  mutations: {
    SET_USERS(state, data) {
      state.users = data;
    },

    SET_COUNTED_USERS(state, data) {
      state.countedUsers = data;
    },

    SET_PENDING_COUNT_USERS(state, data) {
      state.countedPendingUsers = data;
    },

    SET_ARCHIVE_USERS(state, data) {
      state.archiveUsers = data;
    },

    SET_USER_CATEGORY(state, data) {
      state.userCategory = data;
    },

    SET_RESPONSE(state, { code, message }) {
      state.response.code = code;
      state.response.message = message;
    },
  },

  actions: {
    /**
     * Get all users
     *
     * @param {*} commit
     * @param {*} params
     */
    async getUsers({ commit }, params = {}) {
      let response;
      try {
        response = await axios.get("/admin/user", { params });
        commit("SET_USERS", response.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getCountedUsers({ commit }, params = {}) {
      let response;
      try {
        response = await axios.get("/admin/user/count", { params });
        commit("SET_COUNTED_USERS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getCountedPendingUsers({ commit }) {
      let response;
      try {
        response = await axios.get("/admin/user/count", {
          params: { is_approved: false },
        });
        commit("SET_PENDING_COUNT_USERS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getUserArchiveCount({ commit }) {
      let response;
      try {
        response = await axios.get("/admin/user/count", {
          params: { archive: "archive" },
        });
        commit("SET_ARCHIVE_USERS", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async approveUser({ commit }, id) {
      let response;
      try {
        response = await axios.put(`/admin/user/approve/${id}`);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async deleteUser({ commit }, id) {
      let response;
      try {
        response = await axios.put(`/admin/user/delete/${id}`);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async restoreUser({ commit }, id) {
      let response;
      try {
        response = await axios.put(`/admin/user/restore/${id}`);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },

    async getUserCategory({ commit }) {
      let response;
      try {
        response = await axios.get("/user/category");
        commit("SET_USER_CATEGORY", response.data.data);
        let { code, message } = response.data;
        commit("SET_RESPONSE", { code, message });
      } catch (error) {
        let { code, message } = error.response.data;
        commit("SET_RESPONSE", { code, message });
      }
    },
  },
};
