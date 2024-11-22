<template>
  <div class="main-content container-fluid text-center">
    <!-- Phần chữ chạy -->
    <div class="marquee">
      <p>
        Chào mừng bạn đến với hệ thống đặt sân bóng đá cao cấp! Đặt sân ngay hôm
        nay để nhận ưu đãi tốt nhất!
      </p>
    </div>

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
.marquee {
  width: 100%;
  height: 40px;
  overflow: hidden;
  white-space: nowrap;
  /* padding: 1rem 0; */
  background-color: #00cc99;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.marquee p {
  display: inline-block;
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Phần chính của trang */
.main-content {
  background-image: url("https://i.pinimg.com/236x/09/a7/e3/09a7e3729b93975f0b42ab2af7329cca.jpg");
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: white;
  /* padding: 5rem 1rem; */
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 5rem;
  position: relative;
  z-index: 1;
}

.main-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.title {
  font-size: 3rem;
  color: #ffffff;
  font-weight: bold;
  padding-top: 5px;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

.description {
  font-size: 1.5rem;
  color: #f1f1f1;
  margin-bottom: 4rem;
}

.benefits {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit-item {
  flex: 1 1 30%;
  min-width: 240px;
  max-width: 300px;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  transition: transform 0.3s ease;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.benefit-item:hover {
  transform: translateY(-10px);
}

.benefit-item h5 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #00ffcc;
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc;
  }
  to {
    text-shadow: 0 0 20px #ffffff, 0 0 30px #00ffcc, 0 0 40px #00ffcc;
  }
}

.benefit-item p {
  font-size: 1.1rem;
  color: #e0e0e0;
}

.cta-section button {
  background-color: #007bff;
  border: none;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

.cta-section button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .benefits {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .main-content {
    background-attachment: scroll;
  }
}
</style>
