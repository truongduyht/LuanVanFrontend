<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Service from "../../../Services/API"; // Dịch vụ API để lấy dữ liệu
import moment from "moment";

const selectedDate = ref(moment().format("YYYY-MM-DD")); // Khởi tạo ngày mặc định là hôm nay
const fieldsList = ref([]); // Danh sách các sân bóng
const availableSlots = ref([]); // Danh sách thời gian trống cho sân

const current = ref(1);
const pageSize = ref(5);
const total = ref(0);

// Hàm lấy danh sách sân bóng
const fetchFieldsList = async () => {
  try {
    const fieldsData = await Service.getAllField(); // API để lấy danh sách sân bóng
    if (fieldsData && fieldsData.data.EC === 0) {
      fieldsList.value = fieldsData.data.DT; // Lưu danh sách sân bóng vào biến fieldsList
    }
    console.log("Field", fieldsList.value);
  } catch (error) {
    console.error("Error fetching fields list:", error);
  }
};

// Phân trang
const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "15"],
}));

// Xử lý thay đổi phân trang
const handleTableChange = (data) => {
  if (data) {
    current.value = data.current;
    pageSize.value = data.pageSize;
    total.value = data.total;
  }
};

// Cột của bảng dữ liệu
const columns = [
  {
    title: "Tên sân",
    dataIndex: "FieldName",
    key: "FieldName",
  },

  { title: "Loại sân", dataIndex: "FieldType", key: "FieldType" },
  { title: "Giá", dataIndex: "Price30Minute", key: "Price30Minute" },
  {
    title: "Thời gian trống",
    dataIndex: "AvailableSlots", // Đảm bảo dùng tên đúng
    key: "AvailableSlots",
    customRender: ({ record }) => {
      return record.AvailableSlots && record.AvailableSlots.length
        ? record.AvailableSlots.map(
            (slot) =>
              `<span class="highlighted-time">${slot.StartTime} - ${slot.EndTime}</span>`
          ).join(", ")
        : `<span class="no-time">Không có thời gian trống</span>`;
    },
  },
];

// Hàm gọi API để lấy dữ liệu danh sách sân và thời gian trống theo ngày
const fetchData = async () => {
  try {
    let dateQuery = `&BookingDate=${selectedDate.value}`; // Thêm điều kiện ngày

    console.log("Filter Fields By Day and Field", dateQuery);

    const data = await Service.getFieldsWithAvailableSlots(
      `?page=${current.value}&limit=${pageSize.value}&sort=-createdAt${dateQuery}`
    );

    console.log("DATA", data);

    if (data && data.data.EC === 0) {
      availableSlots.value = data.data.DT; // Cập nhật danh sách thời gian trống
      total.value = data.data.DT?.meta?.total; // Cập nhật tổng số sân
    } else {
      console.error("Failed to fetch data: ", data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Gọi hàm fetchData khi component được mount
onMounted(() => {
  fetchData();
  fetchFieldsList();
});

// Theo dõi sự thay đổi của các biến phân trang để tự động gọi API lại
watch([current, pageSize, selectedDate], fetchData, {
  immediate: true,
});

// Xử lý khi người dùng chọn ngày
const handleDateChange = (event) => {
  const chosenDate = event.target.value; // Lấy giá trị từ input
  console.log("Selected date:", chosenDate);

  if (chosenDate && moment(chosenDate).isValid()) {
    selectedDate.value = moment(chosenDate).format("YYYY-MM-DD"); // Định dạng lại ngày
  } else {
    selectedDate.value = moment().format("YYYY-MM-DD"); // Nếu không có ngày hợp lệ, gán lại ngày hôm nay
  }

  console.log("Formatted selectedDate:", selectedDate.value);
};
</script>

<template>
  <div>
    <div>
      <h4>Danh sách sân và thời gian trống</h4>
    </div>

    <div class="d-flex justify-content-end align-items-center mb-3">
      <div class="custom-date-input-container" style="margin-left: 20px">
        <label for="bookingDate" style="margin-right: 10px; font-weight: bold"
          >Chọn ngày:</label
        >
        <div class="input-wrapper">
          <input
            id="bookingDate"
            type="date"
            @change="handleDateChange"
            class="custom-date-input"
            :value="selectedDate"
          />
        </div>
      </div>
    </div>

    <div>
      <a-table
        :dataSource="availableSlots"
        :columns="columns"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
        class="centered-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- Cột FieldName -->
          <template v-if="column.key === 'FieldName'">
            <div class="text-center centered">
              {{ record.FieldName }}
            </div>
          </template>

          <!-- Cột OpenTime -->
          <template v-if="column.key === 'OpenTime'">
            <div class="text-center centered">
              {{ record.OpenTime }}
            </div>
          </template>

          <!-- Cột CloseTime -->
          <template v-if="column.key === 'CloseTime'">
            <div class="text-center centered">
              {{ record.CloseTime }}
            </div>
          </template>

          <!-- Cột AvailableSlots -->
          <template v-if="column.key === 'AvailableSlots'">
            <div class="text-center centered">
              <template
                v-if="record.AvailableSlots && record.AvailableSlots.length"
              >
                <span
                  v-for="(slot, index) in record.AvailableSlots"
                  :key="index"
                  class="highlighted-time"
                >
                  {{ slot.StartTime }} - {{ slot.EndTime }}
                </span>
              </template>
              <template v-else>
                <span class="no-time">Không có thời gian trống</span>
              </template>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.centered {
  text-align: center; /* Canh giữa nội dung */
}

.centered-table .ant-table-cell {
  text-align: center; /* Canh giữa nội dung cho toàn bộ bảng */
}

input[type="date"],
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.2s;
}

select.custom-select {
  width: 200px;
  margin-right: 10px;
}

input[type="date"]:focus,
select:focus {
  border-color: #007bff;
  outline: none;
}

.custom-field-select-container,
.custom-date-input-container {
  display: flex;
  align-items: center;
}

.custom-date-input-container {
  margin-left: 20px; /* Thêm khoảng cách giữa hai phần tử */
}
/* Định dạng cho các khung giờ trống */
/* Định dạng cho các khung giờ trống */
.highlighted-time {
  color: #007bff; /* Màu chữ */
  background-color: #e6f7ff; /* Màu nền nhạt */
  padding: 5px 10px; /* Khoảng đệm xung quanh */
  border-radius: 8px; /* Bo tròn các góc */
  font-weight: bold; /* Chữ đậm */
  font-size: 16px; /* Kích thước chữ lớn hơn một chút */
  margin: 2px; /* Khoảng cách giữa các khung giờ */
  display: inline-block; /* Đảm bảo khung giờ hiển thị theo dạng khối inline */
}
/* Định dạng khi không có khung giờ trống */
.no-time {
  color: #ff4d4f; /* Màu chữ đỏ */
  background-color: #ffe6e6; /* Màu nền đỏ nhạt */
  padding: 5px 10px; /* Khoảng đệm */
  border-radius: 8px; /* Bo tròn các góc */
  font-style: italic; /* In nghiêng */
  font-size: 14px; /* Kích thước chữ nhỏ hơn */
  margin: 2px; /* Khoảng cách nhỏ giữa các mục */
  display: inline-block; /* Hiển thị dạng khối inline */
}
</style>
