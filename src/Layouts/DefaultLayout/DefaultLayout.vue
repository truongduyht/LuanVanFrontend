<script setup>
import Header from "../../Views/Auth/Header/Header.vue";
import Footer from "../../Views/Auth/Footer/Footer.vue";
</script>

<template>
  <div>
    <Header />
    <div>
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>
