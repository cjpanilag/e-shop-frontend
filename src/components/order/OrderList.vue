<template>
  <div>
    <v-card flat>
      <v-card-title class="pa-0 ma-0">
        <v-row class="pa-0 ma-0">
          <v-col cols="12" sm="12" md="8">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <v-select
              v-model="dropDownFilter"
              @change="filter"
              class="font-weight-regular"
              :items="productCategory"
              label="Filter by category"
              :clearable="true"
              size="2"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <p v-if="orders.length == 0" class="text-button text-center ma-5">
        No Data
      </p>

      <v-container v-if="isLoading">
        <div class="ma-12 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-container>

      <v-divider></v-divider>

      <v-card-text v-if="orders.length > 0 && !isLoading">
        <v-card class="mb-5" v-for="order in orders" :key="order.id">
          <div
            v-for="detail in order.order_details"
            class="d-flex flex-row pa-3"
            :key="detail.id"
          >
            <v-avatar class="ma-3" size="130" tile>
              <v-img
                :src="detail.product.image"
                alt="product image"
                outlined
              ></v-img>
            </v-avatar>
            <div class="pa-2">
              <span class="text-overline grey--text text--darken-3">
                {{ detail.product.name }}
              </span>
              <div>
                <span class="text-caption grey--text text--darken-3"
                  >Quantity: {{ detail.quantity }}</span
                >
              </div>
              <div>
                <span
                  class="text-caption text-uppercase font-weight-black grey--text text--darken-3 pr-1"
                >
                  total
                </span>
                <span class="text-caption grey--text text--darken-3">
                  {{ currency }}{{ Number(detail.total).toLocaleString() }}
                </span>
              </div>
              <div class="d-flex flex-row mt-5">
                <div class="mr-3">
                  <v-chip
                    :color="
                      order.status == 'Shipping soon'
                        ? 'success'
                        : order.status == 'Shipping'
                        ? 'primary'
                        : 'warning'
                    "
                    dark
                    small
                    >{{ order.status }}</v-chip
                  >
                </div>
                <div>
                  <v-chip small>Cash on Delivery</v-chip>
                </div>
              </div>
              <div>
                <span class="text-caption grey--text text--darken-1"
                  >Last update at:
                </span>
                <span class="text-caption grey--text text--darken-1">{{
                  moment(order.updated_at).format("lll")
                }}</span>
              </div>
            </div>
            <v-spacer></v-spacer>
            <div class="pa-3">
              <div class="mt-3">
                <v-row class="justify-center">
                  <span
                    class="text-caption font-weight-light grey--text text--darken-3"
                    >Ordered on: &nbsp;
                  </span>
                  <span
                    class="text-caption font-weight-light grey--text text--darken-3"
                  >
                    {{ moment(order.created_at).format("lll") }}
                  </span>
                </v-row>
                <v-row class="justify-center mt-8 pt-3">
                  <v-btn
                    v-if="order.status === 'Shipping soon'"
                    class="pt-3 pb-3"
                    color="red"
                    outlined
                    @click="preOrderCancel(order.id)"
                  >
                    <v-icon> mdi-cancel </v-icon>
                    cancel order
                  </v-btn>
                  <v-btn
                    v-if="order.status === 'Shipping'"
                    class="pt-3 pb-3"
                    color="primary"
                    outlined
                    @click="orderReceived(order.id)"
                  >
                    <v-icon> mdi-check </v-icon>
                    received order
                  </v-btn>
                </v-row>
              </div>
            </div>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
    <Dialog
      :visible.sync="dialogVisible"
      :loading="dialogLoading"
      :title="dialogTitle"
      :text="dialogText"
      :confirm="dialogConfirm"
      :action.sync="cancelOrder"
    ></Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dialog from "@/components/Dialog";

export default {
  name: "OrderList",

  components: { Dialog },

  data() {
    return {
      // local
      isLoading: false,
      orderList: [],
      productCategory: [],
      dropDownFilter: null,
      search: "",
      tableHeaders: [],
      currency: "₱",
      orderId: null,

      // dialog
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: "",
      dialogText: "",
      dialogConfirm: true,
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.getOrders();
    this.isLoading = false;
  },

  watch: {
    orders: function (val) {
      for (let item of val) {
        if (item.order_details instanceof Array) {
          for (let x of item.order_details) {
            if (!this.productCategory.includes(x.product.category)) {
              this.productCategory.push(x.product.category);
            }
          }
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      orders: "order/orders",
      response: "order/response",
      deleteResponse: "order/deleteResponse",
      shipmentResponse: "shipment/response",
    }),
  },

  methods: {
    ...mapActions({
      getOrders: "order/getOrder",
      deleteOrder: "order/deleteOrder",
      updateShipment: "shipment/updateShipment",
    }),

    preOrderCancel(orderId) {
      this.dialogVisible = true;
      this.dialogTitle = "Order Remove Confirmation";
      this.dialogText = "Are you sure you want to cancel order?";
      this.orderId = orderId;
    },

    async orderReceived(orderId) {
      let data = {
        status: "Delivered",
        orderId: orderId,
      };
      await this.updateShipment(data);
      if (this.shipmentResponse.code === 200) {
        this.dialogVisible = true;
        this.dialogTitle = "Success";
        this.dialogText = this.shipmentResponse.message;
        this.dialogConfirm = false;

        this.isLoading = true;
        await this.getOrders();
        this.isLoading = false;
      } else {
        this.dialogVisible = true;
        this.dialogTitle = "Failed";
        this.dialogText = this.shipmentResponse.message;
        this.dialogConfirm = false;
      }
    },

    async cancelOrder() {
      this.dialogLoading = true;
      await this.deleteOrder(this.orderId);
      this.dialogLoading = false;
      if (this.deleteResponse.code == 200) {
        this.dialogTitle = "Success";
        this.isLoading = true;
        await this.getOrders();
        this.isLoading = false;
      } else {
        this.dialogTitle = "Failed";
      }
      this.dialogText = this.deleteResponse.message;
    },

    filter() {},
  },
};
</script>
