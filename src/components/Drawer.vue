<script setup>
import DrawerHead from "./DrawerHead.vue";
import { ref } from "vue";

import CartItemList from "./CartItemList.vue";
import { useProductStore } from "../store.js";
import InfoBlock from "./InfoBlock.vue";

const cartStore = useProductStore();
const isCreatingOrder = ref(false);
const orderInfo = ref(null);


const handlePlaceOrder = async () => {
  isCreatingOrder.value = true;

  try {
    const orderData = await cartStore.createOrder();
    console.log("Order placed successfully:", orderData);

    orderInfo.value = {
      number: orderData.id,
      description: "Order placed successfully!",
      imageUrl: "/completed.png",
    };
  } catch (error) {
    console.error("Failed to place order:", error);
    alert("Failed to place order. Please try again.");
  } finally {
    isCreatingOrder.value = false;
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-black w-96 h-full fixed right-0 top-0 z-20 p-8 overflow-y-auto" style="box-shadow: -4px 0 12px rgba(255, 255, 255, 0.15);">
    <DrawerHead />

    <div v-if="orderInfo">
      <InfoBlock
          :title="`Your order number is #${orderInfo.number}`"
          :description="orderInfo.description"
          :imageUrl="orderInfo.imageUrl"
      />
    </div>

    <div
        v-else-if="cartStore.cart.length === 0"
        class="flex flex-col items-center"
    >
      <InfoBlock
          title="The cart is empty"
          description="You probably haven't ordered anything yet"
          imageUrl="/emptybox.png"
      />
    </div>

    <div v-else>
      <CartItemList />
      <div class="flex flex-col gap-2 mt-10">
        <div class="flex gap-2">
          <span class="text-white">Subtotal:</span>
          <div class="flex-1 border-b border-dashed text-white"></div>
          <b class="text-white">{{ cartStore.getTheTotalPrice() }} $</b>
        </div>

        <div class="flex gap-2 text-white">
          <span>VAT:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ (cartStore.getTheTotalPrice() * 0.05).toFixed(2) }} $</b>
        </div>

        <div class="flex gap-2 text-white">
          <span>Total:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ cartStore.getTheTotalPrice()  +  Number((cartStore.getTheTotalPrice() * 0.05).toFixed(2)) }} $</b>
        </div>

        <button
            :disabled="isCreatingOrder"
            @click="handlePlaceOrder"
            class="mt-4 text-white transition bg-lime-500 w-full disabled:bg-slate-300 rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Place order
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 360px) and (min-width: 320px) {
  .bg-black {
    width: 320px;
    padding: 1rem;
  }

  .text-white {
    font-size: 14px;
  }

  button {
    font-size: 14px;
    padding: 0.5rem 1rem;
  }

  .max-h-\[calc\(100vh-300px\)\] {
    max-height: calc(100vh - 250px);
  }

  .flex-col.items-center {
    padding: 0.5rem;
  }
}
</style>
