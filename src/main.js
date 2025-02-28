import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import Shop from "./pages/Shop.vue";
import Home from "./pages/Home.vue";
import Favorites from "./pages/Favorites.vue";
import ContactUs from "./pages/ContactUs.vue";
import OurOffer from "./pages/OurOffer.vue";
import CardOfItem from "./components/CardOfItem.vue";


const app = createApp(App);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/shop", name: "Shop", component: Shop },
  { path: "/favorites", name: "Favorites", component: Favorites },
  { path: "/product/:id", name: "CardOfItem", component: CardOfItem },
  { path: "/offer", name: "OurOffer", component: OurOffer },
  { path: "/contact", component: ContactUs }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(createPinia());
app.use(router);
app.use(autoAnimatePlugin);
app.mount("#app");