<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>
    <v-container>
      <AdminOrderList />
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminOrderList from "@/components/order/admin/AdminOrderList";

export default {
  name: "Order",

  components: { Breadcrumbs, AdminOrderList },

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
          text: "Order",
          disabled: true,
          href: "shop",
        },
      ],
    };
  },
};
</script>
