<script setup>
import { ref, onMounted } from "vue";
import { Upload } from "ant-design-vue";
import Service from "../../../../Services/API";
import { toast } from "vue3-toastify";

const props = defineProps({
  closeModalAdd: Function,
  isShowModalAdd: Boolean,
  fetchData: Function,
});

const FieldName = ref("");
const Price30Minute = ref(0);
const FieldType = ref("");
const IMGField = ref("");

const confirmLoading = ref(false);

// Xử lí hình ảnh
const handleChangeImage = (info) => {
  const file = info.file.originFileObj;
  if (file) {
    IMGField.value = file;
  } else {
    console.error("Không có tệp tin được chọn");
  }
};

// Xử lí chọn loại sân
const handleChangeSelectType = (value) => {
  FieldType.value = value;
};

// Price
const handlePrice = (data) => {
  Price30Minute.value = data;
};

// Goi API thanh cong xóa dữ liệu và đóng đi
const handleClose = () => {
  FieldName.value = "";
  Price30Minute.value = 0;
  IMGField.value = "";
  FieldType.value = "";
  props.closeModalAdd();
  props.fetchData();
};
const handleSucces = async () => {
  try {
    if (
      !FieldName.value ||
      !FieldType.value ||
      !Price30Minute.value ||
      !IMGField.value
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("FieldName", FieldName.value);
    formData.append("Price30Minute", parseInt(Price30Minute.value, 10));
    formData.append("FieldType", FieldType.value);
    formData.append("IMGField", IMGField.value);

    confirmLoading.value = true;
    const res = await Service.createField(formData);
    confirmLoading.value = false;

    if (res && res.data && res.data.EC === 0) {
      toast.success("Thêm sân thành công");
      handleClose();
      props.fetchData(); // Refresh data after adding a new field
    } else {
      toast.error(res.data.EM || "Có lỗi xảy ra, vui lòng thử lại!");
    }
  } catch (error) {
    confirmLoading.value = false;
    toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    console.error("Error while creating field:", error);
  }
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalAdd"
      title="Thêm Sân"
      :confirm-loading="confirmLoading"
      @ok="handleSucces"
      @cancel="handleClose"
      :style="{ top: '10px' }"
    >
      <form>
        <div class="mb-3">
          <label class="form-label">Nhập tên sân</label>
          <input v-model="FieldName" type="text" class="form-control" />
        </div>
        <div class="mb-3 row">
          <div class="col">
            <label class="form-label">Loại sân</label>
            <a-select
              ref="select"
              style="width: 470px"
              v-model="FieldType"
              :value="FieldType"
              @change="handleChangeSelectType"
            >
              <a-select-option value="Sân 5 người">Sân 5 người</a-select-option>
              <a-select-option value="Sân 7 người">Sân 7 người</a-select-option>
              <a-select-option value="Sân 11 người"
                >Sân 11 người</a-select-option
              >
            </a-select>
          </div>
        </div>

        <div class="mt-3 row">
          <div class="col">
            <Upload
              v-model="IMGField"
              @change="handleChangeImage"
              list-type="picture-card"
              :max-count="1"
            >
              <div>
                <div class="ant-upload-text">Upload</div>
              </div>
            </Upload>
          </div>
          <div class="col">
            <label class="form-label">Giá</label>

            <a-input-number
              class="w-100"
              v-model="Price30Minute"
              :value="Price30Minute"
              @change="handlePrice"
            />
          </div>
        </div>
      </form>
    </a-modal>
  </div>
</template>
