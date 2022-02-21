<template>
  <div>
    <div v-if="isLoading" class="my-8 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div class="d-flex flex-column ma-12 text-center" v-if="products == 0">
      <span class="text-button">no data</span>
      <div>
        <v-btn color="teal darken-3" dark @click="isAddFromShow = true">
          <v-icon>mdi-plus</v-icon>
          add product
        </v-btn>
      </div>
    </div>

    <div v-if="!isLoading && products.length > 0">
      <v-toolbar class="mb-3" color="teal darken-3" dark flat rounded>
        <v-toolbar-title>Product</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-select
          :items="localProductCategory"
          class="mt-5"
          label="Filter category"
          dense
          outlined
        ></v-select>

        <v-text-field
          dense
          class="mx-5 mt-5 mb-0"
          outlined
          label="Search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>

        <v-btn @click="isAddFromShow = true" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card
        class="mb-3"
        v-for="product in products"
        :key="product.id"
        flat
        outlined
      >
        <v-card-title>
          <div class="d-flex flex-row">
            <v-avatar>
              <v-icon size="25" color="grey darken-3"
                >mdi-package-variant</v-icon
              >
            </v-avatar>
            <p
              class="pt-2 text-h6 grey--text text--darken-3 text-capitalize font-weight-black"
            >
              {{ product.name }}
            </p>
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="edit(product)" icon>
            <v-icon medium>mdi-pencil</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <div class="mt-3 d-flex flex-row">
          <v-avatar tile size="150">
            <v-img :src="product.image"></v-img>
          </v-avatar>
          <div class="px-5">
            <div>
              <span class="text-subtitle-2">Description</span>
            </div>
            <p class="text-caption">
              {{ product.description }}
            </p>
            <div>
              <span class="text-subtitle-2">Quantity</span>
            </div>
            <p class="text-caption">
              {{ product.quantity }} {{ product.unit }}
            </p>
            <div>
              <v-chip outlined color="primary" dark small>
                <span class="text-caption">
                  {{ currency }}
                  {{ Number(product.actual_price).toLocaleString() }}</span
                >
              </v-chip>
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <AdminAddProductDialog
      :dialog.sync="isAddFromShow"
      :stateChange.sync="state"
    >
    </AdminAddProductDialog>

    <AdminEditProductDialog
      :dialog.sync="isEditFromShow"
      :item="productToEdit"
      :stateChange.sync="state"
    >
    </AdminEditProductDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AdminAddProductDialog from "@/components/product/admin/AdminAddProductDialog";
import AdminEditProductDialog from "@/components/product/admin/AdminEditProductDialog";

export default {
  name: "AdminProductList",

  components: { AdminAddProductDialog, AdminEditProductDialog },

  data() {
    return {
      state: false,
      stateChange: false,
      isLoading: false,
      currency: "₱",
      localProducts: {},
      localProductCategory: [],
      isAddFromShow: false,
      isEditFromShow: false,
      productToEdit: null,
    };
  },

  async mounted() {
    this.isLoading = true;
    const storeId = this.$route.params.id;
    await this.getProducts(storeId);
    this.isLoading = false;
  },

  watch: {
    products: function (val) {
      for (let item of val) {
        if (!this.localProductCategory.includes(item.category)) {
          this.localProductCategory.push(item.category);
        }
      }
    },

    state: async function (val) {
      this.stateChange = val;
      if (this.stateChange) {
        this.isLoading = true;
        const storeId = this.$route.params.id;
        await this.getProducts(storeId);
        if (this.products.length > 0) {
          this.isLoading = false;
          this.stateChange = false;
          this.state = false;
        }
        this.isLoading = false;
      }
    },
  },

  computed: {
    ...mapGetters({
      products: "product/products",
    }),
  },

  methods: {
    ...mapActions({
      getProducts: "product/getStoreOwnerProduct",
    }),

    edit(product) {
      this.isEditFromShow = true;
      this.productToEdit = product;
    },
  },
};
</script>
