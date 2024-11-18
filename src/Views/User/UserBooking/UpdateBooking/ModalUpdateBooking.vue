<script setup>
import { ref, watchEffect } from "vue";
import { TimePicker } from "ant-design-vue";
import moment from "moment";
import Service from "../../../../Services/API";
import { authenticationStore } from "../../../../Stores/Authencation";
import { useToast } from "vue-toastification";

const toast = useToast();
const profile = ref({});

// Props nhận từ component cha
const props = defineProps({
  closeModalUpdate: Function,
  fetchData: Function,
  isShowModalUpdate: Boolean,
  dataModalUpdate: Object, // Dữ liệu được truyền vào từ component cha
});

// Định nghĩa các biến riêng cho từng trường dữ liệu
const BookingData = ref({
  BookingID: "",
  BookingDate: "",
  StartTime: null,
  EndTime: null,
});

// Theo dõi sự thay đổi của dataModalUpdate và cập nhật các biến
watchEffect(() => {
  const authentication = authenticationStore();
  profile.value = authentication.getUser();

  if (props.dataModalUpdate && Object.keys(props.dataModalUpdate).length > 0) {
    const detailBooking = props.dataModalUpdate.DetailBook || [];

    if (detailBooking.length > 0) {
      const firstBooking = detailBooking[0]; // Chọn sân đầu tiên

      // Cập nhật dữ liệu khi modal mở lần đầu tiên
      BookingData.value.BookingID = props.dataModalUpdate._id || "";
      BookingData.value.BookingDate = firstBooking.BookingDate
        ? moment(firstBooking.BookingDate).format("YYYY-MM-DD")
        : "";
      BookingData.value.StartTime = firstBooking.StartTime
        ? moment(firstBooking.StartTime)
        : null;
      BookingData.value.EndTime = firstBooking.EndTime
        ? moment(firstBooking.EndTime)
        : null;
    }
  }
});

// Hàm tạo đối tượng Date từ BookingDate và thời gian
const createDateTime = (bookingDate, time) => {
  if (!time) return null; // Nếu không có thời gian thì trả về null

  // Lấy giờ và phút từ thời gian
  const hour = time.hour();
  const minute = time.minute();

  // Tạo đối tượng Date mới với ngày từ BookingDate và giờ, phút từ time
  return new Date(
    moment(bookingDate).year(),
    moment(bookingDate).month(),
    moment(bookingDate).date(),
    hour,
    minute
  );
};

// Xử lý khi nhấn OK để cập nhật
const handleOk = async () => {
  try {
    // Chuyển đổi StartTime và EndTime thành đối tượng Date với ngày từ BookingDate
    const startTimeDate = createDateTime(
      BookingData.value.BookingDate,
      BookingData.value.StartTime
    );
    const endTimeDate = createDateTime(
      BookingData.value.BookingDate,
      BookingData.value.EndTime
    );
    console.log("Start", startTimeDate, "End", endTimeDate);

    // Kiểm tra tính hợp lệ của thời gian
    if (startTimeDate && endTimeDate && startTimeDate >= endTimeDate) {
      toast.error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
      return;
    }

    const res = await Service.edit_Booking({
      BookingID: BookingData.value.BookingID,
      UserID: profile.value._id,
      BookingDate: BookingData.value.BookingDate,
      StartTime: startTimeDate,
      EndTime: endTimeDate,
    });

    if (res && res.data && res.data.EC === 0) {
      toast.success(res.data.EM);
      props.fetchData(); // Gọi lại dữ liệu
      props.closeModalUpdate(); // Đóng modal
    } else {
      toast.error(res.data.EM);
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra khi chỉnh sửa đơn đặt sân!");
    console.log("error", error);
  }
};
</script>

<template>
  <a-modal
    :open="props.isShowModalUpdate"
    title="Cập nhật ngày và thời gian đặt sân"
    @ok="handleOk"
    @cancel="props.closeModalUpdate"
    :width="600"
  >
    <form>
      <!-- Ngày đặt sân -->
      <div class="mb-3">
        <label class="form-label">Ngày nhận sân</label>
        <input
          v-model="BookingData.BookingDate"
          type="date"
          class="form-control"
        />
      </div>

      <!-- Thời gian bắt đầu và kết thúc -->
      <div class="mb-3 row">
        <div class="col-6">
          <label class="form-label">Thời gian bắt đầu</label>
          <TimePicker
            v-model:value="BookingData.StartTime"
            format="HH:mm"
            :minute-step="30"
            class="form-control"
          />
        </div>
        <div class="col-6">
          <label class="form-label">Thời gian kết thúc</label>
          <TimePicker
            v-model:value="BookingData.EndTime"
            format="HH:mm"
            :minute-step="30"
            class="form-control"
          />
        </div>
      </div>
    </form>
  </a-modal>
</template>
