import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [],
    cart: [],
    favorites: [],
  }),
  actions: {
    async fetchItems(filters) {
      try {
        const params = {
          sortBy: filters.sortBy,
        };
        if (filters.filterInput) {
          params.title = `*${filters.filterInput}*`;
        }

        const { data } = await axios.get(
          `https://ad59c37a99f145f4.mokky.dev/items`,
          { params },
        );

        this.products = data.map((obj) => ({
          ...obj,
          isFavorite: false,
        }));
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    },
    // ...остальные
    // setProducts(products) {
    //   this.products = products;
    // },
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
    addToFavorite(item) {
      if (!item.isFavorite) {
        // Добавление в избранное
        this.favorites.push({ ...item, isFavorite: true });
      } else {
        // Удаление из избранного
        this.favorites = this.favorites.filter((fav) => fav.id !== item.id);
      }

      const product = this.products.find((prod) => prod.id === item.id);
      if (product) {
        product.isFavorite = !item.isFavorite;
      }

      // Сохранение избранного в localStorage
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    fetchFavorites() {
      const savedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

      this.favorites = savedFavorites;

      // Обновляем флаг isFavorite у соответствующих товаров
      savedFavorites.forEach((fav) => {
        const product = this.products.find((product) => product.id === fav.id);
        if (product) {
          product.isFavorite = true;
        }
      });
    },
    async createOrder() {
      try {
        // Проверяем, есть ли товары в корзине
        if (this.cart.length === 0) {
          throw new Error("The cart is empty. Cannot place an order.");
        }

        // Рассчитываем общую стоимость заказа
        const totalPrice = this.cart.reduce((total, item) => {
          const product = this.products.find(
            (product) => product.id === item.id,
          );
          return total + (product ? product.price * item.quantity : 0);
        }, 0);

        // Отправляем запрос на сервер
        const { data } = await axios.post(
          `https://ad59c37a99f145f4.mokky.dev/orders`,
          {
            items: this.cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            totalPrice,
          },
        );

        // Очищаем корзину после успешного заказа
        this.cart = [];
        return data;
      } catch (err) {
        console.error("Error creating order:", err);
        throw err; // Пробрасываем ошибку, чтобы можно было её обработать на уровне компонента
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
