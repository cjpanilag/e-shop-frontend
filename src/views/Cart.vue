<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>

    <v-card flat outlined>
      <v-card-title>
        <v-tabs v-model="tab">
          <v-tab v-for="item in itemTabs" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-card-title>

      <v-divider></v-divider>

      <CartList v-if="tab == 0" />
      <OrderList v-if="tab === 1" />
    </v-card>
  </div>
</template>

<script>
import CartList from "@/components/cart/CartList";
import OrderList from "@/components/order/OrderList";
import Breadcrumbs from "@/components/Breadcrumbs";

export default {
  name: "Cart",

  components: { CartList, OrderList, Breadcrumbs },

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
          text: "Cart",
          disabled: true,
          href: "cart",
        },
      ],

      tab: null,
      itemTabs: ["Cart", "Order"],
    };
  },
};
</script>
