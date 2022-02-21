<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>
    <v-container>
      <UserList />
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import UserList from "@/components/user/UserList";

export default {
  name: "User",

  components: { Breadcrumbs, UserList },

  data() {
    return {
      isUsersLoading: false,
      pendingUsersCount: 0,

      breadCrumbsItem: [
        {
          // text: "Home",
          icon: "mdi-store",
          disabled: false,
          href: "/",
        },
        {
          text: "Dashboard",
          disabled: false,
          href: "dashboard",
        },
        {
          text: "Users",
          disabled: true,
          href: "user",
        },
      ],
    };
  },

  computed: {},

  methods: {},
};
</script>
