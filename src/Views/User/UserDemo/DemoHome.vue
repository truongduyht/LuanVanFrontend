<template>
  <div>
    <!-- Giới thiệu sân bóng -->
    <section id="intro">
      <div class="content">
        <h2>Chào Mừng Đến 34FOOTBALL</h2>
        <p>
          Chúng tôi tự hào giới thiệu các sân bóng đá của chúng tôi với chất
          lượng sân cỏ nhân tạo cao cấp, vị trí thuận tiện, phù hợp cho cả các
          đội bóng nghiệp dư và chuyên nghiệp.
        </p>
        <img
          src="https://i.pinimg.com/236x/9b/8a/ac/9b8aaccc265078e55fa2ccd546a5dfeb.jpg"
          alt="Hình ảnh sân bóng"
        />
      </div>
    </section>

    <!-- Tính năng nổi bật -->
    <section id="features">
      <div class="content">
        <h2>Những điểm nổi bật</h2>
        <ul>
          <li>Sân cỏ nhân tạo cao cấp đạt chuẩn</li>
          <li>
            Hệ thống chiếu sáng hiện đại phù hợp với các trận đấu buổi tối
          </li>
          <li>Phòng thay đồ và phòng tắm tiện nghi</li>
          <li>Bãi đỗ xe rộng rãi, miễn phí</li>
          <li>Dịch vụ nước uống và đồ ăn nhẹ tại chỗ</li>
        </ul>
      </div>
    </section>

    <!-- Phần liên hệ -->
    <section id="contact">
      <div class="content">
        <h2>Liên hệ với chúng tôi</h2>
        <p>Để đặt sân hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ:</p>
        <ul>
          <li>Số điện thoại: 0359152231</li>
          <li>Email: duyb2014734@student.ctu.edu.vn</li>
          <li>Địa chỉ: Đường 3 tháng 2, Ninh Kiều, Cần Thơ</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ContentBody",
};
</script>

<style scoped>
/* Định dạng chung cho các section */
section {
  padding: 60px 20px;
  text-align: center;
  background-color: #f5f7fa; /* Nền sáng hơn */
  margin-bottom: 40px;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  color: #0077b6; /* Màu xanh dương đậm cho tiêu đề */
  font-size: 2.2em;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
}

p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #555; /* Màu chữ chính xám nhạt */
  margin-bottom: 40px;
}

/* Định dạng cho danh sách các tính năng */
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 15px;
}

li {
  background-color: #ffffff; /* Nền trắng cho các mục */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 calc(45% - 20px);
  max-width: 45%;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #2c3e50; /* Màu chữ đậm hơn */
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: #e3f2fd; /* Màu nền nhấn khi hover */
}

li p {
  margin: 0;
}

/* Định dạng cho hình ảnh */
img {
  width: 50%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

@media (min-width: 768px) {
  ul {
    justify-content: space-between;
  }

  li {
    flex: 1 1 calc(30% - 20px);
  }
}
</style>
