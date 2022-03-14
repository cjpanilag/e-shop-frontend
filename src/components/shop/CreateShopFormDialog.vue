<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="mb-5">
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click.native="close">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="!submitted">
        <v-img :src="url"></v-img>
        <form @submit.prevent="submit">
          <v-file-input
            @change="preview"
            v-model="image"
            label="Shop profile picture"
            outlined
            prepend-icon="mdi-camera"
          ></v-file-input>
          <v-text-field
            v-model="form.name"
            label="Shop name"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="form.description"
            label="Description"
            outlined
          ></v-text-field>

          <v-btn class="mr-4 white--text" color="teal darken-1" type="submit">
            submit
          </v-btn>
        </form>
      </v-card-text>

      <v-card-text v-if="submitted">
        <div v-if="isLoading" class="my-8 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div v-if="!isLoading" class="text-center">
          <span class="text-h5 font-weight-light">{{ responseMessage }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import mixins from "@/mixins";

export default {
  name: "CreateShopFormDialog",

  mixins: [mixins],

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        name: "",
        description: "",
      },
      image: null,
      url: "",

      submitted: false,
      title: "Create Shop",
      isLoading: false,
      responseMessage: "",
    };
  },

  watch: {
    submitted: function (val) {
      if (val) {
        this.title = "Submitted!";
      }
    },
  },

  computed: {
    ...mapGetters({
      response: "shop/response",
    }),
  },

  methods: {
    ...mapActions({
      createShop: "shop/createShop",
    }),

    async submit() {
      this.isLoading = true;
      await this.createShop(this.serialize(this.form, this.image));
      this.submitted = true;
      this.responseMessage = this.response.message;
      this.isLoading = false;
    },

    close() {
      this.$emit("update:dialog", false);
    },

    preview() {
      this.url = URL.createObjectURL(this.image);
    },
  },
};
</script>
