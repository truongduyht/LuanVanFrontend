<script setup>
import { IconUserSquareRounded } from "@tabler/icons-vue";
import { onMounted, ref, watch } from "vue";
import { authenticationStore } from "../../Stores/Authencation";
import Service from "../../Services/API";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import {
  AppstoreOutlined,
  DollarCircleOutlined,
  SnippetsOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  FormOutlined,
  DashboardOutlined,
} from "@ant-design/icons-vue";

// Biến collapsed để quản lý trạng thái của sidebar (thu gọn/mở rộng)
const collapsed = ref(false);

// Chuyển giá trị từ localStorage thành mảng (nếu không có thì mặc định là ["1"])
const selectedKeys = ref([localStorage.getItem("selectedTab") || "1"]);

const router = useRouter();
const profileAdmin = ref({});

// Khi component được mounted, kiểm tra trạng thái đăng nhập và role người dùng
onMounted(() => {
  profileAdmin.value = authenticationStore().getUser();

  // Đặt tab được chọn theo giá trị từ localStorage
  const savedTab = localStorage.getItem("selectedTab");
  if (savedTab) {
    selectedKeys.value = [savedTab]; // Đảm bảo nó luôn là mảng
  }
});

// Theo dõi sự thay đổi của selectedKeys và lưu vào localStorage
watch(selectedKeys, (newValue) => {
  if (newValue.length > 0) {
    localStorage.setItem("selectedTab", newValue[0]); // Lưu tab được chọn
  }
});

watch(
  () => authenticationStore().getLoading,
  (loading) => {
    const authen = authenticationStore();
    const profile = authen.getUser();
    profileAdmin.value = profile;
    if (!loading && profile._Role !== "admin") {
      router.push("/");
    }
  }
);

const handleLogout = async () => {
  const res = await Service.logout();
  if (res && res.data.EC === 0) {
    router.push("/");
    toast.success(res.data.EM);
    const authentication = authenticationStore();
    authentication.logout();
  } else {
    toast.success(res.data.EM);
  }
};
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <router-link class="text-decoration-none" to="/adminHome">
            <HomeOutlined />
            <span>Trang chủ</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link class="text-decoration-none" to="/adminField">
            <AppstoreOutlined />
            <span>Quản lý sân</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link class="text-decoration-none" to="/adminBooking">
            <SnippetsOutlined />
            <span>Quản lý đặt sân</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link class="text-decoration-none" to="/adminRevenue">
            <DollarCircleOutlined />
            <span>Quản lý doanh thu</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="5">
          <router-link class="text-decoration-none" to="/adminTimeSlot">
            <DashboardOutlined />
            <span>Quản lý giờ trống</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="6">
          <router-link class="text-decoration-none" to="/adminReview">
            <FormOutlined />
            <span>Quản lý đánh giá</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="7">
          <router-link class="text-decoration-none" to="/adminUser">
            <UserOutlined />
            <span>Quản lý người dùng</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="8">
          <div @click="handleLogout">
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="d-flex justify-content-between mx-5">
          <div></div>
          <div>
            <a-dropdown-button>
              {{ profileAdmin?._UserName }}
              <template #icon>
                <IconUserSquareRounded style="margin-bottom: 3px" />
              </template>
            </a-dropdown-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 10px 0"></a-breadcrumb>
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '80vh' }"
        >
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
/* Target the a-layout-sider specifically */
a-layout-sider {
  background-color: rgb(92, 143, 97); /* Đặt màu nền tùy chọn của bạn */
}

a-layout-sider .ant-layout-sider-children {
  background-color: rgb(92, 143, 97); /* Đặt màu nền bên trong sidebar */
}
</style>
