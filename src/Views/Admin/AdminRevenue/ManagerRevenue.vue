<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Service from "../../../Services/API";
import moment from "moment";

import PieChart from "@/Views/Auth/Chart/PieChart.vue";

// Các trạng thái của tab
const tabType = ref("all"); // "all", "day", "month"

// Biến để lưu giá trị ngày và tháng đã chọn
const BookingDate = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);
// Biến lưu doanh thu
const totalRevenueByDate = ref(0);
const totalRevenue = ref(0); // Tổng doanh thu
const revenueByDateAndField = ref(0); // Doanh thu theo ngày
const totalRevenueByMonth = ref(0); // Doanh thu theo tháng
const revenueByMonthAndField = ref(0);
const revenueByField = ref(0); // Tổng doanh thu theo từng sân
const resetData = () => {
  BookingDate.value = null;
  selectedMonth.value = null;
  totalRevenueByDate.value = 0;
  revenueByDateAndField.value = [];
  totalRevenueByMonth.value = 0;
  revenueByMonthAndField.value = [];
};
// Hàm gọi API để lấy tổng doanh thu
const fetchTotalRevenue = async () => {
  try {
    const response = await Service.getTotalRevenue();
    console.log("Response from API:", response); // In phản hồi để kiểm tra // API lấy tổng doanh thu
    if (response && response.data.EC === 0) {
      totalRevenue.value = response.data.DT;
    } else {
      console.error("Failed to fetch total revenue:", response.data.EM);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
  }
};
const fetchRevenueByField = async () => {
  try {
    const response = await Service.getRevenueByField();
    console.log("Response from API:", response); // In phản hồi để kiểm tra // API lấy tổng doanh thu
    if (response && response.data.EC === 0) {
      revenueByField.value = response.data.DT;
    } else {
      console.error("Failed to fetch total revenue:", response.data.EM);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
  }
};
console.log("Data", revenueByField);

// Hàm gọi API để lấy doanh thu theo ngày
const fetchRevenueByDate = async () => {
  try {
    if (BookingDate.value) {
      console.log(BookingDate.value);

      const response = await Service.getRevenueByDate({
        BookingDate: BookingDate.value,
      });
      console.log("FetchRevenueByDate", response);

      if (response && response.data.EC === 0) {
        totalRevenueByDate.value = response.data.DT;
      }
      console.log(revenueByField.value);
    }
  } catch (error) {
    console.error("Error fetching revenue by date:", error);
  }
};
const fetchRevenueByDateAndField = async () => {
  try {
    const response = await Service.getRevenueByDateAndField({
      BookingDate: BookingDate.value,
    });
    console.log("Response from API:", response); // In phản hồi để kiểm tra // API lấy tổng doanh thu
    if (response && response.data.EC === 0) {
      revenueByDateAndField.value = response.data.DT;
      console.log("ByDate", revenueByDateAndField.value);
    } else {
      console.error("Failed to fetch total revenue:", response.data.EM);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
  }
};

// Hàm gọi API để lấy doanh thu theo tháng
const fetchRevenueByMonth = async () => {
  try {
    if (selectedMonth.value) {
      const response = await Service.getTotalRevenueByMonth({
        month: selectedMonth.value,
      });
      if (response && response.data.EC === 0) {
        totalRevenueByMonth.value = response.data.DT;
      }
    }
  } catch (error) {
    console.error("Error fetching revenue by month:", error);
  }
};
const fetchRevenueByMonthAndField = async () => {
  try {
    const response = await Service.getRevenueByMonthAndField({
      month: selectedMonth.value,
    });
    console.log("Response from API:", response); // In phản hồi để kiểm tra // API lấy tổng doanh thu
    if (response && response.data.EC === 0) {
      revenueByMonthAndField.value = response.data.DT;
      console.log("ByDate", revenueByMonthAndField.value);
    } else {
      console.error("Failed to fetch total revenue:", response.data.EM);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
  }
};
// Theo dõi sự thay đổi của BookingDate và selectedMonth
watch(BookingDate, fetchRevenueByDate);
watch(BookingDate, fetchRevenueByDateAndField);
watch([selectedMonth], fetchRevenueByMonth);
watch([selectedMonth], fetchRevenueByMonthAndField);
watch(tabType, resetData);
// Xử lý khi người dùng chọn ngày
const handleDateChange = (event) => {
  const selectedDate = event.target.value; // Lấy giá trị từ input
  console.log("Selected date:", selectedDate);

  if (selectedDate && moment(selectedDate).isValid()) {
    BookingDate.value = moment(selectedDate).format("YYYY-MM-DD"); // Chuyển thành định dạng YYYY-MM-DD cho API
  } else {
    BookingDate.value = null; // Nếu không có ngày, gán giá trị null
  }

  console.log("Formatted BookingDate:", BookingDate.value);
};

// Xử lý khi người dùng chọn tháng
const handleMonthChange = (event) => {
  const month = event.target.value;
  if (month && moment(month, "YYYY-MM").isValid()) {
    selectedMonth.value = moment(month).format("YYYY-MM");
  } else {
    selectedMonth.value = null;
  }
};

// Gọi API khi component được mount
onMounted(() => {
  fetchTotalRevenue();
  fetchRevenueByField();
});
</script>
<template>
  <div class="revenue-management-container">
    <h4 class="section-title">Quản lý doanh thu</h4>

    <!-- Tabs -->
    <a-tabs v-model:activeKey="tabType" class="custom-tabs">
      <a-tab-pane key="all" tab="Tất cả"></a-tab-pane>
      <a-tab-pane key="day" tab="Doanh thu theo ngày"></a-tab-pane>
      <a-tab-pane key="month" tab="Doanh thu theo tháng"></a-tab-pane>
    </a-tabs>

    <!-- Nội dung của các tab -->
    <div v-if="tabType === 'all'" class="tab-content">
      <h5>
        Tổng doanh thu:
        <b class="text-success">{{ totalRevenue.toLocaleString() }} VNĐ</b>
      </h5>
      <!-- Biểu đồ doanh thu theo từng sân -->

      <!-- Bảng doanh thu theo từng sân -->
      <h5 class="section-subtitle">Doanh thu theo từng sân:</h5>
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Sân</th>
              <th>Doanh thu (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in revenueByField" :key="field._id">
              <td>{{ field.fieldInfo[0]?.FieldName || "Không xác định" }}</td>
              <td>{{ field.revenueByField.toLocaleString() }} VNĐ</td>
            </tr>
          </tbody>
        </table>
        <h5 class="section-subtitle">Biểu đồ doanh thu theo từng sân:</h5>
        <div class="chart-container">
          <PieChart :revenueData="revenueByField" />
        </div>
      </div>
    </div>

    <!-- Tab doanh thu theo ngày -->
    <div v-if="tabType === 'day'" class="tab-content">
      <div class="custom-date-input-container mb-3">
        <label for="BookingDate" class="input-label">Chọn ngày:</label>
        <input
          id="BookingDate"
          type="date"
          @change="handleDateChange"
          class="custom-date-input"
        />
      </div>

      <!-- Hiển thị doanh thu theo ngày -->
      <div v-if="BookingDate">
        <h5>
          Tổng doanh thu ngày {{ moment(BookingDate).format("DD/MM/YYYY") }}:
          <b class="text-success"
            >{{ totalRevenueByDate.toLocaleString() }} VNĐ</b
          >
        </h5>
        <h5 class="section-subtitle">Doanh thu theo từng sân:</h5>
        <div class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Sân</th>
                <th>Doanh thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in revenueByDateAndField" :key="field._id">
                <td>{{ field.fieldInfo[0]?.FieldName || "Không xác định" }}</td>
                <td>
                  {{ field.revenueByDateAndField?.toLocaleString() }}
                  VNĐ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="tabType === 'month'" class="tab-content">
      <div class="custom-date-input-container mb-3">
        <label for="selectedMonth" class="input-label">Chọn tháng:</label>
        <input
          id="selectedMonth"
          type="month"
          @change="handleMonthChange"
          class="custom-date-input"
        />
      </div>

      <div v-if="selectedMonth">
        <h5>
          Tổng doanh thu tháng {{ moment(selectedMonth).format("MM/YYYY") }}:
          <b class="text-success"
            >{{ totalRevenueByMonth.toLocaleString() }} VNĐ</b
          >
        </h5>
        <h5 class="section-subtitle">Doanh thu theo từng sân:</h5>
        <div class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Sân</th>
                <th>Doanh thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in revenueByMonthAndField" :key="field._id">
                <td>{{ field.fieldInfo[0]?.FieldName || "Không xác định" }}</td>
                <td>
                  {{ field.revenueByMonthAndField?.toLocaleString() }}
                  VNĐ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 400px;
  margin: 0 auto;
}
/* Container tổng của phần quản lý doanh thu */
.revenue-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề chính */
.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #343a40;
}

/* Tabs tuỳ chỉnh */
.custom-tabs {
  margin-bottom: 20px;
  border-radius: 5px;
}

/* Nội dung của từng tab */
.tab-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề phụ (Ví dụ: Doanh thu theo từng sân) */
.section-subtitle {
  margin-top: 20px;
  font-size: 1.4rem;
  color: #495057;
}

/* Bảng tuỳ chỉnh */
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-size: 16px;
}

.custom-table th,
.custom-table td {
  padding: 15px;
  text-align: left;
  border: 1px solid #dee2e6;
}

.custom-table th {
  background-color: #fafafa; /* Đặt màu nền thành FAFAFA */
  color: #343a40; /* Màu chữ của tiêu đề */
  font-weight: 600;
  border: 1px solid #dee2e6;
}

.custom-table td {
  background-color: #ffffff;
}

/* Nhãn cho input */
.input-label {
  margin-right: 10px;
  font-weight: bold;
  color: #343a40;
}

/* Ô nhập liệu ngày và tháng */
.custom-date-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

input[type="date"],
input[type="month"] {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input[type="date"]:focus,
input[type="month"]:focus {
  border-color: #007bff;
  outline: none;
}

/* Màu sắc văn bản */
.text-success {
  color: #28a745;
}
</style>
