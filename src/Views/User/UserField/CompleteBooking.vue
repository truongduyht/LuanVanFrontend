<script setup>
// import { ref } from "vue";
// const value = ref(4);
</script>

<template>
  <div class="cardComplete m-auto">
    <div class="card-body text-center">
      <h2 class="card-title pb-2 border-bottom border-3 border-black">
        Đặt Sân Thành Công!!!
      </h2>
      <!-- <i class="fa-solid fa-check-to-slot iconComplete"></i> -->
      <div class="colComplete row mt-4">
        <div class="col-6">
          <div>
            <h5>Bạn còn muốn đặt thêm sân</h5>
          </div>
          <div>
            <RouterLink to="/field">
              <button type="button" class="btn btn-primary mt-3">
                Danh sách sân
              </button>
            </RouterLink>
          </div>
        </div>
        <div class="col-6">
          <div>
            <h5>Xem danh sách đơn đặt sân</h5>
          </div>
          <div>
            <RouterLink to="/booking">
              <button type="button" class="btn btn-primary mt-3">
                Danh sách đơn
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<style>
.cardComplete {
  width: 800px;
  padding-top: 60px;
}
.iconComplete {
  width: 300px;
  height: 300px;
}
.colComplete {
  height: 400px;
}
</style>
