<script setup>
import { ref, watchEffect } from "vue";
import { Select, Modal } from "ant-design-vue";
import { toast } from "vue3-toastify";
import Service from "../../../../Services/API"; // Import service chứa API

// Khai báo props
const props = defineProps({
  closeModalUpdateStatus: Function,
  fetchData: Function,
  isShowModalUpdateStatus: Boolean,
  dataModalUpdateStatus: Object,
});
console.log("DATA", props.dataModalUpdateStatus);

// Danh sách trạng thái sân
const fieldStatuses = ref([
  { value: "ok", label: "Hoạt động" },
  { value: "maintenance", label: "Bảo trì" },
]);

// Khai báo các state để lưu thông tin cập nhật trạng thái
const dataUpdateStatus = ref({
  id: "",
  Status: "",
});

// Đồng bộ dữ liệu khi mở modal
watchEffect(() => {
  if (props.dataModalUpdateStatus) {
    // Gán các giá trị từ props vào dataUpdateStatus
    dataUpdateStatus.value = {
      id: props.dataModalUpdateStatus._id || "",
      Status: props.dataModalUpdateStatus.Status || "",
    };
  }
});
console.log("DATAMODATEUPDATE", dataUpdateStatus.value);

// Đóng modal
const handleClose = () => {
  props.closeModalUpdateStatus();
};

// Xử lý sự kiện khi nhấn "OK" để cập nhật trạng thái sân bóng
const handleSuccess = async () => {
  try {
    if (!dataUpdateStatus.value.Status) {
      toast.error("Vui lòng chọn trạng thái.");
      return;
    }

    const res = await Service.updateFieldStatus({
      id: dataUpdateStatus.value.id,
      Status: dataUpdateStatus.value.Status,
    });
    console.log(res);

    if (res && res.data && res.data.EC === 0) {
      toast.success("Cập nhật trạng thái sân thành công");
      props.fetchData(); // Gọi lại hàm fetchData để tải lại dữ liệu sau khi cập nhật
      handleClose(); // Đóng modal sau khi cập nhật thành công
    } else {
      toast.error(res.data.EM); // Hiển thị thông báo lỗi nếu có
    }
  } catch (error) {
    console.error("Error >>>", error);
    toast.error("Đã xảy ra lỗi trong quá trình cập nhật.");
  }
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalUpdateStatus"
      title="Cập nhật trạng thái sân"
      @ok="handleSuccess"
      @cancel="handleClose"
      :style="{ top: '10px' }"
      :width="600"
    >
      <form>
        <div class="mb-3">
          <label class="form-label">Chọn trạng thái sân</label>
          <a-select
            v-model:value="dataUpdateStatus.Status"
            style="width: 550px"
          >
            <a-select-option
              v-for="status in fieldStatuses"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </a-select-option>
          </a-select>
        </div>
      </form>
    </a-modal>
  </div>
</template>

<style scoped>
/* Thêm các kiểu dáng nếu cần */
</style>
