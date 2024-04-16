<template>
  <div class="tab-section p-2 pt-0">
    <div class="row">
      <div class="col-lg-12">
        <h5 class="mb-4 mt-3">{{ $t("secondaryInstance") }}</h5>
        <div class="form-group row mb-3">
          <label for="input-1" class="col-sm-3 col-form-label">
            {{ $t("serverUrl") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-input
                id="input-1"
                v-model="serverConnections.serverAURL"
                type="text"
                :placeholder="$t('enterServerURL')"
                required
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="form-group row mb-3" v-if="showFieldsBtns">
          <label for="input-2" class="col-sm-3 col-form-label">
            {{ $t("username") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-input
                id="input-2"
                v-model="serverConnections.serverACredentials.username"
                type="text"
                :placeholder="$t('username')"
                required
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="form-group row mb-3" v-if="showFieldsBtns">
          <label for="input-3" class="col-sm-3 col-form-label">
            {{ $t("password") }}
          </label>
          <div class="col-sm-9">
            <div
              class="select-wrapper d-flex justify-content-center align-items-center"
            >
              <b-form-input
                id="input-3"
                v-model="serverConnections.serverACredentials.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('password')"
                required
              ></b-form-input>

              <img
                v-if="!eyeCloseA"
                @click="showPassword = !showPassword"
                src="../../assets/images/eye.png"
                class="eye-icon"
              />
              <img
                v-if="eyeCloseA"
                @click="showPassword = !showPassword"
                src="../../assets/images/hide.png"
                class="eye-icon"
              />

              <!-- <button class="blue-btn" > -->
              <!-- {{ ButtonAText }} -->
              <!-- </button> -->
              <!-- <i class="fa fa-eye"></i> -->
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 d-none">
        <h5 class="mb-4">Server B Credentials</h5>
        <div class="form-group row mb-3">
          <label for="input-4" class="col-sm-3 col-form-label">
            {{ $t("serverUrl") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-input
                id="input-4"
                v-model="serverConnections.serverBURL"
                type="text"
                :placeholder="$t('enterServerURL')"
                required
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="form-group row mb-3">
          <label for="input-5" class="col-sm-3 col-form-label">
            {{ $t("username") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-input
                id="input-5"
                v-model="serverConnections.serverBCredentials.username"
                type="text"
                :placeholder="$t('username')"
                required
              ></b-form-input>
            </div>
          </div>
        </div>
        <div class="form-group row mb-3">
          <label for="input-6" class="col-sm-3 col-form-label">
            {{ $t("password") }}
          </label>
          <div class="row col-sm-9">
            <div class="select-wrapper d-flex">
              <b-form-input
                id="input-6"
                v-model="serverConnections.serverBCredentials.password"
                :type="showPasswordB ? 'text' : 'password'"
                :placeholder="$t('password')"
                required
              ></b-form-input>

              <!-- <button @click="showPasswordB = !showPasswordB">{{ ButtonBText }}</button> -->
              <img
                v-if="!eyeCloseB"
                @click="showPasswordB = !showPasswordB"
                src="../../assets/images/eye.png"
                class="eye-icon"
              />
              <img
                v-if="eyeCloseB"
                @click="showPasswordB = !showPasswordB"
                src="../../assets/images/hide.png"
                class="eye-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex justify-content-end align-items-center mt-3"
      v-if="showFieldsBtns"
    >
      <div v-if="showFieldsBtns && !this.serverConnections.connectionStatus">
        <b-icon
          class="mx-4 c-pointer icon-info"
          icon="info-circle-fill"
          scale="2"
          variant="info"
          @click="showModal()"
        ></b-icon>
      </div>
      <div class="text-center">
        <b-button
          class="col-sm-2 blue-btn w-auto"
          @click="saveConnection('connect')"
        >
          {{ $t("connect") }}
        </b-button>
      </div>
    </div>
    <div
      class="row float-right d-flex justify-content-end align-items-end mt-3"
      v-if="!showFieldsBtns"
    >
      <div class="text-center">
        <b-button
          class="col-sm-2 blue-btn w-auto mx-2"
          @click="saveConnection('disconnect')"
        >
          {{ $t("disconnect") }}
        </b-button>
      </div>
    </div>
    <div
      class="row float-right d-flex justify-content-end align-items-end mt-3"
      v-if="!showFieldsBtns"
    >
      <div class="text-center">
        <b-button class="col-sm-2 blue-btn w-auto" @click="resetAction">
          {{ $t("reset") }}
        </b-button>
      </div>
    </div>
    <b-modal v-model="modalShow" :title="$t('troubleshooting')">
      <b-table striped hover :items="items"></b-table>
      <template #modal-footer="{ cancel }">
        <b-button @click="cancel"> {{ $t("close") }}</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import service from "@/service";
export default {
  name: "serverConnectivity",
  props: ["appData"],
  data() {
    return {
      appDataLocal: this.appData,
      showPassword: false,
      showPasswordB: false,
      eyeCloseA: false,
      eyeCloseB: false,
      ButtonBText: "Show",
      ButtonAText: "Show",
      serverConnections: {
        serverAURL: "",
        serverBURL: "",

        serverACredentials: {
          username: "",
          password: "",
        },
        serverBCredentials: {
          username: "",
          password: "",
        },
      },
      reset: false,
      modalShow: false,
      items: [],
    };
  },
  computed: {
    showFieldsBtns() {
      if (!this.reset) {
        return (
          !this.serverConnections.connectionStatus &&
          (this.reset || !this.serverConnections.connectionStatus)
        );
      } else {
        return true;
      }
    },
  },
  methods: {
    async saveConnection(val) {
      this.$store.commit("setLoading", true);

      if (!this.appDataLocal.serverConnections)
        this.appDataLocal.serverConnections = {};

      this.appDataLocal.serverConnections = this.serverConnections;

      let encodedData = btoa(
        [
          this.serverConnections.serverACredentials.username,
          this.serverConnections.serverACredentials.password,
        ].join(":")
      ); // encode a string
      // console.log("btoa", encodedData); // -> 'Basic as8dfoasdfaslj=='
      this.$store.commit("setSecondaryServerAuth", encodedData);
      this.$store.commit(
        "setSecondaryServerUrl",
        this.appDataLocal.serverConnections.serverAURL
      );
      encodedData = "Basic " + encodedData;
      let secondaryHeader = {
        "Cache-Control": "no-cache",
        Authorization: encodedData, //generate basic auth
      };
      this.$store.commit("setSecondaryHeader", secondaryHeader);
      if (val == "connect") {
        this.getOrgLevels();
      } else {
        this.$store.commit("setLoading", false);
        this.$swal({
          text: this.$i18n.t("noRetrive"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: this.$i18n.t("yDisconnect"),
          cancelButtonText: this.$i18n.t("cancel"),
        }).then((result) => {
          this.$store.commit("setLoading", true);
          if (result.isConfirmed) {
            this.serverConnections.serverACredentials.username = ""
            this.serverConnections.serverACredentials.password = ""
            this.appDataLocal.serverConnections.connectionStatus = false;
            this.reset = true;
            this.$emit("saveApp", this.appDataLocal, true);
          }
          else{
            this.$store.commit("setLoading", false);
          }
        });
      }
    },
    async getOrgLevels() {
      await service
        .getOrganisationUnitLevels({ secondary: true })
        .then((l) => {
          this.appDataLocal.serverConnections.connectionStatus = true;
          this.orgLevels = l.data.map((obj) => {
            return { value: obj.level, text: obj.displayName };
          });
          this.$store.commit("setOrgLevels", l.data);
          this.$emit("saveApp", this.appDataLocal, true);
          this.sweetAlert({
            title: this.$i18n.t("success"),
            // text: alertText,
            html: `<div>${this.$i18n.t("connectionSuccessful")}</div>`,
          });
        })
        .catch((err) => {
          this.appDataLocal.serverConnections.connectionStatus = false;
          this.$emit("saveApp", this.appDataLocal, true);
          this.sweetAlert({
            title: this.$i18n.t("success"),
            // text: alertText,
            html: `<div>${this.$i18n.t("unauthorised")}</div>`,
          });
        });
      this.reset = false;
    },

    resetAction() {
      this.reset = true;
    },
    showModal() {
      (this.items = [
        {
          [this.$i18n.t("sno")]: 1,
          [this.$i18n.t("reasons")]: this.$i18n.t("r1"),
        },
        {
          [this.$i18n.t("sno")]: 2,
          [this.$i18n.t("reasons")]: this.$i18n.t("r2"),
        },
        {
          [this.$i18n.t("sno")]: 3,
          [this.$i18n.t("reasons")]: this.$i18n.t("r3"),
        },
      ]),
        (this.modalShow = true);
    },
  },
  watch: {
    appData: {
      handler(newVal) {
        this.appDataLocal = newVal;
      },
      deep: true,
    },
    showPasswordB(newVal) {
      this.ButtonBText = newVal ? "Hide" : "Show";
      this.eyeCloseB = !this.eyeCloseB;
    },
    showPassword(newVal) {
      this.ButtonAText = newVal ? "Hide" : "Show";
      this.eyeCloseA = !this.eyeCloseA;
    },
  },
  created() {
    if (this.appDataLocal?.serverConnections?.serverAURL)
      this.serverConnections = this.appDataLocal.serverConnections;
  },
};
</script>

<style>
.text-info {
  color: var(--blue-btn-color) !important;
}
.c-pointer {
  cursor: pointer;
}
</style>
