<script setup>
import { defineProps } from "vue";

import Buttons from "./Buttons.vue";
import { useProductStore } from "../store.js";

const props = defineProps({
  item: Object,
  isFavorite: Boolean,
});
console.log(props.item);

// const emit = defineEmits(["addToFavorite"]);

const productStore = useProductStore();
</script>

<template>
  <div
    class="flex flex-col justify-between relative bg-white border border-slate-100 rounded-3xl p-4 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition"
  >
    <!--    &lt;!&ndash;    v-if="onClickFavorite"&ndash;&gt;-->
    <!--    @click="emit('addToFavorite', item)"-->
    <img
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      class="absolute top-4 left-4"
      alt="Like"
      @click="productStore.addToFavorite(item)"
    />

    <img :src="item.imageUrl" class="w-20 mx-auto my-5 py-2" alt="Product" />
    <p class="mt-2">{{ item.title }}</p>

    <div class="flex flex-row justify-between">
      <div class="flex flex-col mt-2">
        <span class="text-slate-400">Price:</span>
        <b class="price">{{ item.price }} $</b>
      </div>

      <div>
        <div v-if="productStore.getCount(item.id) > 0">
          <div
            class="flex items-center space-x-3 border-solid border-2 border-gray-200 rounded-lg mr-8"
          >
            <Buttons :id="item.id" />
          </div>
        </div>
        <button
          v-else
          type="button"
          @click="productStore.addProductToCart(item.id)"
          class="button_addtocart"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>
