import { defineStore } from "pinia";
import axios from "axios";

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  isFavorite: boolean;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export type OrderStatus = "placed" | "processing" | "shipped" | "delivered";

export interface OrderRecord {
  id: number;
  items: { id: number; quantity: number; title: string; price: number; imageUrl: string }[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
}

const ORDERS_API = "https://ad59c37a99f145f4.mokky.dev/orders";

/** Remote row — backend may include `status` (placed | processing | shipped | delivered) */
interface OrderApiRow {
  id: number;
  items?: unknown;
  totalPrice?: number;
  status?: unknown;
}

const ORDER_STATUS_VALUES: OrderStatus[] = ["placed", "processing", "shipped", "delivered"];

export function parseOrderStatus(value: unknown): OrderStatus | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.toLowerCase().trim();
  return ORDER_STATUS_VALUES.includes(v as OrderStatus) ? (v as OrderStatus) : undefined;
}

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [] as Product[],
    cart: [] as CartItem[],
    favorites: [] as Product[],
    orders: [] as OrderRecord[],
  }),
  actions: {
    async fetchItems(): Promise<void> {
      try {
        const { data } = await axios.get<Product[]>(
          `https://ad59c37a99f145f4.mokky.dev/items`
        );
        this.products = data.map((obj) => ({
          ...obj,
          isFavorite: false,
        }));
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    },
    loadCartFromLocalStorage(): void {
      const savedCart: CartItem[] =
        JSON.parse(localStorage.getItem("cart") ?? "null") || [];
      this.cart = savedCart;
    },
    saveCartToLocalStorage(): void {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    addProductToCart(id: number): void {
      const existingItem = this.cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ id, quantity: 1 });
      }
      this.saveCartToLocalStorage();
    },
    reduceProductFromCart(id: number): void {
      const existingItem = this.cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity <= 0) {
          this.cart.splice(this.cart.indexOf(existingItem), 1);
        }
      }
      this.saveCartToLocalStorage();
    },
    removeProductFromCart(id: number): void {
      const existingItem = this.cart.find((item) => item.id === id);
      if (existingItem) {
        this.cart.splice(this.cart.indexOf(existingItem), 1);
      }
      this.saveCartToLocalStorage();
    },
    addToFavorite(item: Product): void {
      if (!item.isFavorite) {
        this.favorites.push({ ...item, isFavorite: true });
      } else {
        this.favorites = this.favorites.filter((fav) => fav.id !== item.id);
      }

      const product = this.products.find((prod) => prod.id === item.id);
      if (product) {
        product.isFavorite = !item.isFavorite;
      }

      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    fetchFavorites(): void {
      const savedFavorites: Product[] =
        JSON.parse(localStorage.getItem("favorites") ?? "null") || [];

      this.favorites = savedFavorites;

      savedFavorites.forEach((fav) => {
        const product = this.products.find((product) => product.id === fav.id);
        if (product) {
          product.isFavorite = true;
        }
      });
    },
    loadOrdersFromLocalStorage(): void {
      const saved: OrderRecord[] =
        JSON.parse(localStorage.getItem("orders") ?? "null") || [];
      this.orders = saved;
    },
    saveOrdersToLocalStorage(): void {
      localStorage.setItem("orders", JSON.stringify(this.orders));
    },
    cancelOrder(id: number): void {
      const order = this.orders.find((o) => o.id === id);
      if (order && order.status === "placed") {
        this.orders = this.orders.filter((o) => o.id !== id);
        this.saveOrdersToLocalStorage();
      }
    },
    /**
     * Pull latest `status` from API for all local orders (one GET /orders).
     * Keeps items/totals from local history; only updates status when the server sends a valid value.
     */
    async syncOrderStatusesFromApi(): Promise<void> {
      if (this.orders.length === 0) return;
      try {
        const { data } = await axios.get<OrderApiRow[]>(ORDERS_API);
        if (!Array.isArray(data)) return;
        const remoteById = new Map<number, OrderApiRow>(data.map((row) => [row.id, row]));
        let changed = false;
        for (const order of this.orders) {
          const remote = remoteById.get(order.id);
          if (!remote) continue;
          const status = parseOrderStatus(remote.status);
          if (status && order.status !== status) {
            order.status = status;
            changed = true;
          }
        }
        if (changed) this.saveOrdersToLocalStorage();
      } catch (err) {
        console.error("Error syncing order statuses:", err);
      }
    },
    /** Refresh a single order status (e.g. when opening details). */
    async refreshOrderStatus(id: number): Promise<void> {
      const order = this.orders.find((o) => o.id === id);
      if (!order) return;
      try {
        const { data } = await axios.get<OrderApiRow>(`${ORDERS_API}/${id}`);
        const status = parseOrderStatus(data.status);
        if (status && order.status !== status) {
          order.status = status;
          this.saveOrdersToLocalStorage();
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
      }
    },
    async createOrder(): Promise<unknown> {
      try {
        if (this.cart.length === 0) {
          throw new Error("The cart is empty. Cannot place an order.");
        }

        const totalPrice = this.cart.reduce((total, item) => {
          const product = this.products.find((product) => product.id === item.id);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);

        const enrichedItems = this.cart.map((item) => {
          const product = this.products.find((p) => p.id === item.id);
          return {
            id: item.id,
            quantity: item.quantity,
            title: product?.title ?? "Unknown",
            price: product?.price ?? 0,
            imageUrl: product?.imageUrl ?? "",
          };
        });

        const { data } = await axios.post<OrderApiRow>(ORDERS_API, {
          items: this.cart.map((i) => ({ id: i.id, quantity: i.quantity })),
          totalPrice,
          status: "placed",
        });

        const record: OrderRecord = {
          id: data.id ?? Date.now(),
          items: enrichedItems,
          totalPrice,
          createdAt: new Date().toISOString(),
          status: parseOrderStatus(data.status) ?? "placed",
        };

        this.orders.unshift(record);
        this.saveOrdersToLocalStorage();

        this.cart = [];
        localStorage.removeItem("cart");
        return data;
      } catch (err) {
        console.error("Error creating order:", err);
        throw err;
      }
    },
  },
  getters: {
    getAllProducts: (state): Product[] => {
      return state.products;
    },
    getCount: (state) => {
      return (itemId: number): number => {
        const item = state.cart.find((item) => item.id === itemId);
        return item ? item.quantity : 0;
      };
    },
    getTheTotalPrice: (state) => {
      return (): number => {
        return state.cart.reduce((total, item) => {
          const product = state.products.find(
            (product) => product.id === item.id
          );
          return total + (product ? product.price * item.quantity : 0);
        }, 0);
      };
    },
    getAllItemsInCart: (state): (Product & { quantity: number })[] => {
      return state.cart.map((cartItem) => {
        const product = state.products.find(
          (product) => product.id === cartItem.id
        );
        return {
          ...(product as Product),
          quantity: cartItem.quantity,
        };
      });
    },
  },
});
