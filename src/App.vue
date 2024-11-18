<script setup>
import { onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Service from "./Services/API";
import { authenticationStore } from "./Stores/Authencation";
import { useRouter } from "vue-router";

const router = useRouter();
const authenticaiton = authenticationStore();

const handleFetchProfilePinia = async () => {
  const res = await Service.fecthProfile();
  authenticaiton.setLoading(false);
  console.log("fetchProfile", res);
  if (res && res.data.EC === 0) {
    authenticaiton.setUserAndLogin(res.data.DT);
    authenticaiton.setIsLogin(true);
  }
};

onMounted(() => {
  handleFetchProfilePinia();
});
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />
  <div>
    <component :is="$route.meta.layout">
      <router-view />
    </component>
  </div>
</template>

<style></style>
