<template>
  <v-card class="flex" flat tile>
    <v-card-title>
      <span class="text-caption grey--text text--darken-3">
        E-shop by {{ owner }} {{ copyRightSymbol }} {{ year }}
      </span>

      <v-spacer></v-spacer>

      <v-btn
        color="teal darken-3"
        v-for="item in items"
        :key="item.icon"
        class="mx-2"
        :href="item.link"
        dark
        icon
        small
      >
        <v-icon small>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Footer",

  data() {
    return {
      items: [
        {
          icon: "mdi-github",
          link: "https://github.com/cjpanilag",
        },
        {
          icon: "mdi-facebook",
          link: "https://www.facebook.com/carljeffrie.panilag",
        },
        {
          icon: "mdi-twitter",
          link: "https://twitter.com/carljeffrie",
        },
        {
          icon: "mdi-instagram",
          link: "https://www.instagram.com/carljeffrie",
        },
      ],
      copyRightSymbol: "©",
      year: "2022",
      owner: "cjpanilag",
    };
  },
};
</script>
