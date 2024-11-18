<script setup>
import { onMounted, ref, watchEffect } from "vue";
import moment from "moment";
import { toast } from "vue3-toastify";
import Service from "../../../../Services/API";

const props = defineProps({
  closeModalUpdate: Function,
  fetchData: Function,
  isShowModalUpdate: Boolean,
  dataModalUpdate: Object,
});

const _id = ref("");

const PaymentStatus = ref("");
const PhoneNumber = ref("");
const DateBooking = ref(null);
const UserName = ref("");

watchEffect(() => {
  _id.value = props?.dataModalUpdate?._id;
  PaymentStatus.value = props?.dataModalUpdate?.PaymentStatus;
  PhoneNumber.value = props?.dataModalUpdate?.IdUser?.PhoneNumber;
  DateBooking.value = props?.dataModalUpdate?.DateBooking;
  UserName.value = props?.dataModalUpdate?.UserID?.UserName;
});

const validate = () => {
  if (!_id.value) {
    toast.error("Không có đơn đặt sân");
    return false;
  }

  if (!PaymentStatus.value) {
    toast.error("Chưa cập nhật trạng thái đơn đặt!!!");
    return false;
  }

  return true;
};

const handleCancel = () => {
  props.closeModalUpdate();
};

const handleOk = async () => {
  const validateForm = validate();
  if (!validateForm) {
    return;
  }
  const dataUpdate = {
    BookingID: _id.value,
    PaymentStatus: PaymentStatus.value,
  };

  const res = await Service.update_Booking(dataUpdate);
  if (res && res.data.EC === 0) {
    toast.success(res.data.EM);
    props.fetchData();
    handleCancel();
  } else {
    toast.error(res.data.EM);
  }
};

const handleChange = (value) => {
  PaymentStatus.value = value;
  console.log(`selected ${value}`);
};
</script>

<template>
  <div>
    <a-modal
      :open="isShowModalUpdate"
      title="Cập nhật trạng thái đơn hàng"
      @ok="handleOk"
      @cancel="handleCancel"
      :style="{ top: '10px' }"
      :width="700"
    >
      <form>
        <div>
          <div class="my-2">Mã đơn đặt sân: {{ _id }}</div>
          <div class="my-2">Tên người đặt: {{ UserName }}</div>
          <div class="my-2">
            Ngày đặt sân: {{ moment(DateBooking).format("DD/MM/YYYY") }}
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <div>Cập nhật trạng thái</div>
            <a-select
              ref="select"
              :value="PaymentStatus"
              style="width: 220px"
              @change="handleChange"
            >
              <a-select-option value="success">Đã xác nhận</a-select-option>
              <a-select-option value="complete">Đã nhận sân</a-select-option>
              <a-select-option value="cancel">Chờ hoàn tiền</a-select-option>
              <a-select-option value="canceled">Đã hoàn tiền</a-select-option>
            </a-select>
          </div>
        </div>
      </form>
    </a-modal>
  </div>
</template>

<style></style>
