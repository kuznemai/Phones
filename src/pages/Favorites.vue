<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CardList from "../components/CardList.vue";
import { useProductStore } from "../store.js";

const productStore = useProductStore();
</script>

<template>
  <h1>Favorites</h1>
  <CardList :items="productStore.favorites" />
</template>