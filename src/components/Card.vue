<script setup>
import {ref, defineProps, reactive, watch} from 'vue';

const props = defineProps({
  id: Number,
  imageUrl: String,
  title: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function,
  onClickRemove: Function,
  items: Array,
  totalPrice: Number
});

const inCart = ref(false);
const counter = ref(0);

const pressBuy = () => {
  inCart.value = true;
}


const counterIncrement = () => {
  counter.value++;
};

const counterDecrement = () => {
  if (counter.value > 0) {
    counter.value--;
    // Проверяем, если counter стал равен 0, то устанавливаем inCart в false
    if (counter.value === 0) {
      inCart.value = false;
    }
  }
};
const handleClickIncrement = () => {
  counterIncrement();
  props.onClickAdd();
};

const handleClickDecrement = () => {
  counterDecrement();
  props.onClickRemove();
};

</script>

<template>
  <div
      class="flex flex-col justify-between relative bg-white border border-slate-100 rounded-3xl p-4 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition">
    <img :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'" class="absolute top-4 left-4" alt="Like 1"
         @click="onClickFavorite"/>
    <img :src="imageUrl" class="w-20 mx-auto my-5 py-2" alt="Phone"/>
    <p class="mt-2">{{ title }}</p>

    <div class="flex flex-row justify-between">
      <div class="flex flex-col mt-2">
        <span class="text-slate-400">Price:</span>

        <b class="price" v-if="inCart && counter > 0">{{ counter * props.price }} $</b>
        <b class="price" v-else-if="!inCart || counter === 0">{{ props.price }} $</b>
      </div>

      <div>
        <div v-if="inCart">
          <div class="flex items-center space-x-3 border-solid border-2 border-gray-200 rounded-lg mr-8">
            <button type="button" @click="handleClickDecrement"
                    class="minus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">-
            </button>
            <span class="counter text-lg">{{ counter }}</span>
            <button type="button" @click="handleClickIncrement"
                    class="plus bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-3 py-1">+
            </button>
          </div>
        </div>
        <button v-else type="button" @click="pressBuy" class="button_addtocart">Buy</button>
      </div>
    </div>
  </div>
</template>