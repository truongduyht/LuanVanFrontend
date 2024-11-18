import { createRouter, createWebHistory } from "vue-router";

import AdminHome from "../Views/Admin/AdminHome.vue";
import AdminField from "../Views/Admin/AdminField/HomeAdminField.vue";
import AdminLayout from "../Layouts/AdminLayout/AdminLayout.vue";
import AdminUser from "../Views/Admin/AdminUser/ManagerUser.vue";
import AdminBooking from "../Views/Admin/AdminBooking/ManagerBooking.vue";
import AdminRevenue from "../Views/Admin/AdminRevenue/ManagerRevenue.vue";
import AdminReview from "../Views/Admin/AdminReview/ManagerReview.vue";
import AdminTimeSlot from "../Views/Admin/AdminTimeSlot/ManagerTimeSlot.vue";

import HomeDefault from "../Views/Auth/HomeDefault/HomeDefault.vue";
import DefaultLayout from "../Layouts/DefaultLayout/DefaultLayout.vue";

import UserField from "../Views/User/UserField/UserField.vue";
import Profile from "../Views/User/Profile/Profile.vue";
import DetailField from "@/Views/User/UserField/DetailField/DetailField.vue";
import PaymentResult from "@/Views/User/UserField/DetailField/PaymentResult.vue";
import CompleteBooking from "@/Views/User/UserField/CompleteBooking.vue";
import UserBooking from "@/Views/User/UserBooking/UserBooking.vue";
import UserDemo from "@/Views/User/UserDemo/DemoHome.vue";
const routes = [
  //Admin
  {
    path: "/adminHome",
    component: AdminHome,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminField",
    component: AdminField,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminUser",
    component: AdminUser,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminBooking",
    component: AdminBooking,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminRevenue",
    component: AdminRevenue,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminReview",
    component: AdminReview,
    meta: {
      layout: AdminLayout,
    },
  },
  {
    path: "/adminTimeSlot",
    component: AdminTimeSlot,
    meta: {
      layout: AdminLayout,
    },
  },

  //User
  {
    path: "/profile",
    component: Profile,
    meta: {
      layout: DefaultLayout,
    },
  },
  {
    path: "/field",
    component: UserField,
    meta: {
      layout: DefaultLayout,
    },
  },

  //Product
  {
    path: "/field/:id",
    component: DetailField,
    meta: {
      layout: DefaultLayout,
    },
  },

  {
    path: "/payments/vnpay_return",
    component: PaymentResult,
    meta: {
      layout: DefaultLayout,
    },
  },

  //Default
  {
    path: "/",
    component: HomeDefault,
    meta: {
      layout: DefaultLayout,
    },
  },
  //Booking
  {
    path: "/completeBooking",
    component: CompleteBooking,
    meta: {
      layout: DefaultLayout,
    },
  },
  {
    path: "/booking",
    component: UserBooking,
    meta: {
      layout: DefaultLayout,
    },
  },
  {
    path: "/demo",
    component: UserDemo,
    meta: {
      layout: DefaultLayout,
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
