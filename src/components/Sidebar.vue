<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> E-shop </v-list-item-title>
        <!-- <v-list-item-subtitle> subtext </v-list-item-subtitle> -->
      </v-list-item-content>
    </v-list-item>

    <!-- <v-divider></v-divider> -->

    <v-list dense nav>
      <v-list-item
        v-for="item in getListItems"
        :key="item.title"
        @click="goTo(item.path)"
        :to="item.path"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-overline font-weight-light">{{
            item.title
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Sidebar",

  data() {
    return {
      items: [
        {
          title: "users",
          icon: "mdi-account-multiple",
          path: "user",
          allowedUser: ["admin"],
        },
        {
          title: "shop",
          icon: "mdi-store",
          path: "shop",
          allowedUser: ["admin", "store_admin"],
        },
        {
          title: "order",
          icon: "mdi-cart-check",
          path: "order",
          allowedUser: ["store_admin"],
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      auth: "auth/authenticated",
    }),

    getListItems: function () {
      let items = [];
      if (this.auth) {
        for (const x of this.items) {
          if (x.allowedUser.includes(this.auth.user_type)) {
            items.push(x);
          }
        }
      }
      return items;
    },
  },

  methods: {
    goTo(param) {
      this.$router.push({ name: param });
    },
  },
};
</script>
