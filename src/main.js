import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import Home from "./pages/Home.vue";
import Favorites from "./pages/Favorites.vue";

const app = createApp(App);

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", name: "Home", component: Home },
  { path: "/favorites", name: "Favorites", component: Favorites },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(createPinia());
app.use(router);
app.use(autoAnimatePlugin);
app.mount("#app");
