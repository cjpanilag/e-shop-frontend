<template>
  <v-app>
    <v-navigation-drawer
      v-if="
        ['dashboard', 'user', 'shop', 'order', 'shop-product'].includes(
          $route.name
        )
      "
      app
    >
      <Sidebar />
    </v-navigation-drawer>

    <Navbar />

    <v-main class="grey lighten-3">
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-footer padless outlined app>
      <Footer />
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default {
  name: "App",

  components: { Navbar, Sidebar, Footer },

  data() {
    return {};
  },
};
</script>
