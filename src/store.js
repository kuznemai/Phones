import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const createdCartStore = defineStore('cartStore', {
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
                this.cart.set(id, 0)
            }

            this.cart.set(id, this.cart.get(id) + quantity)

            if (this.cart.get(id) <= 0) {
                this.cart.delete(id)
            }
        },
    },
    getters: {
        getAllProducts: (state) => {
            // This will return all of the values in the products list as an array
            return state.products.values(); // Возвращаем копию массива cart
        },
        getTotalValue(state) {
            return Array.from(state.cart.entries()).reduce((total, [id, quantity]) => {
                return total + state.products.get(id).price * quantity;
            }, 0); // Начальное значение total равно 0
        },

        getCount: (state) => {
            return (itemId) => {
                return state.cart.get(itemId)
            }
        },

        getAllItemsInCart(state) {
            return state.cart.entries().map(vars => {
                return {quantity: vars[1], product: state.products.get(vars[0])};
            })
        }
    },
});