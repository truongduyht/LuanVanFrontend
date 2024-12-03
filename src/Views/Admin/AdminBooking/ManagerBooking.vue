<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Service from "../../../Services/API"; // Dịch vụ API để lấy dữ liệu
import { IconEdit } from "@tabler/icons-vue";
import ModalUpdateBooking from "./ModalHandle/ModalHandle.vue";
import moment from "moment";

const type = ref("waiting"); // Loại đơn (trạng thái đơn)
const BookingDate = ref(null); // Biến để lưu ngày đã chọn
const selectedField = ref(null); // Biến lưu sân bóng đã chọn
const fieldsList = ref([]); // Danh sách các sân bóng
const isShowModalUpdate = ref(false);
const dataModalUpdate = ref({});
const dataBooking = ref([]);
const current = ref(1);
const pageSize = ref(5);
const total = ref(0);

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
    dataIndex: ["User", "UserName"],
    key: "UserName",
    render: (text, record) => record?.User?.[0]?.UserName || "N/A",
  },
  {
    title: "Số điện thoại",
    dataIndex: ["User", "PhoneNumber"],
    key: "PhoneNumber",
    render: (text, record) => record?.User?.[0]?.PhoneNumber || "N/A",
  },
  {
    title: "Trạng thái đơn",
    dataIndex: "PaymentStatus",
    key: "PaymentStatus",
  },
  {
    title: "Ngày đặt đơn",
    dataIndex: "DateBooking",
    key: "DateBooking",
    render: (text) => moment(text).format("DD/MM/YYYY"),
  },
  {
    title: "Chi tiết đặt sân",
    dataIndex: "DetailBook",
    key: "DetailBook",
  },
  {
    title: "Thao tác",
    key: "action",
  },
];

// Hàm gọi API để lấy dữ liệu từ backend
const fetchData = async () => {
  try {
    let bookingDateQuery = "";
    let fieldQuery = "";

    if (BookingDate.value) {
      bookingDateQuery = `&BookingDate=${BookingDate.value}`;
    }

    if (selectedField.value) {
      fieldQuery = `&FieldName=${selectedField.value}`; // Thêm điều kiện lọc theo sân bóng
    }

    console.log(
      "Filter Booking By Day and Field",
      bookingDateQuery,
      fieldQuery
    );

    const data = await Service.readPanigation_Booking(
      `?page=${current.value}&limit=${pageSize.value}&type=${type.value}&sort=-createdAt${bookingDateQuery}${fieldQuery}`
    );

    if (data && data.data.EC === 0) {
      dataBooking.value = data.data.DT.pagination;
      total.value = data.data.DT?.meta?.total;
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

// Theo dõi sự thay đổi của các biến phân trang và loại đơn (type) để tự động gọi API lại
watch([current, pageSize, type, BookingDate, selectedField], fetchData, {
  immediate: true,
});

// Xử lý modal cập nhật
const handleUpdate = async (data) => {
  isShowModalUpdate.value = true;
  dataModalUpdate.value = data;
};
const closeModalUpdate = () => {
  isShowModalUpdate.value = false;
};

// Hàm chuyển trạng thái đơn
const getStatusText = (PaymentStatus) => {
  switch (PaymentStatus) {
    case "waiting":
      return "Đơn chờ xác nhận";
    case "success":
      return "Đơn đã đặt";
    case "complete":
      return "Đã nhận sân";
    case "cancel":
      return "Đã hoàn tiền";
    case "canceled":
      return "Đã hủy";
    default:
      return "Trạng thái không xác định";
  }
};

// Xử lý thay đổi loại đơn khi chuyển tab
const activeKey = ref(["1"]);
const handleTabChange = (key) => {
  type.value = key;
};

// Xử lý khi người dùng chọn sân bóng
const handleFieldChange = (event) => {
  selectedField.value = event.target.value; // Gán giá trị sân bóng đã chọn
};

// Xử lý khi người dùng chọn ngày
const handleDateChange = (event) => {
  const selectedDate = event.target.value; // Lấy giá trị từ input
  console.log("Selected date:", selectedDate);

  if (selectedDate && moment(selectedDate).isValid()) {
    BookingDate.value = moment(selectedDate).format("YYYY-MM-DD"); // Chuyển thành định dạng YYYY-MM-DD cho API
  } else {
    BookingDate.value = null; // Nếu không có ngày, gán giá trị null
  }

  console.log("Formatted BookingDate:", typeof BookingDate.value);
};

// Thêm hàm để xóa bộ lọc ngày
const clearDate = () => {
  BookingDate.value = null; // Xóa giá trị của BookingDate
  fetchData(); // Gọi lại hàm fetchData để lấy tất cả dữ liệu
};
</script>

<template>
  <div>
    <div>
      <h4>Quản lý đơn đặt sân</h4>
      <a-tabs v-model="activeKey" @change="handleTabChange">
        <a-tab-pane key="waiting" tab="Đơn chờ xác nhận"> </a-tab-pane>
        <a-tab-pane key="success" tab="Đơn đặt sân"> </a-tab-pane>
        <a-tab-pane key="complete" tab="Đơn đã nhận sân"> </a-tab-pane>
        <a-tab-pane key="cancel" tab="Chờ hoàn tiền"> </a-tab-pane>
        <a-tab-pane key="canceled" tab="Đã hủy"> </a-tab-pane>
      </a-tabs>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 v-if="type == 'waiting'">
        Có <b class="text-danger">{{ total }}</b> đơn chưa xác nhận
      </h5>
      <h5 v-if="type == 'success'">
        Có <b class="text-danger">{{ total }}</b> đơn đã đặt
      </h5>
      <h5 v-if="type == 'complete'">
        Có <b class="text-danger">{{ total }}</b> đơn đã hoàn thành
      </h5>
      <h5 v-if="type == 'cancel'">
        Có <b class="text-danger">{{ total }}</b> đơn chờ hoàn tiền
      </h5>
      <h5 v-if="type == 'canceled'">
        Có <b class="text-danger">{{ total }}</b> đơn đã hủy
      </h5>
      <div class="d-flex justify-content-between align-items-center mb-3">
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

        <div class="custom-date-input-container">
          <label for="bookingDate" style="margin-right: 10px; font-weight: bold"
            >Chọn ngày:</label
          >
          <div class="input-wrapper">
            <input
              id="bookingDate"
              type="date"
              @change="handleDateChange"
              class="custom-date-input"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <a-table
        :dataSource="dataBooking"
        :columns="columns"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
        class="centered-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- Cột action -->
          <template v-if="column.key === 'action'">
            <div class="d-flex justify-content-center">
              <div class="pointer">
                <IconEdit
                  @click="() => handleUpdate(record)"
                  :style="{ color: 'blue' }"
                />
              </div>
            </div>
          </template>

          <!-- Cột DateBooking -->
          <template v-if="column.key === 'DateBooking'">
            <div class="text-center">
              {{
                record.DateBooking &&
                moment(record?.DateBooking).format("DD/MM/YYYY")
              }}
            </div>
          </template>

          <!-- Cột Status -->
          <template v-if="column.key === 'PaymentStatus'">
            <div class="text-center">
              {{ getStatusText(record?.PaymentStatus) }}
            </div>
          </template>

          <!-- Cột DetailBook (không căn giữa) -->
          <!-- Cột DetailBook -->
          <template v-if="column.key === 'DetailBook'">
            <div class="details-column">
              <template
                v-if="
                  record?.PaymentStatus !== 'cancel' &&
                  record?.PaymentStatus !== 'canceled'
                "
              >
                <a-collapse>
                  <a-collapse-panel key="1" header="Chi tiết đặt sân">
                    <div
                      v-for="item in record?.DetailBook"
                      :key="item._id"
                      class="d-flex flex-column"
                    >
                      <div>
                        <strong>Sân:</strong>
                        {{ record.FieldInfo?.FieldName || "Tên sân không có" }}
                        <!-- Truy cập FieldInfo từ record -->
                      </div>
                      <div>
                        <strong>Số tiền đã thanh toán:</strong>
                        {{ item?.TotalPrice || "Tên sân không có" }} VND
                        <!-- Truy cập FieldInfo từ record -->
                      </div>
                      <div>
                        <strong>Ngày nhận sân:</strong>
                        {{
                          item?.BookingDate &&
                          moment(item?.BookingDate).format("DD/MM/YYYY")
                        }}
                      </div>
                      <div>
                        <strong>Thời gian:</strong>
                        {{
                          item?.StartTime &&
                          moment(item?.StartTime).format("HH:mm")
                        }}
                        -
                        {{
                          item?.EndTime && moment(item?.EndTime).format("HH:mm")
                        }}
                      </div>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </template>
              <template v-else>
                <div>Đơn đặt này đã bị hủy.</div>
              </template>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <ModalUpdateBooking
      :isShowModalUpdate="isShowModalUpdate"
      :closeModalUpdate="closeModalUpdate"
      :dataModalUpdate="dataModalUpdate"
      :fetchData="fetchData"
    />
  </div>
</template>

<style scoped>
.centered-table .ant-table-cell {
  text-align: center;
}

.centered-table .details-column {
  text-align: left;
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
</style>
