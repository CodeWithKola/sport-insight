import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Stats from "../views/Stats.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/stats/:match_code",
    name: "Stats",
    component: Stats,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
