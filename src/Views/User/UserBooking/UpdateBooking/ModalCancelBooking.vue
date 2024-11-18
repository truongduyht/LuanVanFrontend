<script setup>
import { ref } from "vue";
import Service from "../../../../Services/API";
import { authenticationStore } from "../../../../Stores/Authencation";
import { useToast } from "vue-toastification";

const toast = useToast();
const profile = ref({});

// Props nhận từ component cha
const props = defineProps({
  closeModalCancel: Function,
  fetchData: Function,
  isShowModalCancel: Boolean,
  dataModalCancel: Object, // Dữ liệu được truyền vào từ component cha
});
console.log("idBooking", props.dataModalCancel._id);

// Theo dõi thông tin người dùng
const authentication = authenticationStore();
profile.value = authentication.getUser();

// Xử lý khi nhấn nút hủy
const handleCancel = async () => {
  try {
    // Gọi API hủy đơn đặt sân
    const res = await Service.cancel_Booking({
      BookingID: props.dataModalCancel._id, // BookingID từ props
      UserID: profile.value._id, // UserID từ store
    });

    if (res && res.data && res.data.EC === 0) {
      toast.success(res.data.EM);
      props.fetchData(); // Gọi lại dữ liệu
      props.closeModalCancel(); // Đóng modal
    } else {
      toast.error(res.data.EM);
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra khi hủy đơn đặt sân!");
    console.log("error", error);
  }
};
</script>

<template>
  <a-modal
    :open="props.isShowModalCancel"
    title="Hủy đơn đặt sân"
    @ok="handleCancel"
    @cancel="props.closeModalCancel"
    :width="400"
  >
    <p>Bạn có chắc chắn muốn hủy đơn đặt sân này không?</p>
    <p class="text-danger">*Lưu ý: Việc hủy không thể hoàn tác.</p>
  </a-modal>
</template>
