<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Service from "../../../Services/API"; // Dịch vụ API để lấy dữ liệu
import { IconEdit, IconPencilMinus } from "@tabler/icons-vue";
import moment from "moment";

import ModalUpdateReview from "./ModalUpdateReview/ModalUpdateReview.vue";

const isShowModalUpdateReviewStatus = ref(false); // Biến quản lý hiển thị modal
const dataModalUpdateReviewStatus = ref({}); // Dữ liệu của đánh giá cần cập nhật

// Mở modal cập nhật trạng thái
const handleEditReviewStatus = async (record) => {
  isShowModalUpdateReviewStatus.value = true;
  dataModalUpdateReviewStatus.value = record; // Lưu dữ liệu đánh giá để truyền vào modal
};

// Đóng modal
const closeModalUpdateReviewStatus = () => {
  isShowModalUpdateReviewStatus.value = false;
};

const createdAt = ref(null); // Biến để lưu ngày đã chọn
const selectedField = ref(null); // Biến lưu sân bóng đã chọn
const fieldsList = ref([]); // Danh sách các sân bóng

const dataReviews = ref([]); // Danh sách đánh giá
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
    title: "Tên khách hàng",
    dataIndex: ["UserID", "UserName"],
    key: "UserName",
  },
  {
    title: "Số điện thoại",
    dataIndex: ["UserID", "PhoneNumber"],
    key: "PhoneNumber",
  },
  {
    title: "Tên sân",
    dataIndex: ["FieldID", "FieldName"],
    key: "FieldName",
  },
  {
    title: "Số sao",
    dataIndex: "Rating",
    customRender: ({ record }) => {
      return renderStars(record.Rating);
    },
  },
  {
    title: "Nội dung đánh giá",
    dataIndex: "Comment",
    key: "Comment",
  },
  {
    title: "Ngày đánh giá",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Trạng thái", // Thêm cột trạng thái
    dataIndex: "Status", // Trường 'Status' chứa trạng thái của review
    key: "Status",
    customRender: ({ record }) => {
      return renderStatus(record.Status); // Hàm để hiển thị trạng thái
    },
  },
];
const renderStatus = (Status) => {
  switch (Status) {
    case "good":
      return "Tốt";
    case "bad":
      return "Xấu";
    default:
      return "Không xác định"; // Xử lý nếu không có trạng thái phù hợp
  }
};

// Hàm gọi API để lấy dữ liệu từ backend
const fetchData = async () => {
  try {
    let reviewDateQuery = "";
    let fieldQuery = "";

    if (createdAt.value) {
      reviewDateQuery = `&createdAt=${createdAt.value}`;
    }

    if (selectedField.value) {
      fieldQuery = `&FieldName=${selectedField.value}`; // Thêm điều kiện lọc theo sân bóng
    }

    console.log("Filter Review By Day and Field", reviewDateQuery, fieldQuery);

    const data = await Service.readPanigationReview(
      `?page=${current.value}&limit=${pageSize.value}&sort=-createdAt${reviewDateQuery}${fieldQuery}`
    );

    if (data && data.data.EC === 0) {
      dataReviews.value = data.data.DT.pagination; // Cập nhật danh sách đánh giá
      total.value = data.data.DT?.meta?.total; // Cập nhật tổng số đánh giá
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
watch([current, pageSize, createdAt, selectedField], fetchData, {
  immediate: true,
});

// Xử lý khi người dùng chọn sân bóng
const handleFieldChange = (event) => {
  selectedField.value = event.target.value; // Gán giá trị sân bóng đã chọn
};

// Xử lý khi người dùng chọn ngày
const handleDateChange = (event) => {
  const selectedDate = event.target.value; // Lấy giá trị từ input
  console.log("Selected date:", selectedDate);

  if (selectedDate && moment(selectedDate).isValid()) {
    createdAt.value = moment(selectedDate).format("YYYY-MM-DD"); // Chuyển thành định dạng YYYY-MM-DD cho API
  } else {
    createdAt.value = null; // Nếu không có ngày, gán giá trị null
  }

  console.log("Formatted createdAt:", typeof createdAt.value);
};
const renderStars = (rating) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? "⭐" : "☆"; // Sử dụng ký hiệu sao đầy và sao rỗng
  });
  return stars.join(""); // Kết hợp lại thành chuỗi
};
// Thêm hàm để xóa bộ lọc ngày
const clearDate = () => {
  createdAt.value = null; // Xóa giá trị của createdAt
  fetchData(); // Gọi lại hàm fetchData để lấy tất cả dữ liệu
};
</script>

<template>
  <div>
    <div>
      <h4>Quản lý đánh giá</h4>
    </div>

    <div class="d-flex justify-content-end align-items-center mb-3">
      <div class="custom-field-select-container">
        <label for="fieldSelect" style="margin-right: 10px; font-weight: bold"
          >Chọn sân:</label
        >
        <select
          id="fieldSelect"
          @change="handleFieldChange"
          class="custom-select"
        >
          <option value="">Tất cả sân</option>
          <option
            v-for="field in fieldsList"
            :key="field._id"
            :value="field.FieldName"
          >
            {{ field.FieldName }}
          </option>
        </select>
      </div>

      <div class="custom-date-input-container" style="margin-left: 20px">
        <label for="createdAt" style="margin-right: 10px; font-weight: bold"
          >Chọn ngày:</label
        >
        <div class="input-wrapper">
          <input
            id="createdAt"
            type="date"
            @change="handleDateChange"
            class="custom-date-input"
          />
        </div>
      </div>
    </div>

    <div>
      <a-table
        :dataSource="dataReviews"
        :columns="columns"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Cột createdAt -->
          <template v-if="column.key === 'createdAt'">
            <div class="text-center centered">
              {{
                record.createdAt &&
                moment(record?.createdAt).format("DD/MM/YYYY")
              }}
            </div>
          </template>

          <!-- Cột Comment -->
          <template v-if="column.key === 'Comment'">
            <div class="text-left">
              {{ record.Comment }}
            </div>
          </template>

          <!-- Cột Rating -->
          <template v-if="column.key === 'Rating'">
            <div class="text-center centered">
              {{ renderStars(record.Rating) }}
            </div>
          </template>

          <!-- Cột UserName -->
          <template v-if="column.key === 'UserName'">
            <div class="text-center centered">
              {{ record.UserID.UserName }}
            </div>
          </template>

          <!-- Cột PhoneNumber -->
          <template v-if="column.key === 'PhoneNumber'">
            <div class="text-center centered">
              {{ record.UserID.PhoneNumber }}
            </div>
          </template>

          <!-- Cột FieldName -->
          <template v-if="column.key === 'FieldName'">
            <div class="text-center centered">
              {{ record.FieldID.FieldName }}
            </div>
          </template>

          <template v-if="column.key === 'Status'">
            <div class="d-flex align-items-center">
              <!-- Trạng thái Tốt -->
              <span v-if="record.Status === 'good'" class="status-active"
                >Tốt</span
              >

              <!-- Trạng thái Xấu -->
              <span v-else-if="record.Status === 'bad'" class="status-bad"
                >Xấu</span
              >
              <!-- Icon chỉnh sửa trạng thái -->
              <IconPencilMinus
                @click="() => handleEditReviewStatus(record)"
                :style="{
                  color: 'blue',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }"
              />
              <ModalUpdateReview
                :isShowModalUpdateReviewStatus="isShowModalUpdateReviewStatus"
                :closeModalUpdateReviewStatus="closeModalUpdateReviewStatus"
                :dataModalUpdateReviewStatus="dataModalUpdateReviewStatus"
                :fetchData="fetchData"
              />
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
.status-active {
  color: green; /* Màu chữ xanh cho trạng thái tốt */
  font-weight: bold;
}

/* Lớp CSS cho trạng thái "Xấu" */
.status-bad {
  color: rgb(0, 0, 0); /* Màu chữ trắng */
  background-color: rgba(255, 0, 0, 0.1); /* Màu nền đỏ nhẹ */
  padding: 3px 6px;
  border-radius: 5px;
  font-weight: bold;
}
</style>
