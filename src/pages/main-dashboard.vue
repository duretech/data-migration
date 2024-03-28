<template>
  <div class="main-dashboard">
    <b-card no-body>
      <div>
        <b-tabs pills card vertical class="tab-section">
          <div
            class="card-text text-right pt-0"
            :class="[connectText.val ? 'c-green' : 'c-red']"
          >
            <i
              v-if="connectText.val"
              class="fa fa-circle c-green"
              aria-hidden="true"
            ></i>
            <i v-else class="fa fa-circle c-red" aria-hidden="true"></i>
            {{ $t(`${connectText.text}`) }}
          </div>
          <b-tab
            :title="$t('intro')"
            :active="activeTab === 'intro'"
            @click="updateActiveTab('intro')"
          >
            <b-card-text class="pt-0">
              <b-card no-body class="card-box position-relative">
                <div
                  class="d-flex justify-content-center align-items-center mb-3 flex-direction-column"
                >
                  <div class="position-relative">
                    <img src="../assets/images/e.jpg" />
                    <div class="position-absolute text-img">
                      <p>{{ $t("migrationWork") }}</p>
                    </div>
                  </div>
                  <p class="text-md-start mb-0">
                    {{ $t("serverConnectivityNote") }}
                  </p>
                  <div class="text-md-start">
                    <ol>
                      <h4>{{ $t("preDDL") }}</h4>
                      <li>
                        {{ $t("p1") }}
                      </li>
                      <li>
                        {{ $t("p2") }}
                      </li>
                      <li>
                        {{ $t("p3") }}
                      </li>
                      <li>
                        {{ $t("p4") }}
                      </li>
                      <li>
                        {{ $t("p5") }}
                      </li>
                    </ol>
                  </div>
                </div>
              </b-card></b-card-text
            ></b-tab
          >
          <b-tab
            :title="$t('basicSetup')"
            @click="updateActiveTab('basicSetup')"
          >
            <b-card-text>
              <b-row class="main-tab-subsection">
                <b-col cols="12">
                  <div class="main-body mt-2 p-0">
                    <div>
                      <b-tabs content-class="mt-4 p-3">
                        <b-tab :title="$t('serverConnectivity')" active>
                          <serverConnectivity
                            v-if="appData"
                            :appData="appData"
                            @saveApp="saveApp"
                            @connected="connected"
                          ></serverConnectivity>
                          <b-spinner
                            type="grow"
                            label="Spinning"
                            v-else
                          ></b-spinner>
                        </b-tab>
                        <b-tab :title="$t('applicationSetup')">
                          <appSetup
                            v-if="appData"
                            :orgLevels="orgLevels"
                            :updateDOM="updateDOM"
                            :appData="appData"
                            @saveApp="saveApp"
                            :connectionStatus="connectionStatus"
                          ></appSetup>
                        </b-tab>
                      </b-tabs>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-tab>
          <b-tab
            :title="$t('dataMigration')"
            :active="
              activeTab === 'dataMigrationSync' ||
              activeTab === 'dataMigrationImp'
            "
            @click="updateActiveTab('dataMigrationSync')"
          >
            <b-card-text>
              <b-row class="tab-section main-tab-subsection">
                <b-col cols="12">
                  <div class="main-body mt-2 p-0">
                    <div>
                      <b-tabs content-class="mt-4 p-4 pt-2">
                        <b-tab
                          :title="$t('dataElementSync')"
                          :active="activeTab == 'dataMigrationSync'"
                        >
                          <div class="row d-flex justify-content-end mx-4">
                            <b-button
                              class="col-sm-3 w-auto btn-view"
                              @click="viewSyncData()"
                            >
                              <img src="../assets/images/icons/view-icon.svg" />
                              <span class="mx-2">
                                {{ $t("viewSyncedData") }}
                              </span>
                            </b-button>
                            <!-- <p></p> -->
                          </div>
                          <dataEleSync
                            v-if="appData"
                            :appData="appData"
                            :dataSetList="dataSetList"
                            :orgLevels="orgLevels"
                            :catComboID="catComboID"
                            :dataEleSyncData="dataEleSync"
                            @dataEleSync="dataEleSyncMethod"
                            :updateDOM="updateDOM"
                            @saveApp="saveApp"
                          ></dataEleSync>
                        </b-tab>
                        <b-tab
                          :title="$t('exportandImportData')"
                          :active="activeTab === 'dataMigrationImp'"
                        >
                          <expImpData
                            v-if="appData && dataSetList && dataSetList.length"
                            :appData="appData"
                            :emitObj="emitObj"
                            :orgLevels="orgLevels"
                            :dataSetList="dataSetList"
                            :dataEleSync="dataEleSync"
                            :updateDOM="updateDOM"
                            :updateExpImp="updateExpImp"
                            :connectionStatus="connectionStatus"
                          ></expImpData>
                        </b-tab>
                      </b-tabs>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </div>
    </b-card>
    <b-modal
      id="modal-xl"
      size="xl"
      centered
      hide-footer
      v-model="showDataModal"
      no-close-on-backdrop
      :title="$t('syncedData')"
    >
      <b-row>
        <b-col lg="6" class="my-1">
          <b-form-group
            :label="$t('search')"
            label-for="filter-input"
            class="mb-0"
          >
            <b-input-group>
              <b-form-input id="filter-input" v-model="filter"></b-form-input>

              <b-input-group-append
                class="mx-2"
                v-b-tooltip.hover
                :title="$t('clear')"
              >
                <b-button
                  :disabled="!filter"
                  @click="filter = ''"
                  class="btn-common"
                  >{{ $t("clear") }}</b-button
                >
              </b-input-group-append>
              <download-csv :data="tableRows">
                <b-button class="btn-common">
                  <img
                    :src="require(`@/assets/images/icons/downloadActive.svg`)"
                    :style="{ filter: filterColor }"
                    v-b-tooltip.hover
                    :title="$t('downloadIcon')"
                    class="img-fluid"
                /></b-button>
              </download-csv>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <div>
        <b-table
          hover
          bordered
          responsive
          show-empty
          sticky-header
          :items="tableRows"
          :fields="tableFields"
          head-variant="light"
          :empty-text="$t('no_data_to_display')"
          @filtered="onFiltered"
          :filter="filter"
          :filter-included-fields="filterOn"
        >
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { loadLanguage } from "@/i18n";
import service from "@/service";
import config from "@/config/config.js";
import { compress, decompress } from "compress-json";

export default {
  name: "mainDashboard",
  props: ["emitObj"],
  components: {
    expImpData: () =>
      import(
        /*webpackChunkName: 'expImpData'*/ "@/components/admin/expImpData.vue"
      ),
    dataEleSync: () =>
      import(
        /*webpackChunkName: 'expImpData'*/ "@/components/admin/dataEleSync.vue"
      ),
    appSetup: () =>
      import(
        /*webpackChunkName: 'expImpData'*/ "@/components/admin/appSetup.vue"
      ),
    serverConnectivity: () =>
      import(
        /*webpackChunkName: 'expImpData'*/ "@/components/admin/serverConnectivity.vue"
      ),
  },
  // mixins: [loadLocChildMixin],

  data() {
    return {
      showDataModal: false,
      orgLevels: [],
      dataSetList: [],
      catComboID: "",
      dataEleSync: null,
      tableFields: [],
      applicationModule: JSON.parse(JSON.stringify(config.applicationModule)),
      // orgList: [],
      // levelIDList: [],
      appData: null,
      updateDOM: 0,
      filter: null,
      filterOn: [],
      filterColor: "red",
      tableRows: [],
      updateExpImp: true,
      connectionStatus: false,
      activeTab: "intro",
      connectText: {
        val: false,
        text: "Disconnected",
      },
    };
  },
  watch: {
    async connectionStatus(newVal) {
      await this.getOrgLevels();
      await this.getDataSets();
      this.$store.commit("setLoading", false);
    },
    emitObj: {
      handler(newVal) {
        if (newVal.type != "delete") this.activeTab = "dataMigrationImp";
      },
      deep: true,
    },
  },
  computed: {
    // orgOptionsUpdated() {
    //   let list = [];
    //   if (this.selectedOrgLevel && this.orgOptions.length) {
    //     list = this.newLocList(
    //       JSON.parse(JSON.stringify(this.orgOptions)),
    //       this.selectedOrgLevel
    //     );
    //     console.log(list, this.selectedOrgLevel);
    //   }
    //   return list;
    // },
    // selectedOrgLevel() {
    //   console.log("calling selectedOrgLevel", this.orgLevels);
    //   let level = null;
    //   //   if (this.orgLevels.length > 0) {
    //   let zone = this.orgLevels.find((o) =>
    //     o.text.toLowerCase().includes("zone")
    //   );
    //   if (zone) {
    //     level = zone.value;
    //   } else {
    //     let zoneLevels = this.orgLevels?.map((o) => o.value * 1);
    //     level = Math.max(...zoneLevels);
    //   }
    //   if (level && this.orgOptions.length) {
    //     // eslint-disable-next-line
    //     this.orgOptionsUpdated = this.newLocList(
    //       JSON.parse(JSON.stringify(this.orgOptions)),
    //       level
    //     );
    //   }
    //   //  }
    //   return level;
    // },
  },
  methods: {
    updateActiveTab(newTab) {
      this.activeTab = newTab;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    updateTable() {
      this.tableRows = [];
      this.tableFields = [
        {
          key: `${this.$i18n.t("serverA")}`,
          label: `${this.$i18n.t("serverA")}`,
        },
        {
          key: `${this.$i18n.t("serverB")}`,
          label: `${this.$i18n.t("serverB")}`,
        },
      ];
      // console.log(this.tableFields, "this.tableFields");
      Object.keys(this.dataEleSync).forEach((deId) => {
        let innerObj = this.dataEleSync[deId],
          obj = {};
        obj[this.$i18n.t("serverA")] = innerObj["TeachingDEName"];
        obj[this.$i18n.t("serverB")] = innerObj["LiveDEName"];
        this.tableRows.push(obj);
      });
    },
    viewSyncData() {
      this.updateTable();
      this.showDataModal = true;
    },
    saveApp(newVal, reload) {
      this.appData = newVal;
      this.saveAppData(reload);
    },
    connected(val) {
      if (val) {
        this.connectText.val = true;
        this.connectText.text = "Connected";
      } else {
        this.connectText.val = false;
        this.connectText.text = "Disconnected";
      }
    },
    async getDESyncData() {
      let key = this.generateKey("DESyncData");
      await service
        .getSavedConfig({ tableKey: key })
        .then(async (response) => {
          this.dataEleSync = response.data;
          this.updateTable();
        })
        .catch(() => {
          this.dataEleSync = null;
        });
    },
    dataEleSyncMethod(data) {
      this.dataEleSync = data;
      this.updateExpImp = !this.updateExpImp;
      this.updateTable();
    },
    checkDataStore() {
      //this.appData = config.applicationModule;
      // console.log("Calling checkdatastore from main-dashboard");
      if (
        this.$store.getters.getDataStoreKeys &&
        Object.keys(this.$store.getters.getDataStoreKeys).length === 0
      ) {
        service
          .getAllKeys({})
          .then((response) => {
            this.$store.commit("setDataStoreKeys", response.data);
          })
          .then(() => {
            this.setLocale();
            // if (
            //   !this.$store.getters.getIsMultiProgram &&
            //   !(
            //     this.$store.getters.getIsAdmin &&
            //     this.$store.getters.getAppSettings.bypassUser
            //   )
            // ) {
            //   this.setUserPermissions();
            // }
          })
          .catch((err) => {
            console.log(err, "error in applmodule");
            this.$store.commit("setLoading", false);

            // Popup message to contact admin for the configurations
            this.sweetAlert({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("contactAdmin"),
            });
          });
      } else {
        this.setLocale();
        // if (
        //   !this.$store.getters.getIsMultiProgram &&
        //   !(
        //     this.$store.getters.getIsAdmin &&
        //     this.$store.getters.getAppSettings.bypassUser
        //   )
        // ) {
        //   this.setUserPermissions();
        // }
      }
    },
    async setLocale() {
      if (
        Object.keys(this.$store.getters.getApplicationModule()).length === 0
      ) {
        // This is to generate the key format of the configurations files for the Sandbox/standard app.
        // The "generateKey" function is coming from "@/helpers/GlobalMixin.js" file.
        let key = this.generateKey("applicationModule");
        // By default, we are calling the 'applicationSetup' config file using the local/language set in the 'this.$i18n.locale' global variable.
        service
          .getSavedConfig({ tableKey: key })
          .then(async (response) => {
            if (this.$i18n.locale !== response.data.defaultLanguageLocale) {
              this.$i18n.locale = response.data.defaultLanguageLocale;
              await loadLanguage(response.data.defaultLanguageLocale);
            }

            this.setApplicationDetails(response); // Set the 'applicationSetup' config file response in the store
          })
          .then(async () => {
            if (this.appData?.serverConnections) {
              this.appData.serverConnections =
                typeof this.appData?.serverConnections === "object"
                  ? this.appData.serverConnections
                  : decompress(JSON.parse(this.appData.serverConnections));
            }
            //this.getLocationList();
            if (
              this.appData?.serverConnections?.serverAURL &&
              this.appData?.serverConnections?.serverACredentials?.username &&
              this.appData?.serverConnections?.serverACredentials?.password
            ) {
              await this.getDataSets();
              await this.getOrgLevels();
              await this.getCatComboID();
              await this.getDESyncData();
              this.$store.commit("setLoading", false);
              if (this.appData?.serverConnections.connectionStatus) {
                this.connectText.val = true;
                this.connectText.text = "Connected";
              } else {
                this.connectText.val = false;
                this.connectText.text = "Disconnected";
              }
            }
          })
          .catch((err) => {
            // console.log(err, "err");
            console.log("Failed in set locale...", err);
            this.$store.commit("setLoading", false);
          });
      } else {
        this.appData = this.$store.getters.getApplicationModule();
        if (this.appData?.serverConnections) {
          this.appData.serverConnections =
            typeof this.appData?.serverConnections === "object"
              ? this.appData.serverConnections
              : decompress(JSON.parse(this.appData.serverConnections));
        }
        if (this.$i18n.locale !== this.appData.defaultLanguageLocale) {
          this.$i18n.locale = this.appData.defaultLanguageLocale;
          await loadLanguage(this.appData.defaultLanguageLocale);
        }

        // Set the theme on hot-reload
        service.applyTheme();
        //this.getLocationList();
        if (
          this.appData?.serverConnections?.serverAURL &&
          this.appData?.serverConnections?.serverACredentials?.username &&
          this.appData?.serverConnections?.serverACredentials?.password
        ) {
          await this.getDataSets();
          await this.getOrgLevels();
          await this.getCatComboID();
          await this.getDESyncData();
          if (this.appData.serverConnections.connectionStatus) {
            this.connectText.val = true;
            this.connectText.text = "Connected";
          } else {
            this.connectText.val = false;
            this.connectText.text = "Disconnected";
          }
          this.$store.commit("setLoading", false);
        }
      }
    },
    async getDataSets() {
      if (!this.$store.getters.getDataSetList) {
        await service
          .getDataSets({ secondary: true })
          .then((resp) => {
            if (resp.data) {
              this.$store.commit("setDataSetList", resp.data.dataSets);
              let arr = [];
              arr = resp.data.dataSets.map((obj) => {
                return { id: obj.id, label: obj.displayName };
              });

              this.dataSetList = arr;
            }
          })
          .catch((err) => {
            this.dataSetList = [];
            console.log("Soemthing went wrong..");
          });
      } else {
        let arr = [];
        arr = this.$store.getters.getDataSetList.map((obj) => {
          return { id: obj.id, label: obj.displayName };
        });
        this.dataSetList = arr;
      }
    },
    async saveAppData(reload) {
      let key = this.generateKey("applicationModule");
      this.appData.serverConnections = JSON.stringify(
        compress(this.appData.serverConnections)
      );
      await service
        .updateConfig({
          data: this.appData,
          tableKey: key,
        })
        .then(async (resp) => {
          if (resp.data.status === "OK") {
            this.$store.commit("setApplicationModule", this.appData);
            if (this.$i18n.locale !== this.appData.defaultLanguageLocale) {
              this.$i18n.locale = this.appData.defaultLanguageLocale;
              await loadLanguage(this.appData.defaultLanguageLocale);
            }
            this.$nextTick(async () => {
              this.updateDOM++;
              this.$store.commit("setStoreValues");
              this.$store.commit("setIsClearCache", true);
              // console.log("reload" ,reload)
              if (reload) {
                this.connectionStatus = !this.connectionStatus;
              }
              this.$store.commit("setLoading", false);
            });
            // location.reload(reload);
          }
        });
    },
    /**
     * Get Org levels
     */
    async getOrgLevels() {
      if (!this.$store.getters.getOrgLevels) {
        let l = await service
          .getOrganisationUnitLevels({ secondary: true })
          .then((l) => {
            this.orgLevels = l.data.map((obj) => {
              return { value: obj.level, text: obj.displayName };
            });
            this.$store.commit("setOrgLevels", l.data);
          })
          .catch((err) => {
            console.log(err, "insecdplace");
            this.orgLevels = [];

            // this.sweetAlert({
            //   title: this.$i18n.t("error"),
            //   text: this.$i18n.t("somethingWentwrong"),
            // });
          });
        // console.log(l.data, "org data");
      } else {
        this.orgLevels = this.$store.getters.getOrgLevels.map((obj) => {
          return { value: obj.level, text: obj.displayName };
        });
      }
    },
    async getCatComboID() {
      service
        .getdefaultCategoryCombo("default")
        .then((resp) => {
          if (resp.data) {
            let catIdArr = resp.data.categoryCombos.filter((obj) => {
              return obj["displayName"] === "default";
            });
            // console.log(resp.data, "default category");
            if (catIdArr.length) {
              let catId = catIdArr[0]["id"];
              this.catComboID = catId;
            } else {
              this.catComboID = null;
            }
          }
          // this.showLoader = false;
        })
        .catch((err) => {
          this.sweetAlert({
            title: this.$i18n.t("error"),
            text: this.$i18n.t("somethingWentwrong"),
          });
        });
    },
    // setOrgData(orgList) {
    //   // console.log(this.$store.getters.getApplicationModule(this.$store.getters.namespace).defaultLevelID)
    //   // console.log("orgList" , orgList)
    //   let filterLevel = 0,
    //     // this.$store.getters.getUserDetails?.dataViewOrganisationUnits?.[0]?.level || 0,
    //     defaultLevelID = this.$store.getters.getApplicationModule(
    //       this.$store.getters.namespace
    //     ).defaultLevelID;
    //   if (filterLevel < defaultLevelID) {
    //     filterLevel = defaultLevelID;
    //   }
    //   this.levelIDList = orgList.filter((org) => org.level >= filterLevel);
    //   this.orgList = orgList;
    // },

    /**
     * To set the applicationSetup config in the store.
     * @params 1) response = applicationSetup config file response
     */
    setApplicationDetails(response) {
      this.$store.commit("setApplicationModule", response.data);
      this.appData = response.data; // Set the response in the local variable to use further
      // Set locale/language for the moment library
      this.$moment.locale(this.$i18n.locale);
      //this.$store.commit("setTheme", response.data.defaultColorTheme); // Set the theme in to store
      this.$store.commit("setLocalLang", response.data.defaultLanguageLocale); // Set the defaultLanguageLocale in to store
      // Set the theme

      service.applyTheme();
    },
  },
  async created() {
    this.$store.commit("setLoading", true);
    this.checkDataStore();
    let userData = await service.getLoggedInUser();
    this.$store.commit("setUserDetails", userData.data);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
