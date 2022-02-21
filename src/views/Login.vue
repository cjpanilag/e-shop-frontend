<template>
  <div class="ma-3">
    <v-card class="mx-auto" max-width="385" outlined>
      <div class="text-center">
        <p class="pt-5 black--text text-uppercase">login</p>
      </div>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form class="px-5 pb-5" @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="Username"
            rules="required"
          >
            <v-text-field
              v-model="form.username"
              :error-messages="errors"
              label="Username"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Password"
            rules="required|min:8"
          >
            <v-text-field
              v-model="form.password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              :error-messages="errors"
              label="Password"
              hint="At least 8 characters"
              @click:append="show1 = !show1"
            ></v-text-field>
          </validation-provider>

          <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="checkbox"
          >
            <v-checkbox
              v-model="checkbox"
              :error-messages="errors"
              value="1"
              label="I agree to the terms and services."
              type="checkbox"
              required
            ></v-checkbox>
          </validation-provider>

          <div class="mb-5">
            <span>Don't have an account? </span>
            <span
              class="blue--text"
              style="cursor: pointer"
              v-on:click="goTo('register')"
              >Sign Up.</span
            >
          </div>

          <v-btn
            class="mr-4 white--text"
            color="teal darken-1"
            type="submit"
            :disabled="invalid"
          >
            submit
          </v-btn>
          <v-btn @click="clear"> clear </v-btn>
        </form>
      </validation-observer>
    </v-card>
    <Overlay
      v-if="isOverlayVisible"
      :overlay="isOverlayVisible"
      :message="message"
      :routeTo="routeAfter"
    ></Overlay>
  </div>
</template>

<script>
import Overlay from "@/components/Overlay";
import { mapActions, mapGetters } from "vuex";

import {
  required,
  digits,
  email,
  max,
  min,
  regex,
} from "vee-validate/dist/rules";

import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("min", {
  ...min,
  message: "{_field_} atleast {length} characters",
});

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} does not match {regex}",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  name: "Login",
  components: { Overlay, ValidationProvider, ValidationObserver },

  data: () => ({
    show1: false,
    isOverlayVisible: false,
    routeAfter: "",

    form: {
      username: "",
      password: "",
    },

    checkbox: null,

    message: {
      text: "",
      status: "Success",
      hasError: false,
    },
  }),

  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      response: "auth/response",
    }),
  },

  methods: {
    ...mapActions({
      login: "auth/login",
    }),

    async submit() {
      this.$refs.observer.validate();
      let body = JSON.stringify(this.form);
      await this.login(body);
      if (this.response.code == 200) {
        this.message.text = this.response.message;
        this.message.status = "Login Success";
        this.message.hasError = false;
        this.routeAfter = "/";
        this.isOverlayVisible = true;
      }
    },

    clear() {
      this.form.username = "";
      this.form.password = "";
      this.$refs.observer.reset();
    },

    goTo(param) {
      this.$router.push(param);
    },
  },
};
</script>
