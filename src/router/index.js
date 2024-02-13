import Vue from "vue";
import VueRouter from "vue-router";
import mainDashboard from "../pages/main-dashboard";
// import i18n from "../i18n";

Vue.use(VueRouter);
/**
 * @author Ashvini Pawar
 * @description Application routes.
 * ! Except Dashboard route, all other routes are lazy loaded
 * ! meta: used to add the browser title for each route
 * @param null
 * @returns null
 */
const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: mainDashboard, //! Do not add lazy loading for this route
      // meta: () => ({ title: i18n.t("HelloWorld") }),
    },
  ],
});

export default router;
