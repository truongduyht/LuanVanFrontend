<!-- PieChart.vue -->
<script setup>
import { defineProps, computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Nhận dữ liệu từ props
const props = defineProps({
  revenueData: {
    type: Array,
    required: true,
  },
});

// Dữ liệu cho Pie Chart
const pieChartData = computed(() => {
  console.log("DataPie", props.revenueData);

  // Kiểm tra dữ liệu có hợp lệ không
  if (props.revenueData && Array.isArray(props.revenueData)) {
    return {
      labels: props.revenueData.map((item) => item.label), // Nhãn từ dữ liệu
      datasets: [
        {
          data: props.revenueData.map((item) => item.value), // Dữ liệu cho biểu đồ
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ], // Màu sắc cho từng phần của pie chart
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  }
  return {}; // Trả về dữ liệu mặc định nếu không có data hợp lệ
});
</script>

<template>
  <!-- Biểu đồ Pie -->
  <div class="chart-container">
    <Pie :data="pieChartData" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 400px;
  margin: 0 auto;
}
</style>
