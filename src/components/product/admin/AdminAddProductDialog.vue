<template>
  <v-dialog v-model="dialog" width="550">
    <v-card>
      <v-card-title class="mb-5">
        <v-icon color="black">{{ formIcon }}</v-icon>
        <span class="mx-2 text-capitalize text-subtitle-1">{{
          formTitle
        }}</span>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="close">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-if="isLoading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-card-text>

      <v-card-text class="text-center" v-if="submitMode">
        <p class="text-caption">{{ submitMessage }}</p>
      </v-card-text>

      <v-card-text v-if="!isLoading && !submitMode">
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <v-row dense>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required|min:3"
                >
                  <v-text-field
                    v-model="form.name"
                    :error-messages="errors"
                    dense
                    label="Name"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col>
                <v-file-input
                  v-model="image"
                  dense
                  ref="image"
                  type="file"
                  accept="image/*"
                  label="Image"
                  prepend-icon="mdi-file-image"
                  outlined
                  flat
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="Category"
                  rules="required|min:3"
                >
                  <v-text-field
                    v-model="form.category"
                    dense
                    label="Category"
                    outlined
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="Original price"
                  rules="numeric|required"
                >
                  <v-text-field
                    v-model="form.original_price"
                    dense
                    label="Original Price"
                    type="number"
                    outlined
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  v-model="form.quantity"
                  dense
                  label="Quantity"
                  type="number"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="form.unit"
                  dense
                  label="Unit"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-textarea
                  v-model="form.description"
                  dense
                  outlined
                  name="input-7-4"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal darken-3" :disabled="invalid" type="submit">
                submit
              </v-btn>
              <v-btn @click="clear">clear</v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { required, numeric } from "vee-validate/dist/rules";
import mixins from "@/mixins";

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

extend("numeric", {
  ...numeric,
  message: "{_field_} needs to be numeric",
});

export default {
  name: "AdminAddProductDialog",

  mixins: [mixins],

  components: { ValidationProvider, ValidationObserver },

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },

    stateChange: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLoading: false,
      formTitle: "add product",
      formIcon: "mdi-pencil-box-multiple",
      submitMode: false,
      submitMessage: "",

      form: {
        name: "",
        original_price: 0,
        description: "",
        category: "",
        unit: "",
        quantity: 0,
        store_id: null,
      },
      image: null,
    };
  },

  mounted() {
    this.form.store_id = this.$route.params.id;
  },

  watch: {
    isLoading: function (val) {
      if (val == true) {
        this.formTitle = "";
        this.formIcon = "";
      }
    },
  },

  computed: {
    ...mapGetters({
      singleProduct: "product/singleProduct",
      response: "product/response",
    }),
  },

  methods: {
    ...mapActions({
      createProduct: "product/createProduct",
    }),

    async submit() {
      this.$refs.observer.validate();
      this.isLoading = true;
      await this.createProduct(this.serialize(this.form, this.image));
      if (this.response.code == 200) {
        this.submitMode = true;
        this.formTitle = "success";
        this.formIcon = "mdi-check";
        this.submitMessage = this.response.message;
      } else {
        this.submitMode = true;
        this.formTitle = "error";
        this.formIcon = "mdi-exclamation-thick";
        this.submitMessage = this.response.message;
      }
      this.isLoading = false;
      this.clear();
    },

    clear() {
      this.form.name = "";
      this.form.original_price = 0;
      this.form.description = "";
      this.form.category = "";
      this.form.unit = "";
      this.form.quantity = 0;
      this.$refs.image.reset();
      this.$refs.observer.reset();
    },

    close() {
      this.submitMode = false;
      this.$emit("update:dialog", false);
      this.$emit("update:stateChange", true);
    },
  },
};
</script>
