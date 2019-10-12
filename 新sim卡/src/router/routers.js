import Router from "vue-router";
import Vue from "vue";
import index from "@/views/index";
import home from "@/views/home/index";
import sim from "@/views/sim/";
import purchase from "@/views/purchase/";
import customer from "@/views/customer/";
import risk from "@/views/risk/";
import login from '@/views/login/';
import record from '@/views/record/'

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      name: "index",
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: "/web",
      name: "home",
      redirect: '/web/sim',
      component: home,
      children: [{
          path: "sim",
          name: "sim",
          component: sim
        },
        {
          path: 'record',
          name: "record",
          component: record
        },
        {
          path: "purchase",
          name: "purchase",
          component: purchase
        },
        {
          path: "customer",
          name: "customer",
          component: customer
        },
        {
          path: "risk",
          name: "risk",
          component: risk
        },

      ]
    }
  ]
});