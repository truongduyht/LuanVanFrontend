<script setup>
import { ref, watchEffect } from "vue";
import { Select, Modal } from "ant-design-vue";
import { toast } from "vue3-toastify";
import Service from "../../../../Services/API"; // Import service chứa API

// Khai báo props
const props = defineProps({
  closeModalUpdateReviewStatus: Function,
  fetchData: Function,
  isShowModalUpdateReviewStatus: Boolean,
  dataModalUpdateReviewStatus: Object,
});
console.log("DATA", props.dataModalUpdateReviewStatus);

// Danh sách các trạng thái đánh giá
const reviewStatuses = ref([
  { value: "good", label: "Tốt" },
  { value: "bad", label: "Xấu" },
]);

// Khai báo các state để lưu thông tin cập nhật trạng thái
const dataUpdateReviewStatus = ref({
  id: "",
  Status: "",
});

// Đồng bộ dữ liệu khi mở modal
watchEffect(() => {
  if (props.dataModalUpdateReviewStatus) {
    // Gán các giá trị từ props vào dataUpdateReviewStatus
    dataUpdateReviewStatus.value = {
      id: props.dataModalUpdateReviewStatus._id || "",
      Status: props.dataModalUpdateReviewStatus.Status || "",
    };
  }
});
console.log("DATAMODATEUPDATE", dataUpdateReviewStatus.value);

// Đóng modal
const handleClose = () => {
  props.closeModalUpdateReviewStatus();
};

// Xử lý sự kiện khi nhấn "OK" để cập nhật trạng thái đánh giá
const handleSuccess = async () => {
  try {
    if (!dataUpdateReviewStatus.value.Status) {
      toast.error("Vui lòng chọn trạng thái.");
      return;
    }

    const res = await Service.updateReviewStatus({
      id: dataUpdateReviewStatus.value.id,
      Status: dataUpdateReviewStatus.value.Status,
    });
    console.log(res);

    if (res && res.data && res.data.EC === 0) {
      toast.success("Cập nhật trạng thái đánh giá thành công");
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
      :open="isShowModalUpdateReviewStatus"
      title="Cập nhật trạng thái đánh giá"
      @ok="handleSuccess"
      @cancel="handleClose"
      :style="{ top: '10px' }"
      :width="600"
    >
      <form>
        <div class="mb-3">
          <label class="form-label">Chọn trạng thái đánh giá</label>
          <a-select
            v-model:value="dataUpdateReviewStatus.Status"
            style="width: 550px"
          >
            <a-select-option
              v-for="status in reviewStatuses"
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
