<template>
  <div>
    <v-card class="mx-auto" max-width="420" outlined>
      <div class="text-center pa-3">
        <v-card-tile> Sign Up </v-card-tile>
      </div>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form class="px-5 pb-5" @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="Firstname"
            rules="required|min:3"
          >
            <v-text-field
              v-model="form.first_name"
              :error-messages="errors"
              label="First Name"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Lastname"
            rules="required|min:3"
          >
            <v-text-field
              v-model="form.last_name"
              :error-messages="errors"
              label="Last Name"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Email"
            rules="required|email"
          >
            <v-text-field
              v-model="form.email"
              :error-messages="errors"
              label="Email"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Username"
            rules="required|min:3"
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
            name="Password confirmation"
            rules="required|min:8|confirmed:Password"
          >
            <v-text-field
              v-model="form.password_confirmation"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              :error-messages="errors"
              label="Confirm password"
              hint="At least 8 characters"
              @click:append="show1 = !show1"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="User type"
            rules="required"
          >
            <v-combobox
              v-model="form.user_type"
              :items="items"
              label="User Type"
              :error-messages="errors"
              dense
            ></v-combobox>
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
            <span>Already have and account? </span>
            <span
              class="blue--text"
              style="cursor: pointer"
              v-on:click="goTo('login')"
              >Login Account.</span
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
  confirmed,
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

extend("confirmed", {
  ...confirmed,
  message: "Password does not match!",
});

export default {
  name: "Register",

  components: { Overlay, ValidationProvider, ValidationObserver },

  data: () => ({
    show1: false,
    isOverlayVisible: false,
    routeAfter: "",

    message: {
      text: "",
      status: "Success",
      hasError: false,
    },

    form: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      user_type: "",
    },

    items: [
      {
        text: "Customer",
        value: "basic_user",
      },
      {
        text: "Store Owner",
        value: "store_admin",
      },
    ],

    checkbox: null,
  }),

  computed: {
    ...mapGetters({
      response: "auth/response",
    }),
  },

  methods: {
    ...mapActions({
      register: "auth/register",
    }),

    async submit() {
      this.$refs.observer.validate();
      // mutate user type base on selected value
      this.form.user_type = this.form.user_type.value;
      // wrap form inputs into json
      let body = JSON.stringify(this.form);
      // send request
      await this.register(body);
      // check response state status
      if (this.response.code == 200) {
        this.message.text = this.response.message;
        this.message.status = "Registration success.";
        this.message.hasError = false;
        this.routeAfter = "login";
      } else {
        this.message.text = this.response.message;
        this.message.status = "Registration fail.";
        this.message.hasError = true;
      }
      this.clear();
      this.isOverlayVisible = true;
    },

    clear() {
      this.form.first_name = "";
      this.form.last_name = "";
      this.form.email = "";
      this.form.username = "";
      this.form.password = "";
      this.form.password_confirmation = "";
      this.form.user_type = "";
      this.$refs.observer.reset();
    },

    goTo(param) {
      this.$router.push(param);
    },
  },
};
</script>
