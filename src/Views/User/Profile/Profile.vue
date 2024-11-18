<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import ModalUpdateUser from "./Update/ModalUpdateUser.vue";
import Services from "../../../Services/API";
import { authenticationStore } from "../../../Stores/Authencation";

const profile = ref(null);
const isShowModalUpdate = ref(false);
const dataModalUpdate = ref({});
const statistics = ref({
  booked: 0,
  received: 0,
  canceled: 0,
});

// Hàm fetchData để lấy thông tin người dùng đang đăng nhập
const fetchData = async () => {
  try {
    const response = await Services.fecthProfile();
    if (response && response.data.EC === 0) {
      profile.value = response.data.DT; // Cập nhật profile từ API

      fetchStatistics(response.data.DT.Id); // Lấy thống kê dựa trên _id của profile
    }
  } catch (error) {
    console.error("Lỗi khi gọi API thông tin người dùng", error);
  }
};

// Hàm fetchStatistics để lấy thông tin thống kê dựa trên _id người dùng
const fetchStatistics = async (userId) => {
  try {
    // Gọi API để lấy thông tin thống kê

    const response = await Services.statistic(`UserID=${userId}`);

    if (response && response.data.EC === 0 && response.data.DT) {
      statistics.value = response.data.DT; // Cập nhật thống kê
    } else {
      console.error(
        "Lỗi khi lấy thống kê:",
        response ? response.EM : "Dữ liệu không hợp lệ."
      );
    }
  } catch (error) {
    console.error("Lỗi khi gọi API thống kê:", error);
  }
};

// Hàm mở modal
const handleUpdate = () => {
  console.log("Profile", profile.value);

  if (profile.value) {
    dataModalUpdate.value = {
      _id: profile.value.Id,
      UserName: profile.value.UserName,
      PhoneNumber: profile.value.PhoneNumber,
      Email: profile.value.Email,
    };
    isShowModalUpdate.value = true;
  }
};

// Hàm gọi lại dữ liệu sau khi cập nhật thành công
const refreshUserData = () => {
  authenticationStore()?.fetchUser();
};

// Hàm đóng modal
const closeModalUpdate = () => {
  isShowModalUpdate.value = false;
};

// Theo dõi sự thay đổi của profile và gọi API lấy thông tin khi có dữ liệu
watchEffect(() => {
  const authentication = authenticationStore();
  profile.value = authentication.getUser(); // Lấy profile từ store
  fetchData();
});
</script>

<template>
  <div>
    <div class="profile d-flex justify-content-center">
      <div class="row w-100">
        <!-- Phần Hồ sơ người dùng (chiếm 50%) -->
        <div class="col-md-5 profile-info">
          <div
            class="d-flex flex-column justify-content-around align-items-center h-100"
          >
            <div class="title fs-2">Hồ Sơ</div>
            <div>
              <div class="pt-2">
                Họ và tên:
                {{ authenticationStore()?.getUser()._UserName || "" }}
              </div>
              <div class="pt-2">
                Số điện thoại:
                {{ authenticationStore()?.getUser()._PhoneNumber || "" }}
              </div>
              <div class="pt-2">
                Email: {{ authenticationStore()?.getUser()._Email || "" }}
              </div>
              <button
                type="button"
                class="ps-3 pe-3 btn btn-primary mt-3"
                @click="handleUpdate"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        <!-- Dòng gạch đỏ phân cách -->
        <div class="col-1 border-left border-danger"></div>

        <!-- Phần Thống kê đặt sân (chiếm 50%) -->
        <div class="col-md-5">
          <div
            class="d-flex flex-column justify-content-center align-items-center h-100"
          >
            <div class="title fs-2">Thống Kê Đặt Sân</div>
            <div>
              <div class="pt-2">Sân đã đặt: {{ statistics?.booked || 0 }}</div>
              <div class="pt-2">
                Sân đã nhận: {{ statistics?.received || 0 }}
              </div>
              <div class="pt-2">
                Sân đã hủy: {{ statistics?.canceled || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Update User -->
    <ModalUpdateUser
      :isShowModalUpdate="isShowModalUpdate"
      :closeModalUpdate="closeModalUpdate"
      :dataModalUpdate="dataModalUpdate"
      @updateSuccess="refreshUserData"
    />
  </div>
</template>

<style scoped>
.profile {
  min-height: 80vh;
  padding: 100px;
}

.title {
  font-weight: 700;
  font-size: 25px;
}

/* Bố cục flexbox để chia cột */
.row {
  display: flex;
  width: 100%; /* Đảm bảo row chiếm hết chiều rộng */
  justify-content: center; /* Căn giữa các cột */
}

/* Phần Hồ sơ và Thống kê đều chiếm 50% chiều rộng */
.col-md-5 {
  padding-right: 30px;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* Đảm bảo chiều cao chiếm hết không gian */
}

/* Cột ngăn cách với gạch đỏ */
.col-1.border-left.border-danger {
  border-left: 3px solid red;
}

/* Căn giữa nội dung trong cột */
.d-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Đảm bảo chiều cao cột không bị dư thừa */
}

/* Loại bỏ khoảng trống thừa trong phần Thống kê */
.col-md-5 > .d-flex {
  margin-top: 0; /* Đảm bảo không có khoảng cách dư thừa trên */
  padding-top: 0; /* Loại bỏ padding nếu có */
}

button {
  margin-top: 15px;
  margin-left: 30%;
}
</style>
