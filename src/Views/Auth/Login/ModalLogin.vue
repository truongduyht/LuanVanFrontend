<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { toast } from "vue3-toastify";
import Service from "../../../Services/API";
import { useRouter } from "vue-router";
import { authenticationStore } from "../../../Stores/Authencation";

const confirmLoading = ref(false);
const router = useRouter();
const authentication = authenticationStore();

const props = defineProps({
  isShowModalLogin: Boolean,
  closeModalLogin: Function,
});

const dataLoginUser = ref({
  PhoneNumber: "",
  Password: "",
});

const validate = () => {
  if (!dataLoginUser.value.PhoneNumber) {
    toast.error("Nhập thiếu số điện thoại !!!");
    return false;
  }
  if (!dataLoginUser.value.Password) {
    toast.error("Nhập thiếu mật khẩu !!!");
    return false;
  }
  return true;
};

const handleCancel = () => {
  dataLoginUser.value = {
    PhoneNumber: "",
    Password: "",
  };
  props.closeModalLogin();
};

const handleSuccess = async () => {
  const validated = validate();
  if (!validated) {
    return;
  }
  const res = await Service.login(dataLoginUser.value);
  if (res && res.data.EC === 0 && res.data.DT.token) {
    useToast().success(res.data.EM);
    handleCancel();
    authentication.setUserAndLogin(res.data.DT.tokentData);

    if (res.data.DT.tokentData.Role === "admin") {
      router.push("/adminHome");
    } else {
      router.push("/");
    }
  } else {
    useToast().error(res.data.EM); // Thay đổi để thông báo lỗi
  }
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalLogin"
      :confirm-loading="confirmLoading"
      @ok="handleSuccess"
      @cancel="handleCancel"
      title="Đăng Nhập"
      okText="Đăng Nhập"
      cancelText="Hủy"
      class="modal-login"
      centered
      width="500px"
    >
      <div class="modal-content">
        <form @submit.prevent="handleSuccess">
          <div class="form-group">
            <label class="label" for="phoneNumber">Số Điện Thoại</label>
            <input
              v-model="dataLoginUser.PhoneNumber"
              type="text"
              class="form-control"
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div class="form-group">
            <label class="label" for="password">Mật Khẩu</label>
            <input
              v-model="dataLoginUser.Password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
        </form>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.modal-content {
  padding: 20px;
  background-color: #f9f9f9; /* Màu nền nhạt cho modal */
  border-radius: 12px; /* Bo tròn các góc */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); /* Bóng đổ cho modal */
}

.label {
  font-weight: 600; /* Đậm cho nhãn */
  color: #444; /* Màu chữ tối cho nhãn */
  margin-bottom: 8px; /* Khoảng cách dưới nhãn */
}

.form-control {
  border: 1px solid #ddd; /* Đường viền sáng */
  border-radius: 8px; /* Bo tròn góc input */
  padding: 12px; /* Padding cho input */
  width: 100%; /* Đảm bảo input chiếm hết chiều rộng */
  transition: border-color 0.3s, box-shadow 0.3s; /* Hiệu ứng chuyển màu cho viền */
}

.form-control:focus {
  border-color: #007bff; /* Đổi màu đường viền khi focus */
  outline: none; /* Ẩn outline mặc định */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Hiệu ứng shadow khi focus */
}

.form-group {
  margin-bottom: 1.5rem; /* Khoảng cách giữa các trường nhập */
}

.form-footer {
  display: flex;
  justify-content: space-between; /* Căn đều giữa nút đăng nhập và liên kết */
  margin-top: 1rem; /* Khoảng cách trên footer */
}

.btn-submit {
  background-color: #007bff; /* Nền nút đăng nhập */
  color: #fff; /* Màu chữ trắng */
  border: none; /* Ẩn viền */
  border-radius: 8px; /* Bo tròn góc nút */
  padding: 10px 20px; /* Padding cho nút */
  cursor: pointer; /* Con trỏ khi hover */
  transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

.btn-submit:hover {
  background-color: #0056b3; /* Đổi màu khi hover */
}

.forgot-password {
  color: #007bff; /* Màu chữ cho liên kết quên mật khẩu */
  text-decoration: none; /* Ẩn gạch chân */
  font-size: 0.9rem; /* Kích thước chữ nhỏ cho liên kết */
}

.forgot-password:hover {
  text-decoration: underline; /* Gạch chân khi hover */
}
</style>
