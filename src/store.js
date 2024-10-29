import {defineStore} from "pinia";
import {reactive, ref} from "vue";

export const createdCartStore = defineStore('cartStore', {
    state: () => ({
        products: reactive({}),
        cart: reactive({}),
        counter: ref(0)
    }),
    actions: {
        addProduct(product) {
            this.products[product.id] = product;
        },

        addItemToCart(id, quantity) {
            if (!this.cart[id]) {
                this.cart[id] = 0
            }

            this.cart[id] += quantity

            if (this.cart[id] <= 0) {
                delete this.cart[id]
            }
        },
        // removeItemFromCart(item) {
        //     this.cart.splice(this.cart.indexOf(item), 1);
        //
        // },

        // modifyAmount(itemId, amount) {
        //     const item = this.cart.find(product => product.id === itemId)
        //     item.quantity += amount
        //
        //     if (item.quantity <= 0) {
        //         this.cart.splice(this.cart.indexOf(item), 1);
        //     }
        //
        // },
        getters: {
            getAllProducts(state) {
                return Object.entries(state.products); // Возвращаем копию массива cart
            },
            getTotalValue(state) {
                return  Object.entries(state.cart).reduce((total, [id, quantity]) => {
                    return total + state.products[id].price * quantity;
                }, 0); // Начальное значение total равно 0
            },

            getCount(state, itemId) {
                return state.cart[itemId]
            },

            getAllItemsInCart(state) {
                return Object.entries(state.cart).map((productId, quantity) => {
                    return { quantity, product: state.products[productId] };
                })
            }
        }
    },
});