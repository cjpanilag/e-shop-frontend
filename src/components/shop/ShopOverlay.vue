<template>
  <v-overlay :absolute="absolute" :value="overlay">
    <v-card max-width="300" min-width="300" light>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="close" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-row>
        <v-col justify="center" align="center">
          <v-avatar class="ma-3" size="140">
            <v-img :src="items.image"></v-img>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-light">{{ items.name }}</span>
          </div>
          <v-chip class="mt-2" color="light" label small>
            <!-- <v-icon size="22" left> mdi-store </v-icon> -->
            <span class="text-overline">Owner: {{ items.user.name }}</span>
          </v-chip>
          <div>
            <span class="text-caption">{{ items.user.email }}</span>
          </div>
          <div class="mt-8 mb-8">
            <v-btn color="teal darken-1" dark>visit store</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <!-- <v-btn color="success"> Hide Overlay </v-btn> -->
  </v-overlay>
</template>

<script>
export default {
  name: "ShopOverlay",

  props: {
    overlay: {
      type: Boolean,
      default: false,
    },

    items: {
      type: Object,
    },
  },

  data() {
    return {
      isLoading: false,
      absolute: true,
    };
  },

  methods: {
    close() {
      this.$emit("update:overlay", false);
    },
  },
};
</script>
