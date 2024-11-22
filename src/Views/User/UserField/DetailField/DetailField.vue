<script setup>
import moment from "moment-timezone";
import { message, TimePicker, Tag, Rate } from "ant-design-vue";
import { ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authenticationStore } from "../../../../Stores/Authencation";
import Service from "../../../../Services/API";
const router = useRouter();
const route = useRoute();
const IdField = ref(useRoute().params.id);
const authenticaiton = authenticationStore();
const rating = ref(0);
const profile = ref({});
const fieldDetail = ref({});
const BookingDate = ref(route.query?.BookingDate || "");
const StartTime = ref(
  route.query?.StartTime ? moment(route.query.StartTime, "HH:mm") : null
);
const EndTime = ref(
  route.query?.EndTime ? moment(route.query.EndTime, "HH:mm") : null
);
const currentStep = ref(0); // Cập nhật currentStep
const availableTimes = ref([]);
const tempBookingData = ref(null); // Lưu dữ liệu tạm thời cho booking
const loading = ref(false);
watchEffect(() => {
  profile.value = authenticaiton.getUser();
});
console.log("FieldID", IdField);

const fetchData = async () => {
  // Lấy thông tin sân
  const data = await Service.readField({ id: IdField.value });
  if (data && data.data.EC === 0) {
    fieldDetail.value = data.data.DT;
  }

  // Lấy danh sách đánh giá cho sân
  const review = await Service.getReviewsByFieldID({ id: IdField.value });
  if (review && review.data.EC === 0) {
    const reviews = review.data.DT; // Giả sử đây là mảng chứa đánh giá
    fieldDetail.value.reviews = reviews; // Lưu đánh giá vào fieldDetail

    // Tính toán giá trị đánh giá trung bình
    const totalRating = reviews.reduce((sum, r) => sum + r.Rating, 0);
    rating.value = reviews.length > 0 ? totalRating / reviews.length : 0; // Đánh giá trung bình
  }
};

const fetchAvailableTimes = async () => {
  if (BookingDate.value) {
    const data = await Service.getAvailableTimeSlots({
      FieldID: IdField.value,
      BookingDate: BookingDate.value,
    });
    if (data && data.data.EC === 0) {
      availableTimes.value = data.data.DT;
      console.log("Available Times:", availableTimes.value);
    } else {
      availableTimes.value = [];
    }
  }
};

watchEffect(() => {
  fetchData();
  if (BookingDate.value) {
    fetchAvailableTimes();
  }
});

const createDateTimeVN = (date, time) => {
  const dateTime = moment.tz(
    `${date} ${time}`,
    "YYYY-MM-DD h:mm A",
    "Asia/Ho_Chi_Minh"
  );
  return dateTime.toDate();
};

// Go back
const goBack = () => {
  router.go(-1); // Quay lại trang trước
};

// Hàm xử lý bước đầu tiên (đặt sân, lưu tạm dữ liệu)
const handleStepsFirst = async () => {
  const startTimeFormatted = StartTime.value
    ? StartTime.value.format("h:mm A")
    : null;
  const endTimeFormatted = EndTime.value
    ? EndTime.value.format("h:mm A")
    : null;
  if (!startTimeFormatted || !endTimeFormatted) {
    message.error("Vui lòng chọn thời gian bắt đầu và kết thúc!");
    return; // Dừng lại nếu chưa chọn thời gian
  }

  const startDateTime = createDateTimeVN(BookingDate.value, startTimeFormatted);
  const endDateTime = createDateTimeVN(BookingDate.value, endTimeFormatted);
  console.log("Date starttime", startDateTime);
  console.log("Date endtime", endDateTime);

  if (startDateTime >= endDateTime) {
    message.error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
    return; // Dừng lại nếu thời gian không hợp lệ
  }

  tempBookingData.value = {
    FieldID: fieldDetail.value._id,
    UserID: profile.value._id,
    BookingDate: BookingDate.value,
    StartTime: startDateTime,
    EndTime: endDateTime,
  };

  currentStep.value = 1; // Chuyển qua bước thanh toán
};
const minDate = ref(moment().format("YYYY-MM-DD"));
// Hàm quay lại bước 1
const goBackToStep1 = () => {
  currentStep.value = 0; // Đặt currentStep về 0 để quay lại bước 1
};
// Ví dụ định nghĩa biến formattedAmount
const formattedAmount = computed(() => {
  if (EndTime.value && StartTime.value) {
    const minutes = EndTime.value.diff(StartTime.value, "minutes");

    // Chia số phút cho 30 và làm tròn lên thành các khoảng 30 phút
    const intervals = Math.ceil(minutes / 30);

    // Tính toán số tiền dựa trên giá tiền cho mỗi 30 phút
    return ((fieldDetail.value.Price30Minute || 0) * intervals).toLocaleString(
      "vi-VN"
    );
  }
  return 0;
});

// Hàm xử lý thanh toán (step 2)
const handlePayment = async () => {
  try {
    loading.value = true; // Bắt đầu loading
    // Bước 1: Gọi API tạo booking
    const response = await Service.createBooking(tempBookingData.value);

    console.log("response >>>>", response);

    if (response && response.data.EC === 0) {
      // Bước 2: Lấy dữ liệu booking t  ừ response
      const dataBooking = response.data.DT;
      console.log("DataPayment", dataBooking);

      // Gọi API để tạo URL thanh toán VNPAY
      const paymentResponse = await Service.createPaymentUrl(dataBooking);
      console.log("paymentResponse >>>", paymentResponse);
      console.log("paymentResponse >>>", paymentResponse.data.url);

      // Kiểm tra xem URL thanh toán có hợp lệ không
      if (paymentResponse && paymentResponse.data.data?.url) {
        console.log("VNPAY Payment URL:", paymentResponse.data.data?.url); // Kiểm tra URL trong console
        window.location.href = paymentResponse.data.data?.url; // Chuyển hướng đến URL thanh toán
      } else {
        message.error("Lỗi khi tạo liên kết thanh toán, vui lòng thử lại!");
      }
    } else {
      message.error(response.data.EM || "Đặt sân thất bại!");
    }
  } catch (error) {
    message.error("Đã xảy ra lỗi vui lòng thử lại");
    console.error(error); // Log chi tiết lỗi để dễ dàng gỡ lỗi
  } finally {
    loading.value = false; // Kết thúc loading
  }
};
</script>
<template>
  <div class="min-vh-75 border bg-light">
    <div class="row ms-5 me-5 mt-4">
      <a-steps
        :current="currentStep"
        size="small"
        :items="[{ title: 'Đặt sân' }, { title: 'Thanh toán' }]"
      />
    </div>

    <!-- Step 1: Đặt sân -->
    <div class="row mt-3 ms-5 me-5 mb-4" v-if="currentStep === 0">
      <div class="col-lg-12">
        <div class="ps-3 pb-3 mb-4">
          <div class="row">
            <!-- Cột trái: Thông tin sân và đánh giá bằng sao -->
            <div class="col-md-6">
              <h4 class="text-dark">{{ fieldDetail?.FieldName }}</h4>
              <div>
                <strong>Loại Sân: </strong>
                <span class="text-primary">{{ fieldDetail?.FieldType }}</span>
              </div>
              <div class="pt-2 mb-2 bg-light">
                <strong>Giá (30 phút): </strong>
                <span class="text-danger">
                  {{ fieldDetail?.Price30Minute?.toLocaleString("vi-VN") || 0 }}
                  vnd
                </span>
              </div>

              <!-- Đánh giá dạng sao -->
              <div v-if="rating > 0">
                <label class="label pb-1 me-3"
                  ><strong>Đánh giá:</strong></label
                >
                <Rate v-model:value="rating" allow-half disabled />
              </div>
              <div v-else>
                <strong>Chưa có đánh giá nào.</strong>
              </div>
            </div>

            <!-- Cột phải: Danh sách đánh giá -->
            <div class="col-md-6 review-container">
              <div v-if="fieldDetail.reviews && fieldDetail.reviews.length > 0">
                <h5 class="">Đánh giá từ người dùng:</h5>
                <div class="review-list">
                  <!-- Lọc các đánh giá có trạng thái 'good' -->
                  <div
                    v-for="(review, index) in fieldDetail.reviews.filter(
                      (review) => review.Status === 'good'
                    )"
                    :key="index"
                    class="review-item"
                  >
                    <span class="username">{{ review.UserID?.UserName }}:</span>
                    <span class="comment-text">{{ review.Comment }}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                <strong>Chưa có đánh giá nào từ người dùng.</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Form đặt sân -->
        <form class="bg-light p-4 rounded shadow">
          <div class="row">
            <!-- Cột chọn giờ -->
            <div class="col-md-6">
              <div class="my-3">
                <label class="label ps-4 pb-1">Ngày</label>
                <input
                  type="date"
                  class="form-control input-short"
                  v-model="BookingDate"
                  required
                  :min="minDate"
                />
              </div>
              <div class="my-3">
                <label class="label ps-4 pb-1">Từ</label>
                <TimePicker
                  v-model:value="StartTime"
                  format="HH:mm"
                  :minute-step="30"
                  class="form-control input-short"
                  required
                />
              </div>
              <div class="my-3">
                <label class="label ps-4 pb-1">Đến</label>
                <TimePicker
                  v-model:value="EndTime"
                  format="HH:mm"
                  :minute-step="30"
                  class="form-control input-short"
                  required
                />
              </div>
            </div>

            <!-- Cột hiển thị giờ trống -->
            <div class="col-md-6 ps-4 border-start border-2 border-dark">
              <h5 class="text-center label mb-3 pt-2">Khung giờ trống</h5>
              <div v-if="availableTimes.length">
                <div class="d-flex flex-wrap">
                  <Tag
                    v-for="item in availableTimes"
                    :key="item._id"
                    color="green"
                    class="me-2 tag-shadow tag-large mb-2"
                  >
                    {{ item.StartTime }} - {{ item.EndTime }}
                  </Tag>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-3">
            <!-- Nút quay lại không chạy sự kiện submit -->
            <button class="btn btn-secondary me-2" @click="goBack">
              Quay lại
            </button>

            <!-- Nút tiếp tục gọi hàm handleStepsFirst để kiểm tra -->
            <button
              class="btn btn-primary"
              type="button"
              @click="handleStepsFirst"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Step 2: Thanh toán -->
    <div class="row mt-3 ms-5 me-5 mb-4" v-if="currentStep === 1">
      <div class="col-lg-12">
        <div class="text-center">
          <h4 class="text-dark">Thanh toán</h4>
          <p>
            <strong>Tên sân: </strong>
            <span class="text-primary">{{ fieldDetail?.FieldName }}</span>
          </p>
          <p>
            <strong>Loại sân: </strong>
            <span class="text-primary">{{ fieldDetail?.FieldType }}</span>
          </p>
          <p>
            <strong>Ngày nhận sân: </strong>
            <span class="text-primary">{{ BookingDate }}</span>
          </p>
          <p>
            <strong>Thời gian: </strong>
            <span class="text-primary">
              {{ StartTime ? StartTime.format("h:mm A") : "" }} -
              {{ EndTime ? EndTime.format("h:mm A") : "" }}
            </span>
          </p>
          <p>
            <strong>Số tiền cần thanh toán: </strong>
            <span class="text-danger">{{ formattedAmount }} vnd</span>
          </p>
          <button class="btn btn-secondary" @click="goBackToStep1">
            Quay lại
          </button>
          <button class="btn btn-success ms-3" @click="handlePayment">
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: Thành công -->
    <div class="row m-5" style="min-height: 22vh" v-if="currentStep === 2">
      <a-result title="Chúc mừng bạn đã đặt sân thành công">
        <template #icon>
          <IconMoodSmileBeam
            :style="{ height: '100px', width: '100px', color: 'blue' }"
          />
        </template>
      </a-result>
    </div>
  </div>
</template>

<style scoped>
.tag-large {
  font-size: 18px; /* Tăng kích thước chữ */
  padding: 10px 16px; /* Tăng khoảng cách bên trong thẻ */
  border-radius: 10px; /* Bo góc thêm nếu cần */
}

.tag-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Tăng hiệu ứng bóng đổ */
  transition: transform 0.2s; /* Hiệu ứng chuyển động nhẹ */
}
.review-container {
  max-height: 400px; /* Chiều cao tối đa để cuộn */
  overflow-y: auto; /* Cho phép cuộn */
  border-left: 1px solid #ccc; /* Đường viền giữa các cột */
  padding-left: 15px;
}

.review-list {
  list-style-type: none; /* Loại bỏ dấu chấm của danh sách */
  padding-left: 0;
  margin: 0;
}

.review-item {
  display: flex;
  align-items: baseline;
  font-size: 16px;
  background-color: #f7f7f7; /* Nền mặc định cho mỗi bình luận */
  padding: 7px;
  border-radius: 8px; /* Bo góc nền */
  transition: background-color 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng chuyển màu và bóng đổ khi hover */
}

.review-item:hover {
  background-color: #e3f2fd; /* Màu nền khi hover */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng đổ khi hover */
}

.username {
  font-weight: bold;
  margin-right: 5px; /* Khoảng cách giữa tên người dùng và nội dung bình luận */
}

.comment-text {
  word-wrap: break-word; /* Đảm bảo bình luận không tràn ra ngoài */
}
/* Tùy chỉnh thanh cuộn cho Chrome, Edge và Safari */
.review-container::-webkit-scrollbar {
  width: 8px; /* Độ rộng của thanh cuộn */
}

.review-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* Màu nền của track thanh cuộn */
}

.review-container::-webkit-scrollbar-thumb {
  background: #888; /* Màu của thanh cuộn */
  border-radius: 8px; /* Bo tròn thanh cuộn */
}

.review-container::-webkit-scrollbar-thumb:hover {
  background: #555; /* Màu khi hover qua thanh cuộn */
}
</style>
