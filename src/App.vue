<script setup>
import Header from './components/Header.vue';
import Drawer from "./components/Drawer.vue";
import Card from "./components/Card.vue";
import CardList from "./components/CardList.vue";
import axios from "axios";
import {onMounted, reactive, ref, watch, provide, computed, onBeforeMount} from "vue";
import {createdCartStore} from "./store.js";


const items = ref([]);
const cart = ref([]);

const cartStore = createdCartStore()


const drawerOpen = ref(false);

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}


const filters = reactive({
  sortBy: 'title',
  filterInput: ''
});


const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeInput = (event) => {
  filters.filterInput = event.target.value;
};



const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    };
    if (filters.filterInput) {
      params.title = `*${filters.filterInput}*`;
    }

    const {data} = await axios.get(`https://ad59c37a99f145f4.mokky.dev/items`, {params});
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false
    }));

    data.forEach(product => {
      cartStore.addProduct(product)
    })

    console.log(data)
  } catch (err) {
    console.log(err);
  }
};

const addToFavorite = async (item) => {
  try {
    const obj = {
      item_id: item.id
    }
    if(!item.isFavorite){
      item.isFavorite = true
      const { data } = await axios.post(`https://ad59c37a99f145f4.mokky.dev/favorites/`, obj);

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://ad59c37a99f145f4.mokky.dev/favorites/${item.favoriteId}`)

      item.favoriteId = null
    }

  } catch(err){
    console.log(err)
  }
}

const fetchFavorites = async () => {
  try {
    const {data: favorites} = await axios.get(`https://ad59c37a99f145f4.mokky.dev/favorites`)
    items.value = items.value.map((item) => {
      const favorite = favorites.find(favorite => favorite.item_id === item.id)
      if (!favorite) {
        return item;
      }
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    });


  } catch (err) {
    console.log(err)
  }
}
// const addItemToCart = (item) => {
//   cartStore.addItem(item)
//     cart.value.push(item);
//     console.log('dddddqwrqw',cart.value)
// };
// const removeItemFromCart = (item) => {
//   cart.value.splice(cart.value.indexOf(item), 1);
// };
// const totalPrice = computed(() => {
//   return cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
// });
onBeforeMount( () => {
});

onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
});
watch(filters, fetchItems);

provide('cart', {
  cart,
  closeDrawer,
  openDrawer
})
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Drawer v-if="drawerOpen" :cart="cart" :totalPrice=" cartStore.getTotalValue"/>
    <Header @openDrawer="openDrawer" :cart="cart"/>

    <div class="flex justify-end items-center mt-5 mr-5">
      <div class="flex gap-4">
        <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
          <option value="name">By name</option>
          <option value="price">By price(low to high)</option>
          <option value="-price">By price(high to low)</option>
        </select>

        <div class="relative">
          <img src="/search.png" alt="Search" class="absolute w-5 left-3 top-2.5 fill-slate-600">
          <input
              @input="onChangeInput"
              class="border rounded-md py-1.5 pl-11 pr-4 outline-none"
              type="text"
              placeholder="Search..."
          />
        </div>
      </div>
    </div>

    <CardList
        :items="items"
        :cart="cart"
        :addItemToCart="cartStore.addItemToCart"
        :remove-item-from-cart="cartStore.removeItemFromCart"
        :isFavorite="items.isFavorite"
        @add-to-favorite="addToFavorite"
        @remove-item="cartStore.removeItemFromCart"
    />
  </div>
</template>

<style scoped>
</style>