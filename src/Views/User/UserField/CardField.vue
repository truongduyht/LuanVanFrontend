<script setup>
import { ref } from "vue";

const props = defineProps({
  Status: String,
  FieldName: String,
  FieldType: String,
  Price30Minute: Number,
  url: String,
});
</script>

<template>
  <div
    class="card mb-3 shadow-sm"
    :class="{ 'card-maintenance': props.Status === 'maintenance' }"
  >
    <div class="image-container">
      <!-- Hình ảnh sân -->
      <img :src="props?.url" alt="notFound" class="card-img-top" />
    </div>

    <!-- Nội dung chi tiết sân -->
    <div class="card-body text-center">
      <h5 class="card-title">{{ props?.FieldName }}</h5>
      <p class="card-type">
        Loại sân: <strong>{{ props?.FieldType }}</strong>
      </p>
      <p class="card-price">
        Giá:
        <strong>{{ props?.Price30Minute?.toLocaleString("vi-VN") }} đ</strong>
      </p>
    </div>

    <!-- Thêm dòng chữ "Bảo trì" khi trạng thái là maintenance -->
    <p v-if="props.Status === 'maintenance'" class="maintenance-text">
      Bảo trì
    </p>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative; /* Thêm position relative cho card */
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  height: 180px;
  width: 100%;
  overflow: hidden;
  position: relative; /* Thêm position relative cho container */
}

.card-img-top {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-type {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.card-price {
  font-size: 16px;
  color: #28a745;
  margin-bottom: 0;
}

.card-price strong {
  color: #28a745;
}

/* CSS cho thẻ bảo trì */
.card-maintenance {
  opacity: 0.6; /* Làm mờ thẻ */
  pointer-events: none; /* Không cho phép tương tác với thẻ */
  cursor: default; /* Hiển thị dấu mũi tên khi hover vào thẻ */
}

.maintenance-text {
  color: #ff0019; /* Màu sắc cho dòng chữ bảo trì */
  font-weight: bold;
  position: absolute; /* Đặt vị trí tuyệt đối */
  top: 40%; /* Đặt chữ ở giữa theo chiều dọc */
  left: 50%; /* Đặt chữ ở giữa theo chiều ngang */
  transform: translate(-50%, -50%); /* Canh giữa */
  font-size: 40px; /* Kích thước chữ */
  white-space: nowrap; /* Ngăn không cho chữ xuống dòng */
  z-index: 1; /* Đảm bảo chữ ở trên cùng */
}
</style>
