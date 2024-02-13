<template>
  <div id="app">
    <D2Header></D2Header>
    <Loader v-if="$store.getters.getLoading" />
    <HeaderBar
      @langChange="langChange"
      :langList="langList"
      @emitExecute="emitExecute"
    ></HeaderBar>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <router-view
      v-if="$store.getters.getBaseURL"
      :emitObj="emitObj"
    ></router-view>
    <UploadConfig
      :uploadConfig="uploadConfig"
      @uploadSuccess="uploadSuccess"
      @hideModal="uploadConfig = false"
    />
  </div>
</template>

<script>
import service from "@/service";
import { loadLanguage } from "@/i18n";
import { decompress } from "compress-json";

// import HelloWorld from "./components/HelloWorld.vue";
import D2Header from "@/components/Common/D2Header";
import HeaderBar from "@/components/Common/HeaderBar";

export default {
  name: "App",
  components: {
    // HelloWorld,
    D2Header,
    HeaderBar,
    UploadConfig: () =>
      import(
        /*webpackChunkName: 'UploadConfig'*/ "@/components/Common/UploadConfig"
      ), //lazy loading components,
  },
  data() {
    return {
      uploadConfig: false,
      msg: "Welcome to ashvini's Vue.js App",
      langChangeDOM: 0,
      langList: [],
      emitObj: null,
    };
  },
  methods: {
    emitExecute(obj) {
      this.emitObj = obj;
    },
    async langChange(lang) {
      await loadLanguage(lang);
      this.langChangeDOM++;
    },
    setData() {
      // console.log("calling setData");
      this.$store.commit("setLoading", true); //Set loading true
      this.setFont(); //Set base font
      //* Check environment mode
      if (process.env.NODE_ENV !== "production") {
        //In development mode, set the base url from the .env.local file into the store
        this.$store.commit("setBaseURL", process.env.VUE_APP_BASEURL);
        this.saveSecondaryServerData();
        this.getAppSettings(); //Get app settings
      } else {
        //In production mode, get the base url from manifest file
        this.getBaseURLFromManifest();
      }
    },
    async saveSecondaryServerData() {
      if (
        Object.keys(this.$store.getters.getApplicationModule()).length === 0
      ) {
        // This is to generate the key format of the configurations files for the Sandbox/standard app.
        // The "generateKey" function is coming from "@/helpers/GlobalMixin.js" file.
        let key = this.generateKey("applicationModule");
        // By default, we are calling the 'applicationSetup' config file using the local/language set in the 'this.$i18n.locale' global variable.
        await service
          .getSavedConfig({ tableKey: key })
          .then(async (response) => {
            this.$store.commit("setApplicationModule", response.data);
            response.data.serverConnections =
              typeof response.data.serverConnections === "object"
                ? response.data.serverConnections
                : decompress(JSON.parse(response.data.serverConnections));
            let secondaryServerAuth = btoa(
              [
                response.data?.serverConnections?.serverACredentials
                  ?.username || null,
                response.data?.serverConnections?.serverACredentials
                  ?.password || null,
              ].join(":")
            ); // encode a string;
            secondaryServerAuth = "Basic " + secondaryServerAuth;

            let secondaryServerUrl =
              response.data?.serverConnections?.serverAURL || null;
            // console.log(
            //   secondaryServerAuth,
            //   secondaryServerUrl,
            //   "secondaryServerUrl"
            // );
            this.$store.commit("setSecondaryServerAuth", secondaryServerAuth);
            let secondaryHeader = {
              "Cache-Control": "no-cache",
              Authorization: secondaryServerAuth, //generate basic auth
            };
            this.$store.commit("setSecondaryHeader", secondaryHeader);

            this.$store.commit("setSecondaryServerUrl", secondaryServerUrl);
          })
          .catch((err) => {
            console.log("applicationModule not found");
          });
      } else {
        let appData = this.$store.getters.getApplicationModule();
        appData.serverConnections =
          typeof appData.serverConnections === "object"
            ? appData.serverConnections
            : decompress(JSON.parse(appData.serverConnections));
        let secondaryServerAuth = btoa(
          [
            appData?.serverConnections?.serverACredentials?.username || null,
            appData?.serverConnections?.serverACredentials?.password || null,
          ].join(":")
        ); // encode a string;
        secondaryServerAuth = "Basic " + secondaryServerAuth;

        let secondaryServerUrl = appData?.serverConnections?.serverAURL || null;
        let secondaryHeader = {
          "Cache-Control": "no-cache",
          Authorization: secondaryServerAuth, //generate basic auth
        };
        this.$store.commit("setSecondaryHeader", secondaryHeader);
        this.$store.commit("setSecondaryServerAuth", secondaryServerAuth);
        this.$store.commit("setSecondaryServerUrl", secondaryServerUrl);
      }
    },
    getBaseURLFromManifest() {
      // console.log("calling getBaseURLFromManifest");

      fetch("./manifest.webapp")
        .then((response) => response.json())
        .then((json) => {
          // console.log("post response", json);
          this.$store.commit("setBaseURL", json.activities.dhis.href); //Save the baseURL in the store
          this.$store.commit("setAppVersion", json.version); //Save the application version
          this.saveSecondaryServerData();
          this.$nextTick(() => {
            this.getAppSettings(); //Get app settings
          });
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
          this.sweetAlert({ title: this.$i18n.t("manifestError") }); //show error in case manifest file not found
        });
    },
    async getAppSettings() {
      //If data is not available in store, then get the data from the datastore files
      if (Object.keys(this.$store.getters.getAppSettings).length === 0) {
        let key = this.generateKey("appSettings");
        service
          .getSavedConfig({ tableKey: key })
          .then(async (response) => {
            // let updatedSchema = null;
            // try {
            //   let isViz = await service.checkAPI("visualizations");
            //   if (
            //     isViz &&
            //     (!response.data.commentSchema ||
            //       (response.data.commentSchema &&
            //         response.data.commentSchema.toLowerCase() !== "new"))
            //   ) {
            //     updatedSchema = "new";
            //   }
            // } catch (err) {
            //   console.log("visualizations API not present", err);
            //   try {
            //     let isCharts = await service.checkAPI("charts");
            //     if (
            //       isCharts &&
            //       (!response.data.commentSchema ||
            //         (response.data.commentSchema &&
            //           response.data.commentSchema.toLowerCase() !== "old"))
            //     ) {
            //       updatedSchema = "old";
            //     }
            //   } catch (err1) {
            //     console.log("charts API not present", err1);
            //   }
            // }
            // if (updatedSchema) {
            //   response.data.commentSchema = updatedSchema;
            //   try {
            //     await service.updateConfig({
            //       data: response.data,
            //       tableKey: key,
            //     });
            //   } catch (err2) {
            //     console.log("Error in saving config data...", err2);
            //   }
            // }

            this.$store.commit("setAppSettings", response.data); //Set app settings in store
            this.$store.commit("setLocalLang", response.data.defaultLocale); //Set default locale in store
            //Set start of financial year list in store.
            //This is used in Toolbar to show appropriate period type
            this.$store.commit("setFinancialYear", response.data.financialYear);
            //Once appSettings fetched, set and fetch other required data
            this.getData({
              ga: response.data.ga,
              locale: response.data.defaultLocale,
              appSettings: response.data,
            });
          })
          .catch(async (res) => {
            //* if appSettings not found, set default language [en = English]
            await this.langChange();
            this.$store.commit("setLoading", false);
            //* Show option to upload the appSetting.json file
            if (res.message.includes("404")) {
              this.$swal({
                title: this.$i18n.t("appSettingError"),
                confirmButtonText: this.$i18n.t("upload"),
              }).then((result) => {
                if (result.isConfirmed) {
                  this.uploadConfig = true;
                }
              });
            } else {
              this.sweetAlert({ title: this.$i18n.t("appSettingError") });
            }
          });
      } else {
        //If data available in store, then use store data
        this.getData({
          ga: this.$store.getters.getAppSettings.ga,
          locale: this.$store.getters.getLocalLang,
          appSettings: this.$store.getters.getAppSettings,
        });
      }
    },
    uploadSuccess() {
      this.uploadConfig = false;
      this.getAppSettings();
    },
    async getData({ ga, locale, appSettings }) {
      // this.getTour(); //* Get tour data
      // this.enablePlugin(ga); //* Set google analytics options
      //this.fetchData(); //* prefetch huge data, coming from mixin
      try {
        await this.langChange(locale); //set default language set in appSettings
      } catch (err) {
        console.log("Error in setting language...");
      }
      this.appSettings = appSettings;
      this.langList = this.$store.getters.getAppSettings.langList;
      this.$store.commit("setLoading", false);
    },
    setFont() {
      let fontSize = 16;
      document.getElementById("mainHTML").style.fontSize = `${fontSize}px`;
      this.$store.commit("setBaseFontSize", fontSize);
      this.$store.commit("setDefaultFontSize", fontSize);
    },
  },
  created() {
    this.setData();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
