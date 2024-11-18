<script setup>
import { ref, watchEffect } from "vue";
import Service from "../../../../Services/API";
import { toast } from "vue3-toastify";

const props = defineProps({
  closeModalDelete: Function,
  fetchData: Function,
  isShowModalDelete: Boolean,
  dataModalDelete: Object,
});

const _id = ref("");
const FieldName = ref("");

// Goi API thanh cong xóa dữ liệu và đóng đi
const handleClose = () => {
  props.closeModalDelete();
};

watchEffect(() => {
  _id.value = props.dataModalDelete._id;
  FieldName.value = props.dataModalDelete.FieldName;
});

// Xử lí submit FORM
const handleSucces = async () => {
  const res = await Service.deleteField({ id: _id.value });
  if (res && res.data.EC === 0) {
    toast.success(res.data.EM);
    handleClose();
    props.fetchData();
  } else {
    toast.error(res.data.EM);
  }
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalDelete"
      title="Xóa sân"
      @ok="handleSucces"
      okText="Xóa sân"
      @cancel="handleClose"
      :style="{ top: '10px' }"
      okType="danger"
    >
      <div>
        <div>
          Bạn có chắc chắn muốn xóa sân này:
          {{ FieldName || "" }}
        </div>
        <div>Hành động không thể hoàn tác !!!</div>
      </div>
    </a-modal>
  </div>
</template>
