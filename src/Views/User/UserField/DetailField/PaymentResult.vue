<template>
  <div>
    <SuccessModal v-if="showModalSuccess" @close="showModalSuccess = false" />
    <ErrorModal v-if="showModalError" @close="showModalError = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import qs from "qs";
import Service from "../../../../Services/API";
import SuccessModal from "./ModalPayment/Success.vue";
import ErrorModal from "./ModalPayment/Error.vue";

// Khai báo các biến
const route = useRoute();
const showModalSuccess = ref(false);
const showModalError = ref(false);

// Lấy các biến từ URL sử dụng queryParams
const queryParams = route.query;

// Hàm xử lý dữ liệu sign
const signData = qs.stringify(
  {
    vnp_TmnCode: queryParams.vnp_TmnCode,
    vnp_Amount: queryParams.vnp_Amount,
    vnp_BankCode: queryParams.vnp_BankCode,
    vnp_BankTranNo: queryParams.vnp_BankTranNo,
    vnp_CardType: queryParams.vnp_CardType,
    vnp_OrderInfo: queryParams.vnp_OrderInfo,
    vnp_PayDate: queryParams.vnp_PayDate,
    vnp_ResponseCode: queryParams.vnp_ResponseCode,
    vnp_TransactionNo: queryParams.vnp_TransactionNo,
    vnp_TransactionStatus: queryParams.vnp_TransactionStatus,
    vnp_TxnRef: queryParams.vnp_TxnRef,
    vnp_SecureHash: queryParams.vnp_SecureHash,
  },
  { encode: false }
);

// Hàm xử lý trả về từ VNPAY
const vnpayReturn = async () => {
  const res = await Service.vnpay_return(signData);
  console.log(res);

  if (res && res.data.data.EC === 0) {
    showModalSuccess.value = true;
  } else {
    showModalError.value = true;
  }
};

// Gọi hàm vnpayReturn khi component được mount
onMounted(() => {
  vnpayReturn();
});
</script>

<style scoped>
/* Thêm các kiểu CSS nếu cần */
</style>
