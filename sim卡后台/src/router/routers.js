import Router from "vue-router";
import Vue from "vue";
import home from "@/views/home/";
import inventory from "@/views/inventory/";
import order from "@/views/order/";
import index from "@/views/";
import risk from "@/views/risk/";
import login from '@/views/login/';
import customer from '@/views/customer/';

import marketing from "@/views/marketing/"; // 销售端

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path: "/marketing",
      name: "marketing",
      component: marketing
    },
    {
      path: "/",
      name: "index",
      redirect: "/home",
      component: index,
      children: [
        {
          path: "home",
          name: "home",
          component: home
        },
        {
          path: "inventory",
          name: "inventory",
          component: inventory
        },
        {
          path: "order",
          name: "order",
          component: order
        },
        {
          path: "risk",
          name: "risk",
          component: risk
        },
        {
          path: "customer",
          name: "customer",
          component: customer
        }
      ]
    }
  ]
});
