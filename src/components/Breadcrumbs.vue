<template>
  <v-breadcrumbs :items="items">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :to="item.href" :disabled="item.disabled">
        <v-icon v-if="item.icon" medium>{{ item.icon }}</v-icon>
        <span v-if="!item.icon">
          {{ item.text.toUpperCase() }}
        </span>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "Breadcrumbs",

  props: {
    items: {
      type: Array,
    },

    action: {
      type: String,
    },
  },
};
</script>
