<script setup>
import { ref, watchEffect } from "vue";
import Service from "../../../../Services/API";
import { authenticationStore } from "../../../../Stores/Authencation";
import { useToast } from "vue-toastification";
import { Rate } from "ant-design-vue";

const toast = useToast();
const profile = ref({});

// Props nhận từ component cha
const props = defineProps({
  closeModalReview: Function,
  fetchData: Function,
  isShowModalReview: Boolean,
  dataModalReview: Object, // Dữ liệu đơn đặt sân được truyền vào từ component cha
});

// Định nghĩa biến cho các trường dữ liệu
const ReviewData = ref({
  UserID: "",
  FieldID: "",
  Rating: 0,
  Comment: "",
});

// Theo dõi sự thay đổi của dataModalReview và cập nhật các biến
watchEffect(() => {
  const authentication = authenticationStore();
  profile.value = authentication.getUser();

  if (props.dataModalReview && Object.keys(props.dataModalReview).length > 0) {
    // Cập nhật UserID
    ReviewData.value.UserID = profile.value._id;

    // Lấy FieldID từ DetailBooking
    const detailBooking = props.dataModalReview.DetailBook || [];
    if (detailBooking.length > 0) {
      const firstBooking = detailBooking[0]; // Lấy sân đầu tiên trong danh sách
      ReviewData.value.FieldID = firstBooking?.FieldID?._id || ""; // Lấy FieldID
    }
  }
});

// Xử lý khi nhấn OK để gửi đánh giá
const handleOk = async () => {
  try {
    // Kiểm tra tính hợp lệ của đánh giá
    if (ReviewData.value.Rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    // Gọi API và kiểm tra phản hồi
    const res = await Service.createReview({
      UserID: ReviewData.value.UserID,
      FieldID: ReviewData.value.FieldID,
      Rating: ReviewData.value.Rating,
      Comment: ReviewData.value.Comment,
    });

    // In toàn bộ phản hồi ra console để kiểm tra
    console.log("Response from API:", res);

    if (res && res.data && res.data.EC === 0) {
      toast.success("Đánh giá thành công!");
      props.fetchData(); // Gọi lại dữ liệu sau khi đánh giá
      props.closeModalReview(); // Đóng modal
    } else if (res && res.data) {
      // In ra EM để kiểm tra
      console.log("Error Message:", res.data.EM);
      toast.error(res.data.EM); // Thông báo lỗi
    } else {
      // Phản hồi không có data
      toast.error("Có lỗi xảy ra khi gửi đánh giá!");
    }
  } catch (error) {
    toast.error("Bạn đã đánh giá sân này rồi!");
    console.error("Error in handleOk:", error);
  }
};
</script>

<template>
  <a-modal
    :open="props.isShowModalReview"
    title="Đánh giá sân"
    @ok="handleOk"
    @cancel="props.closeModalReview"
    :width="600"
    :inert="props.isShowModalReview ? false : true"
  >
    <form>
      <!-- Rating (Số sao đánh giá) -->
      <div class="mb-3">
        <label class="form-label pe-3">Đánh giá</label>
        <Rate v-model:value="ReviewData.Rating" allow-half />
      </div>

      <!-- Comment (Bình luận) -->
      <div class="mb-3">
        <label class="form-label">Bình luận</label>
        <textarea
          v-model="ReviewData.Comment"
          class="form-control"
          rows="3"
          placeholder="Viết bình luận của bạn tại đây..."
        ></textarea>
      </div>
    </form>
  </a-modal>
</template>
