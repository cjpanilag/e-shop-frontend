import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Dashboard from "@/views/Dashboard";
import Cart from "@/views/Cart";
import User from "@/views/admin/User";
import Shop from "@/views/admin/Shop";
import Product from "@/views/admin/Product";
import Order from "@/views/admin/Order";
import store from "@/store";

Vue.use(VueRouter);

let routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/authenticated"]) {
        return next({
          name: "timeline",
        });
      }
      next();
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/authenticated"]) {
        return next({
          name: "timeline",
        });
      }
      next();
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (store.getters["auth/authenticated"].user_type != "admin") {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (store.getters["auth/authenticated"].user_type != "basic_user") {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
  {
    path: "/user",
    name: "user",
    component: User,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (store.getters["auth/authenticated"].user_type != "admin") {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
  {
    path: "/shop",
    name: "shop",
    component: Shop,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (
          store.getters["auth/authenticated"].user_type != "admin" &&
          store.getters["auth/authenticated"].user_type != "store_admin"
        ) {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
  {
    path: "/order",
    name: "order",
    component: Order,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (store.getters["auth/authenticated"].user_type != "store_admin") {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
  {
    path: "/shop/:id",
    name: "shop-product",
    component: Product,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "login",
        });
      } else {
        if (
          store.getters["auth/authenticated"].user_type != "admin" &&
          store.getters["auth/authenticated"].user_type != "store_admin"
        ) {
          return next({
            name: "home",
          });
        }
      }

      next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
export default router;
