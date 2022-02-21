<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          <div v-if="!submitted">
            <v-icon color="grey darken-3">mdi-account-plus</v-icon>
            <span
              class="text-subtitle-1 font-weight-medium grey--text text--darken-3"
            >
              Add User
            </span>
          </div>
          <div v-if="submitted">
            <v-icon v-if="submitStatus" color="green">mdi-check-circle</v-icon>
            <v-icon v-if="!submitStatus" color="danger"
              >mdi-alert-circle</v-icon
            >
            <span v-if="submitStatus" class="text-subtitle-1 font-weight-medium success--text">
              Success
            </span>
            <span v-if="!submitStatus" class="text-subtitle-1 font-weight-medium danger--text">
              Failed
            </span>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click.native="close">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <div v-if="!submitted" class="mt-5">
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
                  outlined
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
                  outlined
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
                  outlined
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Password"
                rules="required"
              >
                <v-text-field
                  v-model="form.password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  type="text"
                  :readonly="true"
                  :error-messages="errors"
                  label="Generate password"
                  @click:append="show1 = !show1"
                  solo
                  flat
                  outlined
                >
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="passwordLoading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon @click="generatePassword" style="cursor: pointer"
                        >mdi-progress-wrench</v-icon
                      >
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="User type"
                rules="required"
              >
                <v-combobox
                  v-model="form.user_type"
                  :items="itemSelect"
                  label="User Type"
                  :error-messages="errors"
                  outlined
                  dense
                ></v-combobox>
              </validation-provider>

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
        </div>

        <v-container v-if="submitted">
          <v-container>
            <span v-if="submitStatus" class="text-h6 font-weight-light">{{
              submitMessage
            }}</span>
          </v-container>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
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
  name: "UserFormDialog",

  components: { ValidationProvider, ValidationObserver },

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },

    emit: {
      type: Function,
    },
  },

  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        user_type: "",
        is_approved: 1,
      },

      itemSelect: [
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
      show1: false,
      passwordLoading: false,
      submitted: false,
      submitMessage: "",
      submitStatus: false,
    };
  },

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
      this.form.user_type = this.form.user_type.value;
      this.form.password_confirmation = this.form.password;
      await this.register(JSON.stringify(this.form));
      if (this.response.code == 200) {
        this.submitStatus = true;
        this.submitMessage = this.response.message;
        this.clear(); // clear form
        this.submitted = true; // success prompt
        // call emit function for parent.
        // this will re-render all data from data table of parent table
        this.emit();
      } else {
        this.clear(); // clear form
        this.submitStatus = false;
        this.submitMessage = this.response.message;
        this.submitted = true;
      }
    },

    generatePassword() {
      this.passwordLoading = true;
      setTimeout(() => {
        this.passwordLoading = false;
        this.form.password = this.randomString(12);
      }, 2000);
    },

    randomString(length) {
      let str = "";
      // Loop `lenth` times
      for (let i = 0; i < length; i++) {
        let rand = Math.floor(Math.random() * 62); // random: 0..61
        let charCode = (rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48); // Get correct charCode
        str += String.fromCharCode(charCode); // add Character to str
      }
      return str; // After all loops are done, return the concatenated string
    },

    close() {
      this.submitted = false;
      if (this.submitted == false) {
        this.$emit("update:dialog", false);
      }
      this.$refs.observer.reset();
    },

    clear() {
      this.form.first_name = "";
      this.form.last_name = "";
      this.form.email = "";
      this.form.user_type = "";
      this.form.password = "";
      this.$refs.observer.reset();
    },
  },
};
</script>
