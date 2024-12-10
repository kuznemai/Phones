import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [],
    cart: [],
  }),
  actions: {
    setProducts(products) {
      this.products = products;
    },
    addProductToCart(id, quantity) {
      const existingItem = this.cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity; // Увеличиваем количество, если продукт уже в корзине
      } else {
        this.cart.push({ id, quantity }); // Добавляем новый продукт в корзину
      }
    },
    deleteProductFromCart(id, quantity) {
      const existingItem = this.cart.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity -= quantity; // Уменьшаем количество

        // Если количество становится меньше или равно 0, удаляем товар из корзины
        if (existingItem.quantity <= 0) {
          this.cart.splice(this.cart.indexOf(existingItem), 1);
        }
      }
    },
  },
  getters: {
    getAllProducts: (state) => {
      return state.products;
    },
    getCount: (state) => {
      return (itemId) => {
        const item = state.cart.find((item) => item.id === itemId);
        return item ? item.quantity : 0; // Возвращаем количество или 0, если продукт не найден
      };
    },
    getTheTotalPrice: (state) => {
      return () => {
        return state.cart.reduce((total, item) => {
          const product = state.products.find(
            (product) => product.id === item.id,
          );
          return total + product.price * item.quantity;
        }, 0);
      };
    },
    getAllItemsInCart: (state) => {
      return state.cart.map((cartItem) => {
        const product = state.products.find(
          (product) => product.id === cartItem.id,
        );
        return {
          ...product,
          quantity: cartItem.quantity, // Добавляем количество к продукту
        };
      });
    },
  },
});
