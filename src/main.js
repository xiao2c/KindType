// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import vueHeadful from "vue-headful";

Vue.component("vue-headful", vueHeadful); // Register it as vue-headful globally, so it can be used in any view
Vue.use(Vuetify);
Vue.config.productionTip = false;

// must before the main Vue(). Shared object to register event handler: http://andreybleme.com/2018-01-07/sharing-data-across-vuejs-components/
export const BUS = new Vue({
  data() {
    return {
      // contains data related to current user session
      session: {
        // information only related to display and navigation flow
        ui: {
          pageTitle: "", // control current page head info
          barKtButton: false, // control visibility of "Show Kind Types" button
          topKindTypes: [], // Array of Kindtype object - kindtype objects that are directly under selected categories combination
          catDialogData: null // category data to be passed to category features dialog
        },
        // inforamtion related to business logic and should be saved
        data: {
          instance: null, // String - instance name being processed
          categories: [], // Array of String - names of categories that are selected by user
          instanceCatObjs: [] // Array of Category object - category objects that hold feature values for current selected instance
        }
      },

      // application scope configuration information
      app: {}
    };
  },
  methods: {
    updateSession() {
      this.$emit("sessionChanged");
    }
  }
});
// export const session = {}; // shared session object to pass data around

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
