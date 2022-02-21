<template>
  <v-dialog v-model="dialog" width="550">
    <v-card>
      <v-card-title class="mb-5">
        <v-icon color="black">{{ formIcon }}</v-icon>
        <span class="mx-2 text-capitalize text-subtitle-1">
          {{ formTitle }}</span
        >
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="close">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="isLoading">
        <div class="text-center ma-12">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-card-text>

      <v-card-text class="pa-12 text-center" v-if="submitMode && !isLoading">
        <span class="text-subtitle-1 font-weight-regular">{{
          formMessage
        }}</span>
      </v-card-text>

      <v-card-text v-if="!isLoading && item != null && submitMode == false">
        <div class="text-center">
          <v-avatar size="200" tile>
            <v-img :src="item.image"></v-img>
          </v-avatar>
        </div>

        <div class="ma-12">
          <form @submit.prevent="submit">
            <v-text-field
              v-model="item.name"
              dense
              label="Name"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="item.original_price"
              disabled
              dense
              label="Original Price"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="item.category"
              dense
              label="Category"
              outlined
            ></v-text-field>
            <v-row>
              <v-col dense>
                <v-text-field
                  v-model="item.quantity"
                  dense
                  label="Quantity"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col dense>
                <v-text-field
                  v-model="item.unit"
                  dense
                  label="Unit"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea
              v-model="item.description"
              dense
              outlined
              name="input-7-4"
              label="Description"
            ></v-textarea>
            <v-row>
              <v-col>
                <v-btn color="teal darken-3" dark type="submit">submit</v-btn>
              </v-col>
            </v-row>
          </form>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixins from "@/mixins";

export default {
  name: "AdminEditProductDialog",

  mixins: [mixins],

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },

    stateChange: {
      type: Boolean,
      default: false,
    },

    item: {
      type: Object,
    },
  },

  data() {
    return {
      formTitle: "edit product",
      formIcon: "mdi-pencil",
      formMessage: "",
      isLoading: false,
      submitMode: false,
      productId: null,
    };
  },

  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },

  computed: {
    ...mapGetters({
      response: "product/response",
    }),
  },

  watch: {
    item: function (val) {
      this.productId = val.id;
    },
  },

  methods: {
    ...mapActions({
      updateProduct: "product/updateProduct",
    }),

    async submit() {
      this.isLoading = true;
      // remove certain property of the item (product)
      this.removeItemProperty();
      // assign value locally
      const id = this.productId;
      const form = JSON.parse(JSON.stringify(this.item));
      // update the product
      await this.updateProduct({ id, form });
      if (this.response.code == 200) {
        this.formTitle = "success";
        this.formIcon = "mdi-check";
        this.formMessage = this.response.message;
        this.submitMode = true;
      } else {
        this.formTitle = "error";
        this.formIcon = "mdi-alert-circle";
        this.formMessage = this.response.message;
        this.submitMode = true;
      }
      this.isLoading = false;
    },

    removeItemProperty() {
      delete this.item.id;
      delete this.item.image;
      delete this.item.store_id;
    },

    close() {
      this.formTitle = "edit product";
      this.formIcon = "mdi-pencil";
      this.formMessage = "";
      this.submitMode = false;
      this.$emit("update:dialog", false);
      this.$emit("update:stateChange", true);
    },
  },
};
</script>
