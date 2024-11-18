<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useToast } from "vue-toastification";
import Service from "../../../Services/API";

const confirmLoading = ref(false);

const props = defineProps({
  isShowModalRegister: Boolean,
  closeModalRegister: Function,
});

const dataUser = ref({
  UserName: "",
  PhoneNumber: "",
  Email: "",
  Password: "",
});

const confirmPassword = ref("");

const validate = () => {
  if (!dataUser.value.UserName) {
    toast.error("Nhập thiếu họ tên!!!");
    return false;
  }
  if (!dataUser.value.PhoneNumber) {
    toast.error("Nhập thiếu số điện thoại!!!");
    return false;
  }
  if (!dataUser.value.Email) {
    toast.error("Nhập thiếu địa chỉ email!!!");
    return false;
  }
  if (!dataUser.value.Password) {
    toast.error("Nhập thiếu mật khẩu!!!");
    return false;
  }
  if (!confirmPassword.value) {
    toast.error("Nhập thiếu xác nhận mật khẩu!!!");
    return false;
  }
  if (dataUser.value.Password !== confirmPassword.value) {
    toast.error("Mật khẩu và xác nhận mật khẩu không khớp!!!");
    return false;
  }
  return true;
};

const handleSuccess = async () => {
  const validated = validate();
  if (!validated) {
    return;
  }

  const res = await Service.register(dataUser.value);
  if (res && res.data.EC === 0 && res.data.DT._id) {
    useToast().success(res.data.EM);
    handleCancel();
  } else {
    useToast().error(res.data.EM); // Thay đổi để thông báo lỗi
  }
};

const handleCancel = async () => {
  dataUser.value = {
    UserName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
  };
  confirmPassword.value = "";
  props.closeModalRegister();
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalRegister"
      :confirm-loading="confirmLoading"
      @ok="handleSuccess"
      title="Đăng Ký"
      @cancel="handleCancel"
      okText="Đăng Ký"
      class="modal-register"
      centered
      width="500px"
    >
      <div class="modal-content">
        <form @submit.prevent="handleSuccess">
          <div class="form-group">
            <label class="label" for="userName">Họ và tên</label>
            <input
              v-model="dataUser.UserName"
              type="text"
              class="form-control"
              id="userName"
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div class="form-group">
            <label class="label" for="phoneNumber">Số điện thoại</label>
            <input
              v-model="dataUser.PhoneNumber"
              type="text"
              class="form-control"
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div class="form-group">
            <label class="label" for="email">Địa chỉ Email</label>
            <input
              v-model="dataUser.Email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Nhập địa chỉ email"
              required
            />
          </div>
          <div class="form-group">
            <label class="label" for="password">Mật khẩu</label>
            <input
              v-model="dataUser.Password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div class="form-group">
            <label class="label" for="confirmPassword">Nhập lại mật khẩu</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu"
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
  justify-content: flex-end; /* Căn phải cho footer */
  margin-top: 1rem; /* Khoảng cách trên footer */
}

.btn-submit {
  background-color: #007bff; /* Nền nút đăng ký */
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
</style>
