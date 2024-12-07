import { defineStore } from "pinia";
import { reactive } from "vue";

export const createdCartStore = defineStore("cartStore", {
  state: () => ({
    /**
     * { 1: {id=1, title='Product 1'...} }
     *
     *
     *
     */
    products: reactive(new Map()),
    cart: reactive(new Map()),
  }),
  actions: {
    addProduct(product) {
      this.products.set(product.id, product);
    },

    addItemToCart(id, quantity) {
      if (!this.cart.has(id)) {
        this.cart.set(id, 0);
      }

      this.cart.set(id, this.cart.get(id) + quantity);
      console.log(">>>>cart", this.cart);

      if (this.cart.get(id) <= 0) {
        this.cart.delete(id);
      }
    },
  },
  getters: {
    getAllProducts: (state) => {
      // This will return all of the values in the products list as an array
      return state.products.values();
    },
    getTotalValue(state) {
      return Array.from(state.cart.entries()).reduce(
        (total, [id, quantity]) => {
          return total + state.products.get(id).price * quantity;
        },
        0,
      ); // Начальное значение total равно 0
    },

    getCount: (state) => {
      return (itemId) => {
        return state.cart.get(itemId);
      };
    },

    getAllItemsInCart(state) {
      // Convert the iterator to an array using Array.from
      return Array.from(state.cart.entries()).map(([id, quantity]) => {
        return { quantity, product: state.products.get(id) };
      });
    },
  },
});
