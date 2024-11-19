<template>
  <div>
    <Bar :data="barChartData" :options="barChartOptions" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  revenueData: Array,
});

// Tạo dữ liệu cho biểu đồ cột
const barChartData = ref({
  labels: props.revenueData.map((item) => item.label), // Dữ liệu nhãn cho trục X
  datasets: [
    {
      label: "Doanh thu (VNĐ)",
      data: props.revenueData.map((item) => item.value), // Dữ liệu giá trị cho trục Y
      backgroundColor: "#36A2EB", // Màu nền của cột
      borderColor: "#36A2EB", // Màu viền của cột
      borderWidth: 1,
    },
  ],
});

// Tùy chọn cho biểu đồ
const barChartOptions = ref({
  responsive: true,
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
});
</script>

<style scoped>
/* Style cho biểu đồ */
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
