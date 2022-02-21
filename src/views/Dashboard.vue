<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>
    <v-container>
      <div>
        <span class="text-h4 font-weight-black grey--text text--darken-3"
          >User</span
        >
      </div>
    </v-container>
    <div class="d-flex align-content-start flex-wrap">
      <div class="pa-5">
        <DashboardWidget
          color="primary"
          title="Users"
          icon="mdi-account-multiple"
          :text="countedUsers"
          dark
        ></DashboardWidget>
      </div>
      <div class="pa-5">
        <DashboardWidget
          color="success"
          title="New user request"
          icon="mdi-account-alert"
          :text="countedPendingUsers"
          dark
        ></DashboardWidget>
      </div>
      <div class="pa-5">
        <DashboardWidget
          color="warning"
          title="Archive"
          icon="mdi-archive"
          :text="archiveUsers"
          dark
        ></DashboardWidget>
      </div>
    </div>
    <v-container>
      <div>
        <span class="text-h4 font-weight-black grey--text text--darken-3"
          >Shop</span
        >
      </div>
    </v-container>
    <div class="d-flex align-content-start flex-wrap">
      <div class="pa-5">
        <DashboardWidget color="teal" dark></DashboardWidget>
      </div>
      <div class="pa-5">
        <DashboardWidget color="indigo" dark></DashboardWidget>
      </div>
      <div class="pa-5">
        <DashboardWidget color="purple" dark></DashboardWidget>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import DashboardWidget from "@/components/widgets/DashboardWidget";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: { Breadcrumbs, DashboardWidget },

  data() {
    return {
      breadCrumbsItem: [
        {
          // text: "Home",
          icon: "mdi-store",
          disabled: false,
          href: "/",
        },
        {
          text: "Dashboard",
          disabled: true,
          href: "",
        },
      ],
    };
  },

  async mounted() {
    await this.getCountedUsers();
    await this.getCountedPendingUsers();
    await this.getUserArchiveCount();
  },

  computed: {
    ...mapGetters({
      countedUsers: "user/countedUsers",
      countedPendingUsers: "user/countedPendingUsers",
      archiveUsers: "user/archiveUsers",
    }),
  },

  methods: {
    ...mapActions({
      getCountedUsers: "user/getCountedUsers",
      getCountedPendingUsers: "user/getCountedPendingUsers",
      getUserArchiveCount: "user/getUserArchiveCount",
    }),

    goTo: function (param) {
      this.$router.push(param);
    },
  },
};
</script>
