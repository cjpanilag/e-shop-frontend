<template>
  <div>
    <v-card class="ma-3" outlined>
      <v-card-title>
        <v-tabs v-model="tab">
          <v-tab v-for="item in tabItems" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-card-title>

      <v-divider></v-divider>

      <v-container v-if="isLoading">
        <div class="ma-12 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-container>

      <v-container v-if="!isLoading">
        <div v-if="orders.length == 0" class="text-center pa-5">
          <p class="text-button">No Data</p>
        </div>

        <div class="ma-3" v-if="orders.length > 0">
          <v-card class="mb-5 pa-3" v-for="order in orders" :key="order.id">
            <v-card-title>
              <div class="d-flex flex-column">
                <div class="d-flex flex-column mb-3">
                  <span class="text-subtitle-2 grey--text text--darken-2"
                    >Order ID: {{ order.id }}</span
                  >
                  <span class="text-caption grey--text text--darken-2"
                    >Order at:
                    {{ moment(order.created_at).format("llll") }}</span
                  >
                </div>
                <div class="d-flex flex-column">
                  <span
                    class="text-subtitle-2 grey--text text--darken-2 font-weight-light"
                    >Order by: {{ order.user.name }}</span
                  >
                  <span
                    class="text-subtitle-2 grey--text text--darken-2 font-weight-light"
                    >Email: {{ order.user.email }}</span
                  >
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                @click="placeShipment(order.id)"
                v-if="tab === 0"
                color="primary"
                outlined
              >
                place shipment
              </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <div class="mb-5">
                <span class="text-subtitle-1 grey--text text--darken-2"
                  >Order Details</span
                >
              </div>

              <v-card
                v-for="orderDetail in order.order_details"
                :key="orderDetail.id"
                outlined
              >
                <v-card-title>
                  <div class="d-flex flex-row">
                    <v-avatar tile size="100">
                      <v-img :src="orderDetail.product.image"></v-img>
                    </v-avatar>
                    <div class="d-flex flex-column">
                      <div class="d-flex flex-column mb-3">
                        <span
                          class="text-subtitle-1 grey--text text--darken-2"
                          >{{ orderDetail.product.name }}</span
                        >
                        <span class="text-caption grey--text text--darken-2">
                          Quantity: {{ orderDetail.quantity }}
                        </span>
                      </div>
                      <div>
                        <v-chip class="mr-3" dark x-small>
                          Total:
                          {{ currency }}
                          {{ Number(orderDetail.total).toLocaleString() }}
                        </v-chip>
                        <v-chip color="secondary" outlined x-small>
                          Cash on Delivery
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="d-flex flex-column">
                    <span class="text-caption grey--text text--darken-2"
                      >Category: {{ orderDetail.product.category }}</span
                    >
                    <span class="text-caption grey--text text--darken-2"
                      >Original price:
                      {{ currency }}
                      {{
                        Number(
                          orderDetail.product.original_price
                        ).toLocaleString()
                      }}</span
                    >
                  </div>
                </v-card-title>
              </v-card>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-card>
    <Dialog
      :visible.sync="isDialogVisible"
      :title="dialogTitle"
      :text="dialogtext"
      :loading.sync="dialogLoading"
      :confirm="dialogConfirm"
    ></Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dialog from "@/components/Dialog";

export default {
  name: "AdminOrderList",

  components: { Dialog },

  data() {
    return {
      // native data
      isLoading: false,
      tab: null,
      currency: "₱",
      tabItems: ["Shipping soon", "Shipping", "Delivered"],

      // dialog data
      isDialogVisible: false,
      dialogTitle: "",
      dialogtext: "",
      dialogConfirm: false,
      dialogLoading: false,
    };
  },

  watch: {
    tab: async function (val) {
      this.isLoading = true;
      let filter = this.tabItems[val];
      await this.getOrder(filter);
      this.isLoading = false;
    },
  },

  computed: {
    ...mapGetters({
      orders: "order/orders",
      shipmentResponse: "shipment/response",
    }),
  },

  async mounted() {
    this.isLoading = true;
    await this.getOrder(this.tabItems[this.tab]);
    this.isLoading = false;
  },

  methods: {
    ...mapActions({
      getOrder: "order/getOrder",
      updateShipment: "shipment/updateShipment",
    }),

    async placeShipment(orderId) {
      let data = {
        status: "Shipping",
        orderId: orderId,
      };
      this.isLoading = true;
      await this.updateShipment(data);
      this.isDialogVisible = true;
      this.dialogLoading = true;
      if (this.shipmentResponse.code == 200) {
        this.dialogLoading = false;
        this.dialogTitle = "Success";
        this.dialogtext = this.shipmentResponse.message;
      } else {
        this.dialogLoading = false;
        this.dialogTitle = "Failed";
        this.dialogtext = this.shipmentResponse.message;
      }
      let filter = this.tabItems[this.tab];
      await this.getOrder(filter);
      this.isLoading = false;
    },
  },
};
</script>
