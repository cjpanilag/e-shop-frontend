<template>
  <div>
    <v-container v-if="!auth">
      <HomeContent />
    </v-container>

    <ProductLists />
  </div>
</template>

<script>
import HomeContent from "@/components/HomeContent";
import ProductLists from "@/components/product/ProductList";
import { mapGetters } from "vuex";

export default {
  name: "Home",

  components: { HomeContent, ProductLists },

  computed: {
    ...mapGetters({
      auth: "auth/authenticated",
    }),
  },
};
</script>
