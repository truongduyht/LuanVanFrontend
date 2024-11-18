import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import router from "./Router/Route";

const app = createApp(App);
const pinia = createPinia();
const options = {
  timeout: 2000,
};

app.use(Antd);
app.use(Toast, options);
app.use(router);
app.use(pinia);
app.mount("#app");
