import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from "axios";

createApp(App).mount('#app')
const data = fetch(`https://ad59c37a99f145f4.mokky.dev/items`)
    .then(response => response.json()) // Декодируем ответ в формате json
    .then(data => console.log(data)); // Выводим ответ в консоль

for(let item in data){
    console.log(counter.innerHTML)
}


const buttonPlus = document.getElementsByClassName('.plus')
const buttonMinus = document.getElementsByClassName('.minus')

let counter = document.querySelector('.counter')


