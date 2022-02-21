<template>
  <div>
    <v-app-bar class="elevation-0" dense light outlined>
      <v-toolbar-title style="cursor: pointer" @click.prevent="goTo('home')"
        >E-shop</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <!-- <div v-if="!auth">
        <v-btn @click.prevent="goTo('login')" text small>
          <v-icon>mdi-login-variant</v-icon>
          login
        </v-btn>
        <v-btn @click.prevent="goTo('register')" text small>
          <v-icon>mdi-account-plus</v-icon>
          Sign Up
        </v-btn>
      </div> -->

      <p v-if="auth" class="pt-4">{{ user.name }}</p>

      <v-menu v-if="auth" left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list flat>
          <v-subheader>MENU</v-subheader>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, i) in getListItems"
              :key="i"
              @click="item.action"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",

  components: {},

  data() {
    return {
      selectedItem: null,

      listItems: [
        {
          text: "Cart",
          icon: "mdi-cart",
          action: this.showCart,
          allowedUser: ["basic_user"],
        },
        {
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          action: this.toStoreAdminDashboard,
          allowedUser: ["store_admin"],
        },
        {
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          action: this.toAdminDashboard,
          allowedUser: ["admin"],
        },
        {
          text: "Logout",
          icon: "mdi-logout-variant",
          action: this.logout,
          allowedUser: ["basic_user", "store_admin", "admin"],
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      response: "auth/response",
      auth: "auth/authenticated",
    }),

    getListItems: function () {
      let items = [];
      if (this.auth) {
        for (const x of this.listItems) {
          if (x.allowedUser.includes(this.auth.user_type)) {
            items.push(x);
          }
        }
      }
      return items;
    },
  },

  methods: {
    ...mapActions({
      commitLogout: "auth/logout",
    }),

    async logout() {
      await this.commitLogout();
      this.goTo("login");
    },

    toAdminDashboard() {
      this.goTo("dashboard");
    },

    toStoreAdminDashboard() {
      this.goTo("shop");
    },

    showCart() {
      this.goTo("cart");
    },

    goTo(param) {
      this.$router.push({ name: param });
    },
  },
};
</script>
