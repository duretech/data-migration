/*eslint no-undef: "error"*/
import Vue from "vue";
import router from "./router";
//eslint-disable-next-line
import bootstrap from "bootstrap";
import { BootstrapVue } from "bootstrap-vue";
import GlobalMixin from "./helpers/GlobalMixin";
import VueSweetalert2 from "vue-sweetalert2";
import moment from "moment";
//eslint-disable-next-line
import LoaderBar from "@/components/Common/LoaderBar"; //please keep the Loader L capital as per project guidelines

import App from "./App.vue";
import i18n from "./i18n";
import store from "./store.js";
import JsonCSV from "vue-json-csv";
import VuePapaParse from "vue-papa-parse";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "sweetalert2/dist/sweetalert2.min.css";
require("@/assets/scss/style.scss");
require("@/assets/scss/custom.scss"); //Don't change this position, this should be at last only.

Vue.mixin(GlobalMixin);
//eslint-disable-next-line
Vue.component("Loader", LoaderBar);
Vue.component("downloadCsv", JsonCSV);
Vue.use(BootstrapVue);
Vue.use(VuePapaParse);
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
//Sweetalert2 global options
const options = {
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  allowOutsideClick: false,
};
Vue.use(VueSweetalert2, options);
new Vue({
  i18n,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
