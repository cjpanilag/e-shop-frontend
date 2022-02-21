<template>
  <div>
    <Breadcrumbs :items="breadCrumbsItem"></Breadcrumbs>
    <v-container>
      <AdminProductList />
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import AdminProductList from "@/components/product/admin/AdminProductList";

export default {
  name: "Product",

  components: { Breadcrumbs, AdminProductList },

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
        {
          text: "Product",
          disabled: true,
          href: "shop-product",
        },
      ],
    };
  },
};
</script>
