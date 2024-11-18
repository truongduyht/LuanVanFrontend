<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

import Service from "../../../Services/API";

import ModalLogin from "../Login/ModalLogin.vue";
import ModalRegister from "../Register/ModalRegister.vue";

import { authenticationStore } from "../../../Stores/Authencation";

const router = useRouter();
const authentication = authenticationStore();
const profile = ref({});
const isLogin = ref(false);

// Watch for changes in user authentication state
watchEffect(() => {
  profile.value = authentication.getUser();
  isLogin.value = authentication.getStateLogin();
});

// Logout function
const handleLogout = async () => {
  const res = await Service.logout();
  if (res && res.data.EC === 0) {
    router.push("/");
    toast.success(res.data.EM);
    authentication.logout();
  } else {
    toast.error(res.data.EM);
  }
};

// Modal state
const isShowModalLogin = ref(false);
const isShowModalRegister = ref(false);

const OpenModalLogin = () => {
  isShowModalLogin.value = true;
};

const closeModalLogin = () => {
  isShowModalLogin.value = false;
};

const OpenModalRegister = () => {
  isShowModalRegister.value = true;
};

const closeModalRegister = () => {
  isShowModalRegister.value = false;
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-header">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <!-- Logo -->
        <img
          height="70"
          width="70"
          class="border rounded-circle me-1"
          src="https://img.freepik.com/premium-vector/stadium-logo-illustration_848918-22836.jpg?w=740"
          alt="Football Logo"
        />
        <!-- Tên sân bóng -->
        <h5 class="mb-0 site-name">34FOOTBALL</h5>
      </a>

      <!-- Toggle button for mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item mx-3">
            <router-link v-if="isLogin" class="nav-link" to="/field">
              Danh sách sân bóng
            </router-link>
            <router-link v-else class="nav-link" to="" @click="OpenModalLogin">
              Danh sách sân bóng
            </router-link>
          </li>
          <li class="nav-item mx-3">
            <router-link class="nav-link active" aria-current="page" to="/demo">
              Giới thiệu
            </router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <a-dropdown-button v-if="isLogin">
            <span class="me-2">{{ profile?._UserName || "" }}</span>
            <template #overlay>
              <a-menu class="text-decoration-none">
                <router-link class="text-decoration-none" to="/profile">
                  <a-menu-item key="1"> Hồ sơ </a-menu-item>
                </router-link>
                <router-link class="text-decoration-none" to="/booking">
                  <a-menu-item key="3"> Lịch sử đặt sân </a-menu-item>
                </router-link>
                <a-menu-item key="4">
                  <router-link
                    class="text-decoration-none"
                    to="/"
                    @click="handleLogout"
                  >
                    Đăng xuất
                  </router-link>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>

          <a-dropdown-button v-else>
            Tài khoản
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <div class="text-center">
                    <button
                      @click="OpenModalLogin"
                      class="btn btn-primary px-4"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </a-menu-item>

                <a-menu-item key="2">
                  <div class="text-center">
                    Chưa có tài khoản ?
                    <span class="text-warning" @click="OpenModalRegister">
                      Đăng ký
                    </span>
                    ngay
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>
        </div>
      </div>
    </div>

    <ModalLogin
      :isShowModalLogin="isShowModalLogin"
      :closeModalLogin="closeModalLogin"
    />

    <ModalRegister
      :isShowModalRegister="isShowModalRegister"
      :closeModalRegister="closeModalRegister"
    />
  </nav>
</template>

<style scoped>
/* Định dạng header */
.bg-header {
  background: rgb(56, 140, 213);
  transition: background-color 0.3s ease;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(0, 0, 0);
  margin: 0;
}

/* Căn chỉnh khoảng cách giữa các phần tử logo và tên */
.navbar-brand img {
  margin-right: 10px;
}

.navbar-nav .nav-link {
  transition: color 0.3s ease;
  color: white;
}

.navbar-nav .nav-link:hover {
  color: #000000;
  background-color: #f0f0f0d3;
  border-radius: 10px;
}

a-dropdown-button {
  margin-left: 10px;
}

a-dropdown-button:hover {
  color: rgba(255, 255, 255, 0.8);
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

a-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
</style>
