<template>
  <footer class="bg-footer text-center">
    <div class="container">
      <div class="row">
        <!-- Cột Liên hệ -->
        <div class="col-md-4">
          <h5 class="footer-heading">Liên hệ</h5>
          <p>
            <i class="fas fa-envelope"></i>
            Email:
            <a href="mailto:duyb2014734@student.ctu.edu.vn" class="footer-link"
              >duyb2014734@student.ctu.edu.vn</a
            >
          </p>
          <p class="footer-phone">
            <i class="fas fa-phone-alt"></i>
            SĐT: <span>0123 456 789</span>
          </p>
        </div>

        <!-- Cột Liên kết -->
        <div class="col-md-4">
          <h5 class="footer-heading">Liên kết</h5>
          <a href="/" class="d-block footer-link"
            ><i class="fas fa-home"></i> Trang chủ</a
          >
          <a href="/demo" class="d-block footer-link"
            ><i class="fas fa-info-circle"></i> Giới thiệu</a
          >
        </div>

        <!-- Cột Mạng xã hội -->
        <div class="col-md-4">
          <h5 class="footer-heading">Mạng xã hội</h5>
          <a href="#" class="d-block footer-link"
            ><i class="fab fa-facebook-f"></i> Facebook</a
          >
          <a href="#" class="d-block footer-link"
            ><i class="fab fa-instagram"></i> Instagram</a
          >
        </div>
      </div>
      <p class="">&copy; 2024 Football. Bảo lưu mọi quyền.</p>
    </div>
    <div class="footer-decorative"></div>
  </footer>
</template>

<style scoped>
.bg-footer {
  background-color: rgb(56, 140, 213);
  color: white;
  padding-top: 20px;
  position: relative;
  overflow: hidden; /* Để ẩn các hiệu ứng ngoài khu vực footer */
}

.footer-heading {
  font-size: 1.5rem; /* Kích thước tiêu đề lớn hơn */
  margin-bottom: 1rem; /* Tăng khoảng cách dưới tiêu đề */
  font-weight: bold; /* Làm đậm tiêu đề */
  text-transform: uppercase; /* Chữ hoa */
  letter-spacing: 1px; /* Khoảng cách chữ */
}

.footer-link {
  color: white; /* Màu chữ mặc định cho liên kết */
  transition: color 0.3s ease, transform 0.3s ease; /* Thêm hiệu ứng khi hover */
  text-decoration: none; /* Bỏ gạch chân cho liên kết */
}

.footer-link:hover {
  color: #ffcc00; /* Màu khi hover */
  transform: translateX(5px); /* Di chuyển nhẹ khi hover */
}

.footer-link i {
  margin-right: 8px; /* Khoảng cách giữa icon và văn bản */
}

.footer-phone {
  font-weight: bold; /* Làm đậm số điện thoại */
}

footer p {
  margin-top: 1rem; /* Khoảng cách trên cho đoạn văn bản bản quyền */
  font-size: 0.9rem; /* Kích thước chữ nhỏ hơn cho đoạn văn bản bản quyền */
}

/* Hiệu ứng trang trí cho footer */
.footer-decorative {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Chiều cao của trang trí */
  background-image: url("https://www.transparenttextures.com/patterns/white-linen.png"); /* Hình nền trang trí */
  opacity: 0.1; /* Độ trong suốt cho hình nền */
}

/* Responsive */
@media (max-width: 768px) {
  .footer-heading {
    font-size: 1.3rem; /* Kích thước chữ tiêu đề nhỏ hơn trên thiết bị di động */
  }
  footer p {
    font-size: 0.8rem; /* Kích thước chữ nhỏ hơn cho văn bản bản quyền trên thiết bị di động */
  }
}
</style>
