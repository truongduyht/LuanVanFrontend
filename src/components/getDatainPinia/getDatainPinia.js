import { ref, watchEffect } from "vue";
import { authenticationStore } from "../../stores/authenticationStore";

const profile = ref({});
const isLogin = ref(false);

const getProfilePinia = () => {
  const authentication = authenticationStore();

  // Sử dụng watchEffect để cập nhật giá trị mỗi khi authentication thay đổi
  watchEffect(() => {
    profile.value = authentication?.getUser();
    isLogin.value = authentication?.getStateLogin();
  });

  return { profile, isLogin };
};

export default getProfilePinia;
