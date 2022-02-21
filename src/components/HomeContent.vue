<template>
  <div>
    <v-card min-width="100" min-height="100" tile flat>
      <v-img
        class="white--text align-center"
        height="400px"
        src="@/assets/homepage-blur.jpg"
      >
        <v-card-title>
          <div>
            <div class="text-center">
              <div class="black pa-2">
                <p class="text-h1 font-weight-bold">E-Shop</p>
              </div>
              <div>
                <p class="text-h4 font-weight-light">One stop shopping.</p>
              </div>
            </div>
            <div class="justify-center d-flex flex-row mt-12">
              <div class="mr-3">
                <v-btn @click="goTo('register')" color="primary" dark large>
                  sign up
                </v-btn>
              </div>
              <div>
                <v-btn @click="goTo('login')" color="black" dark large>
                  login
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-title>
      </v-img>
    </v-card>
    <v-card class="pa-5 text-center" tile outlined>
      <v-row>
        <v-col v-for="(item, index) in aboutData" :key="index">
          <v-icon x-large>{{ item.icon }}</v-icon>
          <div>
            <span class="text-button">{{ item.text }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "HomeContent",

  data() {
    return {
      aboutData: [
        {
          icon: "mdi-truck-delivery-outline",
          text: "Free Delivery",
        },
        {
          icon: "mdi-cash-fast",
          text: "Cash on delivery",
        },
        {
          icon: "mdi-archive-alert-outline",
          text: "No return policy",
        },
      ],
    };
  },

  methods: {
    goTo(param) {
      this.$router.push({ name: param });
    },
  },
};
</script>
