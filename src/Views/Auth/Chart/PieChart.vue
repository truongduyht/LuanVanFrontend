<script setup>
import { defineProps } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Đăng ký các thành phần cần thiết của ChartJS
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Nhận dữ liệu từ props
const props = defineProps({
  revenueData: {
    type: Array,
    required: true,
  },
});

// Cấu hình dữ liệu cho biểu đồ
const pieData = {
  labels: props.revenueData.map(
    (item) => item.fieldInfo[0]?.FieldName || "Không xác định"
  ),
  datasets: [
    {
      data: props.revenueData.map((item) => item.revenueByField),
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
      ], // Thêm màu sắc khác nhau cho các phần của biểu đồ
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
</script>

<template>
  <!-- Vẽ biểu đồ với Pie từ vue-chartjs -->
  <Pie :data="pieData" />
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 300px;
  margin: 0 auto;
}
</style>
