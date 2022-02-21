<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>
    <v-container>
      <ShopList />
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import ShopList from "@/components/shop/ShopList";

export default {
  name: "Shop",

  components: { Breadcrumbs, ShopList },

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
          text: "Shop",
          disabled: true,
          href: "shop",
        },
      ],
    };
  },
};
</script>
