<template>
  <div>
    <v-card
      style="cursor: pointer"
      :class="color"
      max-width="300"
      min-width="300"
      :dark="dark"
    >
      <div class="d-flex flex-row">
        <div class="pa-3 justify-center text-center">
          <v-avatar :color="color" class="darken-2" size="50">
            <v-icon size="35" tile>{{ icon }}</v-icon>
          </v-avatar>
        </div>
        <div>
          <v-card-text class="text-h6 pb-0 pt-2">{{ text }}</v-card-text>
          <v-card-title class="text-subtitle-2 font-weight-light pt-0">
            {{ title }}
          </v-card-title>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DashboardWidget",

  props: {
    title: {
      type: String,
      default: "Title Placeholder",
    },
    text: {
      type: [String, Number, Object],
      default: "Text Placeholder",
    },
    icon: {
      type: String,
      default: "mdi-image",
    },
    color: {
      type: String,
      default: "white",
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
