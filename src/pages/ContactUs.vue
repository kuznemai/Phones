<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const message = ref("");

const submitForm = () => {
  alert(`Your message has been sent!\nName: ${name.value}\nEmail: ${email.value}`);
};
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6 mt-10 fade-in ">
    <h1 class="text-4xl mb-6">Contact Us</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">

      <!-- Форма обратной связи -->
      <div class="bg-neutral-800 p-6 shadow-lg">
        <h2 class="text-2xl mb-4">Send us a message</h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <input
              v-model="name"
              type="text"
              placeholder="Your Name"
              required
              class="w-full p-3 bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
              v-model="email"
              type="email"
              placeholder="Your Email"
              required
              class="w-full p-3 bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
              v-model="message"
              placeholder="Your Message"
              required
              rows="4"
              class="w-full p-3 bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
              type="submit"
              class="w-full bg-[#0C38D4] hover:bg-[#0f2a89] text-white py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>

      <!-- Контактная информация -->
      <div class="bg-neutral-800 p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h2 class="text-2xl mb-4">Our Contact Details</h2>
          <div class="flex items-center gap-3 text-gray-400">
            <img src="/location.png" alt="Location" class="w-6 h-6" />
            <p>UAE, Dubai</p>
          </div>
          <div class="flex items-center gap-3 text-gray-400 mt-2">
            <img src="/phone.png" alt="Phone" class="w-6 h-6" />
            <p>+1 234 567 890</p>
          </div>
          <div class="flex items-center gap-3 text-gray-400 mt-2">
            <img src="/email.png" alt="Email" class="w-6 h-6" />
            <p>contact@example.com</p>
          </div>
        </div>

        <!-- Карта -->
        <div class="mt-6">
          <h3 class="text-xl font-semibold mb-2">Find us here:</h3>
          <iframe
              class="w-full h-48 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.5780474324335!2d55.27687641538429!3d25.19720183789914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4288976b8d51%3A0x7439e08a2a0e2a3d!2sDubai%2C%20UAE!5e0!3m2!1sen!2s!4v1610000000000!5m2!1sen!2s"
              frameborder="0"
              allowfullscreen
          ></iframe>
        </div>
      </div>

    </div>
  </div>
</template>