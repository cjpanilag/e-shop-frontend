<template>
  <div>
    <v-card
      v-for="(item, i) in productList"
      :key="i"
      class="d-inline-flex pa-3 grey lighten-3"
      :loading="isLoading"
      flat
      tile
    >
      <template v-slot:progress>
        <v-skeleton-loader
          type="card"
          min-width="260"
          max-width="260"
        ></v-skeleton-loader>
      </template>

      <v-card v-if="!isLoading" outlined rounded>
        <v-card-title class="text-h5" v-text="item.name"> </v-card-title>

        <v-card-subtitle>
          {{ item.description }} <br />

          <v-chip
            class="mt-2"
            color="light"
            style="cursor: pointer"
            label
            small
            @click.prevent="viewShop(item.store.id)"
          >
            <v-icon size="22" left> mdi-store </v-icon>
            <span class="text-caption">{{ item.store.name }}</span>
          </v-chip>
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            class="ml-2"
            @click="showForm(item.id)"
            outlined
            rounded
            small
            :disabled="addToCartBtnDisabled"
          >
            <v-icon class="pa-2" size="18">mdi-cart-plus</v-icon>
            ADD TO CART
          </v-btn>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <span class="text-caption amber--text text--darken-4">
              {{ currency }} {{ Number(item.actual_price).toLocaleString() }}
            </span>
            <span class="text-caption grey--text text--darken-1"
              >{{ Number(item.quantity).toLocaleString() }}
              {{ item.unit }} left</span
            >
          </div>
        </v-card-actions>

        <v-avatar class="ma-3" size="250" style="cursor: pointer" tile>
          <v-img :src="item.image"></v-img>
        </v-avatar>
      </v-card>
    </v-card>

    <!-- Overlay -->
    <v-overlay v-if="overlay" :value="overlay">
      <v-card
        class="mx-auto"
        color="white"
        light
        max-width="460"
        min-width="460"
        outlined
      >
        <v-app-bar flat>
          <v-icon class="pa-2" size="18" color="black">mdi-cart</v-icon>
          <span>add cart</span>
          <v-spacer></v-spacer>
          <v-btn @click="formClose" icon small>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <div>
          <v-row>
            <v-col>
              <v-card-title>
                {{ singleProduct.name }}
              </v-card-title>
              <v-card-subtitle>
                {{ singleProduct.description }}
              </v-card-subtitle>

              <v-spacer></v-spacer>

              <v-card-text>
                <span class="amber--text text--darken-4">
                  {{ currency }}
                  {{ Number(singleProduct.actual_price).toLocaleString() }}
                </span>
                <br />
                <span>
                  {{ Number(singleProduct.quantity).toLocaleString() }}
                  {{ singleProduct.unit }} left
                </span>
              </v-card-text>
            </v-col>
            <v-col>
              <v-avatar class="ma-3" size="200" tile>
                <v-img :src="singleProduct.image"></v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </div>

        <v-divider></v-divider>

        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form class="ma-5" @submit.prevent="submit">
            <v-row>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="Quantity"
                  rules="required|input-length"
                >
                  <v-text-field
                    v-model="quantity"
                    label="Quantity"
                    hide-details="auto"
                    outlined
                    :error-messages="errors"
                    type="number"
                    required
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col>
                <v-btn type="submit" :disabled="invalid">ADD</v-btn>
              </v-col>
              <v-col>
                <span class="text-caption grey--text text--darken-1"
                  >Quantity: {{ Number(quantity).toLocaleString() }}</span
                >
                <br />
                <span
                  class="text-caption text-caption grey--text text--darken-1"
                  >Total price: {{ Number(total).toLocaleString() }}</span
                >
              </v-col>
            </v-row>
          </v-form>
        </validation-observer>
      </v-card>
    </v-overlay>

    <!-- overlay for responses -->
    <Overlay
      v-if="isOverlayVisible"
      :overlay.sync="isOverlayVisible"
      :message="message"
      :routeTo="routeAfter"
    ></Overlay>
    <!-- shop overlay -->
    <ShopOverlay
      v-if="isShopOverlay"
      :overlay.sync="isShopOverlay"
      :items="localShopDetails"
    ></ShopOverlay>
  </div>
</template>

<script>
import Overlay from "@/components/Overlay";
import ShopOverlay from "@/components/shop/ShopOverlay";
import { mapActions, mapGetters } from "vuex";
import { required } from "vee-validate/dist/rules";

import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("input-length", (value) => {
  if (value > 0) return true;
  return "{_field_} can not be zero or less than zero";
});

export default {
  name: "ProductLists",

  components: { Overlay, ShopOverlay, ValidationProvider, ValidationObserver },

  data() {
    return {
      isLoading: false,
      overlay: false,
      isOverlayVisible: false,
      isShopOverlay: false,
      total: 0,
      quantity: 0,
      routeAfter: "",
      currency: "₱",
      message: {
        text: "",
        status: "Success",
        hasError: false,
      },
      localShopDetails: [],
    };
  },

  async created() {
    this.isLoading = true;
    await this.getProducts();
  },

  computed: {
    ...mapGetters({
      auth: "auth/authenticated",
      user: "auth/user",
      productList: "product/products",
      singleProduct: "product/singleProduct",
      cartResponse: "cart/response",
      shopResponse: "shop/response",
      shopDetails: "shop/singleShop",
    }),

    addToCartBtnDisabled: function () {
      let state;
      if (this.auth) {
        state = this.auth.user_type != "basic_user" ? true : false;
      }
      return state;
    },
  },

  watch: {
    quantity: function (val) {
      this.total = val * this.singleProduct.actual_price;
    },

    productList: function (val) {
      if (val.length > 0) this.isLoading = false;
    },
  },

  methods: {
    ...mapActions({
      getProducts: "product/getProducts",
      getSingleProduct: "product/getSingleProduct",
      addToCart: "cart/createCart",
      getShopDetails: "shop/getSingleShop",
    }),

    async showForm(productId) {
      if (!this.auth) {
        this.goTo("login");
      }
      this.overlay = true;
      await this.getSingleProduct(productId);
    },

    async submit() {
      this.$refs.observer.validate();
      let form = {
        items: [
          {
            product_id: this.singleProduct.id,
            quantity: this.quantity,
          },
        ],
      };
      form = JSON.stringify(form);
      await this.addToCart(form);
      if (this.cartResponse.code == 200) {
        this.message.text = this.cartResponse.message;
        this.message.status = "Added to cart.";
        this.message.hasError = false;
      } else {
        this.message.text = this.cartResponse.message;
        this.message.status = "Fail to add cart.";
        this.message.hasError = true;
      }
      this.clear();
      this.overlay = false;
      this.isOverlayVisible = true;
    },

    async viewShop(shopId) {
      await this.getShopDetails(shopId);

      if (this.shopResponse.code == 200) {
        this.localShopDetails = this.shopDetails;
      } else {
        this.message.text = this.shopResponse.message;
        this.message.status = this.shopResponse.code;
        this.message.hasError = true;
        this.isOverlayVisible = true;
      }

      this.isShopOverlay = true;
    },

    formClose() {
      this.clear();
      this.overlay = false;
    },

    goTo(param) {
      this.$router.push(param);
    },

    clear() {
      this.total = 0;
      this.quantity = 0;
    },
  },
};
</script>
