import { createRouter } from "vue-router";
// import Homepage from './home/Home.vue';
// import SignIn from './sign-in/SignIn.vue';
// import Cart from './cart/Cart.vue';

const routes = [
  {
    path: "/",
    component: () => import(/*webpackChunkName: "sign-in" */ "./Home.vue"),
  },

  {
    path: "/sign-in/",
    component: () => import(/*webpackChunkName: "sign-in" */ "./SignIn.vue"),
  },

  //   {
  //     path: '/cart/',
  //     component: Cart
  //   },
];

export default function (history) {
  return createRouter({
    history,
    routes,
  });
}
