<template>
  <div>
    <v-card :loading="isLoading" outlined>
      <v-container>
        <div class="d-flex flex-row">
          <v-icon color="grey darken-3" size="30">
            mdi-account-multiple
          </v-icon>

          <span
            class="mx-3 text-h5 grey--text text--darken-3 font-weight-black"
          >
            Users
          </span>

          <v-spacer></v-spacer>

          <v-chip small>
            <span>{{ countedUser }} Users</span>
          </v-chip>
        </div>
      </v-container>
      <v-divider></v-divider>
      <v-card-title>
        <div>
          <v-tabs v-model="selectedTab">
            <v-tab
              v-for="item in tabItems"
              :key="item.text"
              @click.prevent="item.action"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
        </div>
        <v-spacer></v-spacer>
        <v-select
          v-model="dropDownFilter"
          @change="filter"
          class="mt-5 mx-5 font-weight-regular"
          :items="userCategory"
          label="Filter by category"
          :clearable="true"
          size="2"
          dense
          outlined
          rounded
        ></v-select>

        <v-btn @click="openForm" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-container>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          outlined
        ></v-text-field>
      </v-container>
      <v-data-table
        :headers="headers"
        :items="users.data"
        :search="search"
        no-data="No data available"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="selectedTab == 0" @click="onActionEdit(item.id)">
            mdi-pencil
          </v-icon>
          <v-icon v-if="selectedTab == 0" @click="onActionDelete(item)">
            mdi-delete
          </v-icon>
          <v-btn
            class="teal darken-1"
            v-if="selectedTab == 2"
            x-small
            dark
            rounded
            @click="onRestoreAction(item)"
          >
            restore
          </v-btn>
          <v-btn
            class="teal darken-1"
            v-if="selectedTab == 1"
            @click="onActionApprove(item)"
            x-small
            dark
            rounded
          >
            <v-icon x-small>mdi-checkbox-marked-circle-outline</v-icon>
            approve
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <UserFormDialog
      :dialog.sync="formDialog"
      :emit.sync="emitWhenRegister"
    ></UserFormDialog>
    <Dialog
      :visible.sync="confirmDailog"
      :title="confirmDialogTitle"
      :text="confirmDialogText"
      :loading="isDialogLoading"
      :confirm="hasConfirmButton"
      :action.sync="commitAction"
    ></Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserFormDialog from "@/components/user/UserFormDialog";
import Dialog from "@/components/Dialog";

export default {
  name: "UserList",

  components: { UserFormDialog, Dialog },

  data() {
    return {
      search: "",
      isLoading: false,
      isDialogLoading: false,
      hasConfirmButton: true,
      formDialog: false,
      selectedTab: null,
      confirmDailog: false,
      confirmDialogTitle: "",
      confirmDialogText: "",
      selectedAction: null,
      dropDownFilter: null,
      commitData: Object,
      countedUser: 0,

      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Username",
          value: "username",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Category",
          value: "user_type",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
        },
      ],

      tabItems: [
        {
          text: "active users",
          action: this.activeUserAction,
        },
        {
          text: "needs approval",
          action: this.pendingUserAction,
        },
        {
          text: "archive",
          action: this.archiveUserAction,
        },
      ],
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.getUsers();
    await this.getUserCategory();
    if (this.users.data.length > 0) {
      this.isLoading = false;
      this.countedUser = this.users.data.length;
    }
  },

  watch: {
    users: function (val) {
      let users = val.data;
      // modify user type as readable types
      for (let x of users) {
        switch (x.user_type) {
          case "admin":
            x.user_type = "Super Admin";
            break;
          case "store_admin":
            x.user_type = "Store Owner";
            break;
          default:
            x.user_type = "Customer";
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      users: "user/users",
      response: "user/response",
      userCategory: "user/userCategory",
    }),
  },

  methods: {
    ...mapActions({
      getUsers: "user/getUsers",
      approveUser: "user/approveUser",
      deleteUser: "user/deleteUser",
      restoreUser: "user/restoreUser",
      getUserCategory: "user/getUserCategory",
    }),

    async activeUserAction() {
      this.isLoading = true;
      await this.getUsers();
      this.countedUser = this.users.data.length;

      this.loader();
    },

    async pendingUserAction() {
      this.isLoading = true;
      const params = { is_approved: false };
      await this.getUsers(params);
      this.countedUser = this.users.data.length;

      this.loader();
    },

    async archiveUserAction() {
      this.isLoading = true;
      const params = { archive: "archive" };
      await this.getUsers(params);
      this.countedUser = this.users.data.length;

      this.loader();
    },

    onActionApprove(item) {
      this.selectedAction = "approve";
      this.confirmDialogTitle = "Are you sure you want to approve?";
      this.confirmDialogText =
        "this user will be allowed to make a store and sell products online. Please have time to review.";
      this.commitData = item;
      this.confirmDailog = true;
    },

    onActionEdit(item) {
      console.log(`edit ${item}`);
    },

    onActionDelete(item) {
      this.selectedAction = "delete";
      this.commitData = item;
      this.confirmDialogTitle = "Are you sure you want to delete user?";
      this.confirmDialogText = `all data of ${item.name} will be permanently deleted.`;
      this.confirmDailog = true;
    },

    async onRestoreAction(item) {
      await this.restoreUser(item.id);
      this.selectedAction = "archive";
      if (this.response.code == 200) {
        await this.archiveUserAction();
        this.confirmDialogTitle = "User restored";
        this.confirmDialogText =
          "user restored is now back on on any site transaction.";
        this.hasConfirmButton = false;
        this.confirmDailog = true;
      } else {
        this.confirmDialogTitle = "Failed";
        this.confirmDialogText = this.response.message;
        this.hasConfirmButton = false;
        this.confirmDailog = true;
      }
    },

    async commitAction() {
      switch (this.selectedAction) {
        case "approve":
          this.confirmDailog = false;
          await this.approveUser(this.commitData.id); // commit approve
          if (this.response.code == 200) {
            this.selectedAction = "";
            // make success message
            this.confirmDialogTitle = "Success!";
            this.confirmDialogText = "User successfully approve";
            this.confirmDailog = true;
            await this.pendingUserAction(); // re-render data
          }
          break;
        case "delete":
          this.isDialogLoading = true;
          this.hasConfirmButton = false;
          await this.deleteUser(this.commitData.id);
          setTimeout(() => {
            this.isDialogLoading = false;
            this.confirmDialogTitle = "";
            this.confirmDialogText = "User successfully delete!";
          }, 1500);
          await this.activeUserAction();
          break;
        default:
          this.confirmDialog = false;
      }
    },

    async filter() {
      let params = {};
      let userType = "";
      if (this.dropDownFilter !== null) {
        this.isLoading = true;
        for (let data of this.userCategory) {
          if (data.value == this.dropDownFilter) {
            userType = this.dropDownFilter;
          }
        }
        // trap parameter by base on selected tab
        switch (this.selectedTab) {
          case 0:
            params = Object.assign({ user_type: userType });
            break;
          case 1:
            params = Object.assign({ user_type: userType, is_approved: false });
            break;
          case 2:
            params = Object.assign({ user_type: userType, archive: "archive" });
            break;
        }
        await this.getUsers(params);
        this.loader();
      } else {
        // re-render table base on current tab
        switch (this.selectedTab) {
          case 0:
            await this.activeUserAction();
            break;
          case 1:
            await this.pendingUserAction();
            break;
          case 2:
            await this.archiveUserAction();
            break;
        }
      }
    },

    emitWhenRegister() {
      this.activeUserAction();
    },

    loader() {
      if (this.users.data.length > 0) {
        this.isLoading = false;
      } else {
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
      }
    },

    openForm() {
      this.formDialog = true;
    },
  },
};
</script>
