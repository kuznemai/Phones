<script setup lang="ts">
import { ref, onMounted, toRaw } from "vue";
import { useRoute } from "vue-router";
import Buttons from "./Buttons.vue";
import { useProductStore } from "../store";
import type { Product } from "../store";

const route = useRoute();
const productStore = useProductStore();
const product = ref<Product | null>(null);

onMounted(async () => {
  await productStore.fetchItems();
  const rawProducts = toRaw(productStore.getAllProducts);
  const productId = route.params.id;

  product.value =
    rawProducts.find((p) => String(p.id) === String(productId)) ?? null;
});
</script>

<template>
  <div v-if="product">
    <section class="product_wrapper py-12">
      <div class=" mx-auto px-4">
        <div class="product_container flex flex-row justify-around gap-8">
          <!-- Product Image -->
          <div class="product_image">
            <img :src="product.imageUrl" alt="product" class="w-full rounded-lg shadow-lg"/>
          </div>

          <!-- Product Content -->
          <div class="product_content flex flex-col h-full justify-between">
            <div class="product_content__description space-y-4">
              <h2 class="text-2xl text-white font-bold">{{ product.title }}</h2>
              <p class="text-white text-justify">
                {{ product.description }}
              </p>
              <h3 class="text-2xl text-white font-bold">Details</h3>
              <p class="text-white text-justify">
                {{ product.description }}
              </p>
            </div>

            <!-- Product Buttons: same box for Add to cart and counter (fixed height = no jump) -->
            <div class="product_button flex flex-row flex-wrap justify-between items-end gap-4 mt-auto">
              <div class="flex flex-col">
                <span class="text-slate-400 md:text-sm lg:text-base">Price:</span>
                <b class="price md:text-sm lg:text-3xl text-white">{{ product.price }} $</b>
              </div>

              <!-- Single shell: overflow-hidden + flex (not inline-flex) so hover fills full pill -->
              <div
                class="flex h-[3.25rem] min-h-[3.25rem] min-w-[12.5rem] shrink-0 overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-950/50"
              >
                <div
                  v-if="productStore.getCount(product.id) > 0"
                  class="flex h-full w-full min-h-0 min-w-0 px-3"
                >
                  <Buttons :id="product.id" size="lg" />
                </div>
                <button
                  v-else
                  type="button"
                  @click="productStore.addProductToCart(product.id)"
                  class="flex h-full min-h-0 w-full min-w-0 items-center justify-center px-8 text-base font-medium tracking-wide text-indigo-200 transition-colors duration-200 hover:bg-indigo-800/45 hover:text-indigo-50 active:bg-indigo-800/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else>
    <p>Product not found</p>
  </div>
</template>

<style scoped>
.product_container {
  display: flex;
  flex-direction: row;
  gap: 120px;
  padding: 100px 20px;
}

.product_content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
}

.product_image > img {
  width: 280px;
  height: 450px;
}

.product_content__description {
  text-align: justify;
}
.product_button {
  margin-top: 40px;
}

.product_price > p {
  font-size: 46px;
  font-weight: 300;
  margin: 0;
}

@media (max-width: 1024px) and (min-width: 320px) {
  .product_wrapper > div {
    padding: 0;
  }

  .product_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 0;
  }

  .product_content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .product_image > img {
    width: 220px;
    height: 320px;
  }

  .product_price > p {
    font-size: 14px;
  }

  .product_button {
    margin-top: 40px;
  }
  .price {
    font-size: 24px;
  }
}
</style>