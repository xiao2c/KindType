import Vue from "vue";
import Router from "vue-router";
import { BUS } from "@/main";
import Home from "@/components/Home";
import Test from "@/components/Test";
import SelectCat from "@/components/SelectCat";
import SelectKT from "@/components/SelectKT";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: (to, from, next) => {
        BUS.session.ui.pageTitle = "Home";
        BUS.updateSession();
        console.log("enter home");
        next();
      }
    },
    {
      path: "/Test",
      name: "Test",
      component: Test
    },
    {
      path: "/SelectCat",
      name: "SelectCat",
      component: SelectCat,
      beforeEnter: (to, from, next) => {
        BUS.session.ui.pageTitle = "Instance: " + BUS.session.data.instance;
        BUS.updateSession();
        console.log("enter cat");
        next();
      }
    },
    {
      path: "/SelectKT",
      name: "SelectKT",
      component: SelectKT
    }
  ]
});
