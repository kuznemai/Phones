import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
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
import Profile from "./pages/Profile.vue";
import CartPage from "./pages/Cart.vue";
import Login from "./pages/Login.vue";
import { useAuthStore } from "./authStore";
import { getSafeRedirectPath } from "./utils/safeRedirect";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/shop", name: "Shop", component: Shop },
  { path: "/favorites", name: "Favorites", component: Favorites },
  { path: "/product/:id", name: "CardOfItem", component: CardOfItem },
  { path: "/offer", name: "OurOffer", component: OurOffer },
  { path: "/contact", name: "ContactUs", component: ContactUs },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/cart", name: "Cart", component: CartPage },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore(pinia);
  auth.hydrate();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: "Login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.name === "Login" && auth.isAuthenticated) {
    const fall = getSafeRedirectPath(to.query.redirect, "/shop");
    return fall;
  }

  return true;
});

app.use(router);
app.use(autoAnimatePlugin);
app.mount("#app");
