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
      session: {}
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
