<script setup>
import CardList from "../components/CardList.vue";
import axios from "axios";
import { onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import { useProductStore } from "../store2.js";

const productStore = useProductStore();

const items = ref([]);
// const cart = ref([]);

const filters = reactive({
  sortBy: "title",
  filterInput: "",
});

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeInput = (event) => {
  filters.filterInput = event.target.value;
};

const addToFavorite = async (item) => {
  try {
    const obj = {
      item_id: item.id,
    };
    if (!item.isFavorite) {
      item.isFavorite = true;
      const { data } = await axios.post(
        `https://ad59c37a99f145f4.mokky.dev/favorites/`,
        obj,
      );

      item.favoriteId = data.id;
    } else {
      item.isFavorite = false;
      await axios.delete(
        `https://ad59c37a99f145f4.mokky.dev/favorites/${item.favoriteId}`,
      );

      item.favoriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchItems = async () => {
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
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
    }));

    productStore.setProducts(items);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(
      `https://ad59c37a99f145f4.mokky.dev/favorites`,
    );
    items.value = items.value.map((item) => {
      const favorite = favorites.find(
        (favorite) => favorite.item_id === item.id,
      );
      if (!favorite) {
        return item;
      }
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

watch(filters, fetchItems);

onBeforeMount(async () => {
  const params = {
    sortBy: filters.sortBy,
  };

  const { data } = await axios.get(`https://ad59c37a99f145f4.mokky.dev/items`, {
    params,
  });
  items.value = data.map((obj) => ({
    ...obj,
    isFavorite: false,
  }));

  for (let elem in data) {
    productStore.products.push(data[elem]);
  }
});

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});
</script>

<template>
  <div class="flex gap-4">
    <select
      @change="onChangeSelect"
      class="py-2 px-3 border rounded-md outline-none"
    >
      <option value="name">By name</option>
      <option value="price">By price(low to high)</option>
      <option value="-price">By price(high to low)</option>
    </select>

    <div class="relative">
      <img
        src="/search.png"
        alt="Search"
        class="absolute w-5 left-3 top-2.5 fill-slate-600"
      />
      <input
        @input="onChangeInput"
        class="border rounded-md py-1.5 pl-11 pr-4 outline-none"
        type="text"
        placeholder="Search..."
      />
    </div>
  </div>
  <CardList
    :add-item-to-cart="productStore.addProductToCart"
    @add-to-favorite="addToFavorite"
  />
</template>
