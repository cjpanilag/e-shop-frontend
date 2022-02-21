<template>
  <div class="text-center">
    <v-dialog v-model="visible" width="500">
      <v-card :loading="loading">
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>

        <v-card-text>{{ text }}</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="confirm" color="blue" text @click="emitAction">
            CONFIRM
          </v-btn>
          <v-btn color="red" text @click="close"> CLOSE </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Dialog",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "Title",
    },

    text: {
      type: String,
      default: "Say something...",
    },

    action: {
      type: Function,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    confirm: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },

    emitAction() {
      this.action();
    },
  },
};
</script>
