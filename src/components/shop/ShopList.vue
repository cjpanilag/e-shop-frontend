<template>
  <div>
    <div v-if="isLoading" class="my-8 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-if="!isLoading">
      <div class="ma-3 pa-3 text-center" v-if="shops.length == 0">
        <span class="text-button">No data</span>
      </div>
      <div v-if="shops.length > 0">
        <v-card
          v-for="shop in shops"
          class="ma-3 pa-3"
          :key="shop.id"
          flat
          outlined
        >
          <v-card-title>
            <div class="d-flex flex-row">
              <v-avatar>
                <v-icon size="30" color="grey darken-3">mdi-store-check</v-icon>
              </v-avatar>
              <p
                class="pt-2 text-h5 grey--text text--darken-3 text-capitalize font-weight-black"
              >
                {{ shop.name }}
              </p>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <div class="mt-3 d-flex flex-row">
            <v-avatar tile size="200">
              <v-img :src="shop.image"></v-img>
            </v-avatar>
            <div class="px-3">
              <div class="mb-3">
                <span class="text-subtitle-1">Description</span>
              </div>
              <p class="text-caption">
                {{ shop.description }}
              </p>
              <div>
                <v-chip>{{ shop.products.length }} product</v-chip>
              </div>
            </div>
          </div>
          <v-card-actions>
            <v-btn class="teal darken-3" @click="seeProduct(shop.id)" dark
              >see all product</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ShopList",

  data() {
    return {
      isLoading: false,
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.getOwnerShop();
    this.isLoading = this.shops.length > 0 ? false : true;
  },

  computed: {
    ...mapGetters({
      shops: "shop/shops",
    }),
  },

  methods: {
    ...mapActions({
      getOwnerShop: "shop/getOwnerShop",
    }),

    seeProduct(id) {
      this.$router.push({ name: "shop-product", params: { id: id } });
    },
  },
};
</script>
