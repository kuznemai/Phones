<script setup>
import {ref, onMounted, reactive, toRaw} from "vue";
import {useRoute} from "vue-router";
import Buttons from "./Buttons.vue";
import {useProductStore} from "../store.js";

const route = useRoute();
const productStore = useProductStore();
const product = ref(null);
const products = ref([]);

const rawProducts = [...products.value];
console.log(rawProducts);

onMounted(async () => {
  await productStore.fetchItems(); // Загружаем товары
  products.value = productStore.getAllProducts; // Получаем все товары через геттер

  // Распаковываем Proxy для отладки
  const rawProducts = toRaw(products.value);
  console.log('Raw products:', rawProducts);

  const productId = route.params.id; // Получаем ID товара из маршрута
  console.log('productId', productId);

  product.value = rawProducts.find((p) => {
    if (String(p.id) === String(productId)) {
      return p.id
    }

  });


  if (!product.value) {
    console.error("Product not found");
  }
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

            <!-- Product Buttons -->
            <div class="product_button flex flex-row justify-between items-end mt-auto">
              <div class="flex flex-col">
                <span class="text-slate-400 md:text-sm lg:text-base">Price:</span>
                <b class="price md:text-sm lg:text-3xl text-white">{{ product.price }} $</b>
              </div>

              <div>
                <div v-if="productStore.getCount(product.id) > 0">
                  <div class="flex items-center space-x-3 border-solid border-2 border-gray-200 rounded-lg mr-8">
                    <Buttons :id="product.id"/>
                  </div>
                </div>
                <button
                    v-else
                    type="button"
                    @click="productStore.addProductToCart(product.id)"
                    class="button_addtocart"
                >
                  Buy
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

.button_addtocart {
  width: 160px;
  height: 40px;
  font-size: 22px;
}

.button_addtocart:hover {
  background-color: #102983;
  transition: background-color 0.5s;
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

  .button_addtocart {
    width: 140px;
    height: 35px;
    font-size: 22px;
  }
}
</style>