<template>
  <div class="">
    <h2 class="text-center">Chào Mừng {{ profile?._UserName }}</h2>
    <div class="row">
      <div
        class="bg-info-subtle ps-4 pt-4 col-lg col-md-3 dashboardItem mx-2 border"
      >
        <div class="p-2 fs-5">
          <div class="fs-3 fw-bolder">Thống kê sân</div>
          <d class="fw-medium">Tổng số sân : {{ data?.field }}</d>
        </div>
      </div>

      <div
        class="bg-info-subtle ps-4 pt-4 col-lg col-md-3 dashboardItem mx-2 border"
      >
        <div class="p-2 fs-5">
          <div class="fs-3 fw-bolder">Thống kê người dùng</div>
          <div class="fw-medium">Tổng người dùng : {{ data?.user }}</div>
        </div>
      </div>

      <div
        class="bg-info-subtle ps-4 pt-4 col-lg col-md-3 dashboardItem mx-2 border"
      >
        <div class="p-2 fs-5">
          <div class="fs-3 fw-bolder">Thống kê đơn đặt</div>
          <div class="fw-medium">
            Tổng đơn "Đã hoàn thành": {{ data?.book }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboardItem {
  height: 150px;
  border-radius: 10px;
}
</style>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import Service from "../../Services/API";
import { authenticationStore } from "../../Stores/Authencation";

const authentication = authenticationStore();
const profile = ref({});
const isLogin = ref(false);
const data = ref({});
const receivedBookingsCount = ref(0); // Biến để lưu số lượng đơn "đã nhận sân"

// Hàm lấy dữ liệu và lọc theo trạng thái "đã nhận sân"
const fetchData = async () => {
  const res = await Service.dashboard();
  if (res && res.data.EC === 0) {
    data.value = res.data.DT;

    // Lọc các đơn có trạng thái "da_nhan_san"
  }
};

onMounted(() => {
  fetchData();
});

watchEffect(() => {
  profile.value = authentication.getUser();
  isLogin.value = authentication.getStateLogin();
});
</script>
