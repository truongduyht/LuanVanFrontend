<template>
  <div class="main-content container-fluid text-center">
    <!-- Phần tiêu đề -->
    <h1 class="title">Sân Bóng Đá Cao Cấp</h1>

    <!-- Mô tả ngắn -->
    <p class="description lead mb-5">
      Tìm kiếm và đặt sân bóng đá một cách dễ dàng và nhanh chóng. Trải nghiệm
      trận đấu với chất lượng sân tốt nhất!
    </p>

    <!-- Lợi ích khi đặt sân -->
    <div class="benefits d-flex justify-content-center gap-4 mb-5">
      <div class="benefit-item text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7324/7324256.png"
          alt="Giá hợp lý"
          width="80"
          class="mb-3"
        />
        <h5>Giá Cả Hợp Lý</h5>
        <p>Đặt sân với giá ưu đãi nhất.</p>
      </div>
      <div class="benefit-item text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7324/7324263.png"
          alt="Chất lượng sân cao"
          width="80"
          class="mb-3"
        />
        <h5>Sân Chất Lượng Cao</h5>
        <p>Mặt sân đạt chuẩn quốc tế.</p>
      </div>
      <div class="benefit-item text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7324/7324270.png"
          alt="Đặt lịch dễ dàng"
          width="80"
          class="mb-3"
        />
        <h5>Đặt Lịch Dễ Dàng</h5>
        <p>Chọn sân và đặt lịch chỉ trong vài cú nhấp chuột.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Phong cách cho phần giữa trang */
.main-content {
  background-image: url("https://i.pinimg.com/236x/09/a7/e3/09a7e3729b93975f0b42ab2af7329cca.jpg");
  background-size: 80%; /* Điều chỉnh kích thước ảnh nền nhỏ hơn */
  background-repeat: no-repeat; /* Đảm bảo hình nền không lặp lại */
  background-position: center; /* Đặt vị trí hình nền ở giữa */
  color: white; /* Đổi màu chữ thành trắng để dễ đọc */
  padding: 5rem 1rem; /* Tăng padding cho phần này */
  position: relative;
  z-index: 1;
}

/* Overlay để làm mờ hình nền và giúp văn bản nổi bật hơn */
.main-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Tạo lớp phủ tối trên hình nền */
  z-index: -1; /* Đặt lớp phủ nằm dưới nội dung */
}

.title {
  font-size: 3rem; /* Tăng kích thước tiêu đề */
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7); /* Hiệu ứng đổ bóng để dễ nhìn hơn */
}

.description {
  font-size: 1.5rem; /* Tăng kích thước mô tả */
  color: #f1f1f1;
  margin-bottom: 4rem; /* Tăng khoảng cách dưới */
}

.benefits {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px; /* Đặt chiều rộng tối đa cho phần lợi ích */
  margin: 0 auto; /* Căn giữa */
}

.benefit-item {
  flex: 1 1 30%;
  min-width: 240px; /* Kích thước tối thiểu cho lợi ích */
  max-width: 300px; /* Kích thước tối đa cho lợi ích */
  padding: 2rem; /* Tăng padding cho phần lợi ích */
  background-color: rgba(255, 255, 255, 0.15); /* Làm nền trong suốt */
  border-radius: 15px; /* Làm tròn các góc */
  transition: transform 0.3s ease;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6); /* Hiệu ứng đổ bóng cho chữ */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Thêm bóng cho từng mục */
}

.benefit-item:hover {
  transform: translateY(-10px); /* Hiệu ứng nổi lên khi hover */
}

.benefit-item h5 {
  font-size: 1.5rem; /* Tăng kích thước tiêu đề lợi ích */
  margin-bottom: 0.5rem;
  color: #00ffcc; /* Màu nổi bật cho tiêu đề của lợi ích */
}

.benefit-item p {
  font-size: 1.1rem; /* Tăng kích thước văn bản mô tả */
  color: #e0e0e0;
}

.cta-section button {
  background-color: #007bff;
  border: none;
  font-size: 1.5rem; /* Đảm bảo nút lớn và dễ nhấn */
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5); /* Thêm bóng cho nút */
}

.cta-section button:hover {
  background-color: #0056b3; /* Tối màu nút khi hover */
}

/* Responsive */
@media (max-width: 768px) {
  .benefits {
    flex-direction: column; /* Chuyển đổi thành cột trên thiết bị nhỏ */
    align-items: center;
    gap: 2rem; /* Khoảng cách giữa các mục */
  }
}
</style>
