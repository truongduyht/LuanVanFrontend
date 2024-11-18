<script setup>
import { ref, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import Service from "../../../../Services/API";

const props = defineProps({
  closeModalUpdate: Function,
  isShowModalUpdate: Boolean,
  dataModalUpdate: Object,
});
const emit = defineEmits(["updateSuccess"]); // Phát sự kiện updateSuccess
const dataUpdate = ref({
  id: "",
  UserName: "",
  PhoneNumber: "",
  Email: "",
});

const confirmLoading = ref(false);

// Watch for changes in dataModalUpdate to update dataUpdate
watchEffect(() => {
  if (props.dataModalUpdate && props.dataModalUpdate._id) {
    dataUpdate.value.id = props.dataModalUpdate._id || "";
    dataUpdate.value.UserName = props.dataModalUpdate.UserName || "";
    dataUpdate.value.PhoneNumber = props.dataModalUpdate.PhoneNumber || "";
    dataUpdate.value.Email = props.dataModalUpdate.Email || "";
  }
});
console.log("DataUpdate", dataUpdate);

// Handle modal close
const handleClose = () => {
  props.closeModalUpdate();
};

// Handle success when updating user info
const handleSuccess = async () => {
  confirmLoading.value = true;

  try {
    const updateData = {
      id: dataUpdate.value.id,
      UserName: dataUpdate.value.UserName,
      PhoneNumber: dataUpdate.value.PhoneNumber,
      Email: dataUpdate.value.Email,
    };

    console.log("Dữ liệu cập nhật:", updateData); // Debug dữ liệu
    const res = await Service.updateUser(updateData);

    if (res && res.data && res.data.EC === 0) {
      toast.success("Cập nhật thông tin người dùng thành công.");
      emit("updateSuccess");
      handleClose();
    } else {
      toast.error(res.data.EM);
    }
  } catch (error) {
    console.error("Error while updating info:", error);
    toast.error("Có lỗi xảy ra khi cập nhật.");
  } finally {
    confirmLoading.value = false;
  }
};
</script>

<template>
  <a-modal
    :open="props.isShowModalUpdate"
    @ok="handleSuccess"
    @cancel="handleClose"
    title="Cập nhật thông tin"
    okText="Cập nhật"
    cancelText="Hủy"
    :confirmLoading="confirmLoading"
  >
    <div>
      <div class="mb-3">
        <label class="form-label">Tên người dùng</label>
        <input v-model="dataUpdate.UserName" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="dataUpdate.PhoneNumber"
          type="text"
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="dataUpdate.Email" type="text" class="form-control" />
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* Add any additional styling for the modal here */
</style>
