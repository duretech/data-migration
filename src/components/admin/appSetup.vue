<template>
  <div>
    <div class="row mt-3">
      <div class="col-lg-12">
        <div class="form-group row">
          <label for="inputDefaultLevelID" class="col-sm-3 col-form-label">
            {{ $t("level") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-select
                id="orgLevels"
                class="form-control"
                v-model="defaultLevelID"
                :options="orgLevels"
              ></b-form-select>
              <!-- <select
                class="form-control"
                id="inputDefaultLevelID"
                v-model="defaultLevelID"
              >
                <option
                  v-for="(level, index) in orgLevels"
                  :key="index"
                  :value="level.value"
                >
                  {{ level.text }}
                </option>
              </select> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row mt-3">
      <div class="col-lg-12">
        <div class="form-group row">
          <label for="inputSubLevelID" class="col-sm-3 col-form-label">
            {{ $t("subLevel") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-select
                id="orgLevels"
                class="form-control"
                v-model="subLevelID"
                :options="subLevelIDList"
              ></b-form-select>
             
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="row mt-3">
      <div class="col-lg-12">
        <div class="form-group row">
          <label for="inputDefaultLocationID" class="col-sm-3 col-form-label">
            {{ $t("locationName") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <select
                class="form-control"
                id="inputDefaultLocationID"
                v-model="defaultLocationID"
              >
                <option
                  v-for="(location, index) in locationIDList"
                  :key="index"
                  :value="location.id"
                >
                  {{ location.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-lg-12">
        <div class="form-group row">
          <label for="localLang" class="col-sm-3 col-form-label">
            {{ $t("defaultLanguage") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <select
                class="form-control"
                id="inputDefaultLevelID"
                v-model="localLang"
              >
                <option
                  v-for="(lng, index) in langList"
                  :key="index"
                  :value="lng"
                >
                  {{ $t(`${lng}`) }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-lg-12">
        <div class="form-group row">
          <label for="inputDefaultLevelID" class="col-sm-3 col-form-label">
            {{ $t("zoneLevel") }}
          </label>
          <div class="col-sm-9">
            <div class="select-wrapper">
              <b-form-select
                id="orgLevels"
                class="form-control"
                v-model="defaultZoneLevel"
                :options="subLevelIDList"
              ></b-form-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row text-end mt-4">
      <div class="col-lg-12">
        <b-button class="blue-btn" @click="saveData">{{ $t("save") }}</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/service";
import config from "@/config/config.js";
export default {
  props: ["orgLevels", "appData", "connectionStatus"],
  components: {},
  mixins: [],
  data() {
    return {
      appFetchData: this.appData,
      applicationModule: JSON.parse(JSON.stringify(config.applicationModule)),
      langList: [],
      organizationList: [],
      defaultLevelID: "",
      subLevelID: "",
      defaultLocationID: "",
      defaultZoneLevel: "",
      localLang: "",
      appOrgLevels: this.orgLevels,
    };
  },
  watch: {
    appData: {
      handler(newVal) {
        this.appFetchData = newVal;
      },
      deep: true,
    },
    orgLevels: {
      handler(newVal) {
        this.appOrgLevels = newVal;
      },
      deep: true,
    },
    connectionStatus(newVal) {
      console.log("connectionStatus watch", newVal);
      this.getConfigData();
    },
    // defaultLevelID: function (newVal) {
    //   this.$store.getters.getApplicationModule(
    //     this.$store.getters.namespace
    //   ).defaultLevelID = newVal;
    // },
    // subLevelID: function (newVal) {
    //   this.$store.getters.getApplicationModule(
    //     this.$store.getters.namespace
    //   ).subLevelID = newVal;
    // },
    // defaultLocationID: function (newVal) {
    //   this.$store.getters.getApplicationModule(
    //     this.$store.getters.namespace
    //   ).defaultLocationID[0] = newVal;
    // },
    // localLang(newVal) {
    //
    // },
  },
  computed: {
    subLevelIDList: function () {
      // console.log(
      //   "changing subLevelIDList",
      //   this.levelIDList,
      //   this.defaultLevelID
      // );
      // if (this.levelIDList && this.levelIDList.length) {
      return this.levelIDList.filter((item) => {
        // console.log(item.value, this.defaultLevelID, this.levelIDList.length);

        if (
          item.value === this.defaultLevelID &&
          this.levelIDList.length === 1
        ) {
          return item;
        }
        if (item.value > this.defaultLevelID) {
          return item;
        }
      });
      // } else {
      //   return [];
      // }
    },
    levelIDList() {
      let filterLevel = 0,
        defaultLevelID = this.defaultLevelID;
      if (filterLevel < defaultLevelID) {
        filterLevel = defaultLevelID;
      }
      // console.log(
      //   "changing levelIDList",
      //   filterLevel,
      //   this.defaultLevelID,
      //   this.appOrgLevels
      // );
      let list = this.appOrgLevels.filter((org) => org.value >= filterLevel);
      return list;
    },
    locationIDList: function () {
      // console.log("this.organizationList", this.organizationList);
      if (this.organizationList && this.organizationList.length) {
        let orgList = this.organizationList.filter(
          (org) => org.level === this.defaultLevelID
        );
        return orgList;
      } else {
        return [];
      }
    },
  },
  methods: {
    saveData() {
       console.log(
        this.appFetchData?.serverConnections,
        "this.appFetchData?.serverConnections on saving"
      );
      // this.$store.commit("setLoading", true);
      this.appFetchData.defaultLevelID = this.defaultLevelID;
      this.appFetchData.subLevelID = this.subLevelID;
      // console.log(
      //   "defaultLocationID",
      //   this.defaultLocationID,
      //   this.appFetchData.defaultLocationID
      // );
      this.appFetchData.defaultLocationID = [];
      this.appFetchData.defaultLocationID[0] = this.defaultLocationID;
      this.appFetchData.defaultZoneLevel = this.defaultZoneLevel;
      this.appFetchData.defaultLanguageLocale = this.localLang;
      this.$store.commit("setLocalLang", this.localLang);
      this.$emit("saveApp", this.appFetchData, true);
      this.sweetAlert({
        title: this.$i18n.t("success"),
        // text: alertText,
        html: `<div>${this.$i18n.t("savedSuccessful")}</div>`,
      });
    },
    async getConfigData() {
      let lnglist = [];
      // if (this.$store.getters.getAppSettings?.langList?.length > 0) {
      //   this.$store.getters.getAppSettings.langList.forEach((lng) => {
      //     lnglist.push({ text: this.$i18n.t(lng), value: lng });
      //   });
      this.langList = this.$store.getters.getAppSettings?.langList;
      // }
      this.defaultLevelID = this.appFetchData.defaultLevelID;
      this.subLevelID = this.appFetchData.subLevelID;
      this.defaultLocationID = this.appFetchData.defaultLocationID[0];
      this.localLang = this.appFetchData.defaultLanguageLocale;
      this.defaultZoneLevel = this.appFetchData.defaultZoneLevel;
      console.log(
        this.appFetchData?.serverConnections,
        "this.appFetchData?.serverConnections"
      );
      if (this.appFetchData?.serverConnections.connectionStatus) {
        await service
          .getOrganisation({ secondary: true })
          .then((orgList) => {
            this.organizationList = orgList.data.organisationUnits;
            console.log(this.organizationList, "organizationList from api");
          })
          .catch((err) => {
            this.organizationList = [];
          });
      } else {
        this.organizationList = [];
      }

      console.log(
        this.appFetchData?.serverConnections.connectionStatus,
        this.organizationList
      );
    },
  },
  created() {
    //to check if we have credentials stored

    this.getConfigData();
  },
};
</script>
