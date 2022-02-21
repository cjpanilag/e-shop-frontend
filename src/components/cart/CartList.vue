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
      <v-divider></v-divider>
      <p v-if="localCartList.length == 0" class="text-button text-center ma-5">
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
      <v-simple-table
        v-if="localCartList.length > 0 && isLoading == false"
        dense
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th></th>
              <th
                class="text-left"
                v-for="item in tableHeaders"
                :key="item.name"
                v-text="item.text"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in localCartList" :key="item.id">
              <td>
                <v-checkbox
                  v-model="selected"
                  :value="item.id"
                  @click="checkboxClick(item)"
                  dense
                  >test</v-checkbox
                >
              </td>
              <td>
                <div class="d-flex flex-row">
                  <v-avatar class="ma-3" size="90" tile>
                    <v-img :src="item.product.image"></v-img>
                  </v-avatar>
                  <div class="d-flex flex-column mt-3">
                    <span class="text-subtitle-2">
                      {{ item.product.name }}
                    </span>
                    <span class="text-caption">
                      {{ item.product.category }}
                    </span>
                    <v-chip
                      class="text-caption mt-4"
                      color="pa-2 grey darken-3"
                      outlined
                      x-small
                    >
                      {{ currency }}
                      {{ Number(item.product.actual_price).toLocaleString() }}
                    </v-chip>
                  </div>
                </div>
              </td>
              <v-hover v-slot="{ hover }">
                <td style="cursor: pointer">
                  <div>
                    <span>
                      {{ item.quantity }}
                    </span>
                    <v-icon v-if="hover" small>mdi-pencil</v-icon>
                  </div>
                </td>
              </v-hover>
              <td>
                {{ currency }}
                {{ Number(perItemtotal[index]).toLocaleString() }}
              </td>
              <td>
                {{ moment(item.updated_at).format("llll") }}
              </td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on:click="openDeleteDialog(item)"
                      icon
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>delete</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-card-actions v-if="selected.length > 0">
        <div class="ma-5 d-flex flex-row">
          <div>
            <span class="text-overline grey--text text--darken-3 text-uppercase"
              >total payment</span
            >
            <v-chip class="ml-1" color="primary" small dark>
              <span class="text-caption">
                {{ currency }} {{ Number(overallTotal).toLocaleString() }}
              </span>
            </v-chip>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn class="ma-3" color="teal darken-1" @click="submit" dark text>
          <v-icon class="mr-1">mdi-cart-check</v-icon>
          checkout
        </v-btn>
      </v-card-actions>
    </v-card>
    <Dialog
      :visible.sync="isDialogVisible"
      :loading="isDialogLoading"
      :confirm="dialogConfirm"
      :title="dialogTitle"
      :text="dialogText"
      :action.sync="commitDelete"
    ></Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Dialog from "@/components/Dialog";

export default {
  name: "CartList",

  components: { Dialog },

  data() {
    return {
      isDialogLoading: false,
      isDialogVisible: false,
      dialogTitle: "",
      dialogText: "",
      dialogConfirm: false,

      tableHeaders: [
        {
          name: "product",
          text: "Product",
        },
        {
          name: "quantity",
          text: "Quantity",
        },
        {
          name: "total",
          text: "Total",
        },
        {
          name: "added date",
          text: "Added Date",
        },
        {
          name: "action",
          text: "Actions",
        },
      ],

      localCartList: {},
      currency: "₱",
      perItemtotal: [],
      overallTotal: 0,
      selected: [],
      dropDownFilter: null,
      productCategory: [],
      isLoading: false,
      search: "",
      cartId: null,
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.myCart({ full_data: "full_data" });
    this.isLoading = false;
    this.localCartList = this.cartList;
  },

  watch: {
    localCartList: function (val) {
      this.renderCartList(val);
    },

    search: async function (val) {
      if (val == "") {
        this.isLoading = true;
        await this.myCart({ full_data: "full_data" });
        this.isLoading = false;
      }
    },

    isDialogVisible: async function (val) {
      if (val === false) {
        this.isLoading = true;
        await this.myCart({ full_data: "full_data" });
        this.localCartList = this.cartList;
        this.renderCartList(this.localCartList);
        this.isLoading = false;
      }
    },
  },

  computed: {
    ...mapGetters({
      cartList: "cart/cart",
      response: "cart/response",
      orderResponse: "order/response",
    }),
  },

  methods: {
    ...mapActions({
      myCart: "cart/getCart",
      deleteCart: "cart/deleteCart",
      createOrder: "order/createOrder",
    }),

    checkboxClick(item) {
      if (this.selected.includes(item.id)) {
        this.overallTotal += item.product.actual_price * item.quantity;
      } else {
        this.overallTotal -= item.product.actual_price * item.quantity;
      }
    },

    async filter() {
      this.isLoading = true;
      if (this.dropDownFilter !== null) {
        await this.myCart({
          category: this.dropDownFilter,
          full_data: "full_data",
        });
        this.localCartList = this.cartList;
      } else {
        await this.myCart({ full_data: "full_data" });
        this.localCartList = this.cartList;
      }
      this.isLoading = false;
    },

    async submit() {
      let data = Object.assign({ cart: this.selected });
      await this.createOrder(JSON.parse(JSON.stringify(data)));
      this.isDialogVisible = true;
      if (this.orderResponse.code == 200) {
        this.dialogTitle = "Success";
        this.dialogText = this.orderResponse.message;
      } else {
        this.dialogTitle = "Failed";
        this.dialogText = this.orderResponse.message;
      }
      this.selected = [];
    },

    openDeleteDialog(item) {
      this.isDialogVisible = true;
      this.dialogConfirm = true;
      this.dialogTitle = "Delete confirmation";
      this.dialogText = "are you sure you want to remove this item?";
      this.cartId = item.id;
    },

    renderCartList(val) {
      for (let i = 0; i < val.length; i++) {
        let total = val[i].product.actual_price * val[i].quantity;
        let category = val[i].product.category;
        category = !this.productCategory.includes(category) ? category : null;
        this.perItemtotal.push(total);
        if (category !== null) this.productCategory.push(category);
      }
    },

    async commitDelete() {
      // commit delete
      this.isDialogLoading = true;
      await this.deleteCart(this.cartId);
      this.isDialogLoading = false;
      this.isDialogVisible = false;
    },
  },
};
</script>
