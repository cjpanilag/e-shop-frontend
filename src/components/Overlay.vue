<template>
  <v-row justify="center">
    <v-overlay :z-index="zIndex" :value="overlay">
      <v-card
        class="mx-auto"
        color="white"
        light
        max-width="460"
        min-width="460"
        outlined
      >
        <v-card-title>
          <v-icon v-if="message.hasError == false" color="green" medium left>
            mdi-check-circle
          </v-icon>
          <v-icon v-if="message.hasError == true" color="red" medium left>
            mdi-alert
          </v-icon>
          <span
            class="font-weight-bold"
            :class="{
              'red--text': message.hasError == true,
              'green--text': message.hasError == false,
            }"
            >{{ message.status }}</span
          >
          <v-spacer></v-spacer>
          <v-icon medium right @click.native="close"> mdi-close </v-icon>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-light">
          {{ message.text }}
        </v-card-text>
      </v-card>
    </v-overlay>
  </v-row>
</template>

<script>
export default {
  name: "Overlay",

  props: {
    overlay: {
      type: Boolean,
      default: false,
    },

    message: {
      type: Object,
      required: true,
    },

    routeTo: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    zIndex: 0,
  }),

  methods: {
    close() {
      this.$emit("update:overlay", false);
      if (this.routeTo != "") {
        this.goTo(this.routeTo);
      }
    },

    goTo(param) {
      this.$router.push(param);
    },
  },
};
</script>
