<script setup>
import { ref, watchEffect } from "vue";
import { Upload } from "ant-design-vue";
import { toast } from "vue3-toastify";
import Service from "../../../../Services/API"; // Import service chứa API

// Khai báo props
const props = defineProps({
  closeModalUpdate: Function,
  fetchData: Function,
  isShowModalUpdate: Boolean,
  dataModalUpdate: Object,
});

// Danh sách loại sân
const fieldTypes = ref([
  { value: "Sân 5 người", label: "Sân 5 người" },
  { value: "Sân 7 người", label: "Sân 7 người" },
  { value: "Sân 11 người", label: "Sân 11 người" },
]);

// Khai báo các state để lưu thông tin update
const dataUpdate = ref({
  id: "",
  FieldName: "",
  FieldType: "",
  Price30Minute: 0,
  IMGField: "", // Lưu file ảnh
});

const confirmLoading = ref(false);
const newImageFile = ref(null); // Lưu file ảnh mới

// Đồng bộ dữ liệu khi mở modal
watchEffect(() => {
  if (props.dataModalUpdate) {
    // Gán các giá trị từ props vào dataUpdate
    dataUpdate.value = {
      id: props.dataModalUpdate._id || "",
      FieldName: props.dataModalUpdate.FieldName || "",
      FieldType: props.dataModalUpdate.FieldType || "",
      Price30Minute: props.dataModalUpdate.Price30Minute || 0,
      IMGField: props.dataModalUpdate.IMGField || "",
    };
  } else {
    console.log(
      "dataModalUpdate không có giá trị hợp lệ:",
      props.dataModalUpdate
    );
  }
});

// Xử lý sự kiện khi ảnh được thay đổi
const handleChangeImage = (info) => {
  const file = info.file.originFileObj; // Lấy file từ sự kiện Upload của Ant Design
  newImageFile.value = file; // Lưu file mới vào newImageFile
};

// Đóng modal
const handleClose = () => {
  props.closeModalUpdate();
};

// Xử lý sự kiện khi nhấn "OK" để cập nhật sân bóng
const handleSuccess = async () => {
  try {
    if (!dataUpdate.value.FieldName || !dataUpdate.value.FieldType) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const formData = new FormData();

    // Thêm các trường thông tin vào formData
    formData.append("id", dataUpdate.value.id);
    formData.append("FieldName", dataUpdate.value.FieldName);
    formData.append("FieldType", dataUpdate.value.FieldType);
    formData.append(
      "Price30Minute",
      parseInt(dataUpdate.value.Price30Minute, 10)
    );

    // Nếu có ảnh mới, thêm ảnh vào formData
    if (newImageFile.value) {
      formData.append("IMGField", newImageFile.value);
    }

    confirmLoading.value = true;
    // Gửi request cập nhật lên server
    const res = await Service.updateField(formData);

    confirmLoading.value = false;

    if (res && res.data && res.data.EC === 0) {
      toast.success("Cập nhật sân thành công");
      props.fetchData(); // Gọi lại hàm fetchData để tải lại dữ liệu sau khi cập nhật
      handleClose(); // Đóng modal sau khi cập nhật thành công
    } else {
      toast.error(res.data.EM); // Hiển thị thông báo lỗi nếu có
    }
  } catch (error) {
    console.log("Error >>>", error);
  }
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalUpdate"
      title="Cập nhật sân"
      @ok="handleSuccess"
      @cancel="handleClose"
      :style="{ top: '10px' }"
      :width="600"
    >
      <form>
        <div class="mb-3">
          <label class="form-label">Nhập tên sân</label>
          <input
            v-model="dataUpdate.FieldName"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Loại sân</label>
          <a-select
            v-model:value="dataUpdate.FieldType"
            style="width: 550px"
            @change="(value) => (dataUpdate.FieldType = value)"
          >
            <a-select-option
              v-for="type in fieldTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="col pb-4">
          <label class="form-label">Giá</label>
          <a-input-number
            class="w-100"
            v-model:value="dataUpdate.Price30Minute"
          />
        </div>

        <div class="mb-3">
          <div class="d-flex">
            <!-- Ô chứa ảnh cũ -->
            <div
              class="border mx-3 rounded d-flex justify-content-center align-items-center"
              style="width: 100px; height: 100px; position: relative"
            >
              <img
                v-if="dataUpdate.IMGField"
                :src="dataUpdate.IMGField"
                height="100"
                width="100"
                alt="Ảnh sân bóng"
                style="object-fit: cover; border-radius: 4px"
              />
              <span v-if="!dataUpdate.IMGField" style="color: gray"
                >Chưa có ảnh</span
              >
            </div>

            <!-- Ô chứa tải ảnh mới -->
            <Upload
              @change="handleChangeImage"
              list-type="picture-card"
              :max-count="1"
              :multiple="false"
            >
              <div>
                <div class="ant-upload-text">Upload</div>
              </div>
            </Upload>
          </div>
        </div>
      </form>
    </a-modal>
  </div>
</template>
