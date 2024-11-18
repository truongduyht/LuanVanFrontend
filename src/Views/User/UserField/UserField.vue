<script setup>
import { computed, ref, watch } from "vue";
import CardField from "./CardField.vue";
import Service from "../../../Services/API";
import { Pagination, TimePicker } from "ant-design-vue";
import { UndoOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

// State variables
const activeKey = ref("1");
const sort = ref("");
const type = ref("");
const field = ref([]);
const date = ref();
const start = ref();
const end = ref();
const current = ref(1);
const pageSize = ref(8);
const total = ref(0);

const BookingDate = ref("");
const StartTime = ref("");
const EndTime = ref("");

const router = useRouter(); // Sử dụng router để điều hướng

// Pagination handlers
const onChangePagination = (page, pageSize) => {
  current.value = page;
  fetchData();
};

const handlePageSize = (page, newSize) => {
  pageSize.value = newSize;
  current.value = 1;
  fetchData();
};

// Category for filtering
const caterory = ref([
  { id: 1, label: "Sân 5 người", value: "Sân 5 người" },
  { id: 2, label: "Sân 7 người", value: "Sân 7 người" },
  { id: 3, label: "Sân 11 người", value: "Sân 11 người" },
]);

// Handlers for selection and tab changes
const handleSelectType = (data) => {
  type.value = data;
  current.value = 1;
  fetchData();
};

const handleTabChange = (key) => {
  sort.value = key;
  if (key === "createdAt") {
    current.value = 0;
    pageSize.value = 8;
    type.value = "";
    sort.value = "createdAt";
    fetchData();
    location.reload();
  } else {
    current.value = 1;
    fetchData();
  }
};

// Thêm biến minDate để giới hạn ngày chọn
const minDate = ref(new Date().toISOString().split("T")[0]);

// Filter handler
const handleFilter = () => {
  current.value = 1;
  fetchData();
};

// Fetch data from API
const fetchData = async () => {
  const query = `?page=${+current.value}&limit=${+pageSize.value}&type=${
    type.value || ""
  }&sort=${sort.value || "createdAt"}${
    BookingDate.value ? `&BookingDate=${BookingDate.value}` : ""
  }${StartTime.value ? `&StartTime=${StartTime.value}` : ""}${
    EndTime.value ? `&EndTime=${EndTime.value}` : ""
  }`;

  const data = await Service.readPanigate_Field(query);

  if (data && data.data.EC === 0 && data.data.DT.pagination.length > 0) {
    field.value = data.data.DT.pagination;
    date.value = data.data.DT.BookingDate;
    start.value = data.data.DT.StartTime;
    end.value = data.data.DT.EndTime;
    total.value = data.data.DT?.meta?.total;
  }
};

// Watchers for reactive changes
fetchData();
watch([current, pageSize, type, sort], () => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="row min-vh-100 px-3">
      <!-- Sidebar bộ lọc -->
      <div class="col-2 p-0 border-end">
        <div class="filter-header text-center py-3">Bộ lọc</div>

        <!-- Nhóm bộ lọc theo loại -->
        <h5 class="filter-title">Thời gian</h5>
        <div class="filter-container">
          <div class="">
            <div class="filter-item">
              <label class="title">Chọn ngày</label>
              <input
                type="date"
                v-model="BookingDate"
                class="form-control filter-input"
                style="height: 40px; width: 100%"
                :min="minDate"
              />
            </div>

            <div class="filter-item">
              <label class="label title">Từ</label>
              <TimePicker
                v-model:value="StartTime"
                format="HH:mm"
                :minute-step="30"
                class="form-control filter-input border border-secondary-subtle"
                style="height: 40px; width: 100%"
              />
            </div>

            <div class="filter-item">
              <label class="label title">Đến</label>
              <TimePicker
                v-model:value="EndTime"
                format="HH:mm"
                :minute-step="30"
                class="form-control filter-input border border-secondary-subtle"
                style="height: 40px; width: 100%"
              />
            </div>
          </div>

          <!-- Nút Lọc -->
          <div class="filter-item text-center">
            <button
              @click="handleFilter"
              class="btn btn-primary filter-button w-75"
            >
              Lọc sân trống
            </button>
          </div>
        </div>

        <!-- Nhóm bộ lọc loại sân -->
        <div class="filter-body w-100 m-auto">
          <h5 class="filter-title">Chọn loại sân</h5>
          <div v-for="item in caterory" :key="item.id" class="my-4 ms-4">
            <a-checkbox
              @change="() => handleSelectType(item.value)"
              :checked="item.value === type"
            >
              {{ item.label }}
            </a-checkbox>
          </div>
        </div>
      </div>

      <!-- Danh sách sân -->
      <div class="col-10">
        <div class="p-3">
          <a-tabs v-model="activeKey" @change="handleTabChange">
            <a-tab-pane key="createdAt" tab="Tất cả"></a-tab-pane>
            <a-tab-pane
              key="-Price30Minute"
              tab="Giá cao đến thấp"
            ></a-tab-pane>
            <a-tab-pane key="Price30Minute" tab="Giá thấp đến cao"></a-tab-pane>
          </a-tabs>

          <div class="row">
            <div
              class="col-lg-3 col-md-4 col-sm-6 my-3"
              v-for="fiel in field"
              :key="fiel.id"
            >
              <router-link
                class="text-decoration-none"
                :to="{
                  path:
                    fiel.Status === 'maintenance' ? '#' : '/field/' + fiel?._id, // Điều kiện điều hướng
                  query: {
                    BookingDate: BookingDate || '',
                    StartTime: StartTime ? StartTime.format('HH:mm') : '',
                    EndTime: EndTime ? EndTime.format('HH:mm') : '',
                  },
                }"
                @click.prevent="
                  fiel.Status === 'maintenance' ? null : undefined
                "
              >
                <CardField
                  class="m-auto"
                  :Status="fiel.Status"
                  :FieldName="fiel.FieldName"
                  :FieldType="fiel.FieldType"
                  :Price30Minute="fiel.Price30Minute"
                  :url="fiel.IMGField"
                />
              </router-link>
            </div>
          </div>

          <div class="text-center">
            <Pagination
              :current="current"
              :pageSize="pageSize"
              :total="total"
              :show-size-changer="true"
              :pageSizeOptions="['5', '8', '10', '15']"
              @change="onChangePagination"
              @showSizeChange="handlePageSize"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style bộ lọc */
.filter-header {
  background-color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 0;
  color: #333;
}

.filter-container {
  padding-left: 20px;
  padding-right: 20px;
}

.filter-title {
  font-size: 16px;
  height: 40px;
  font-weight: bold;
  background-color: #e2e5e9;
  text-align: center;
  padding-top: 10px;
  border-radius: 5px;
}

.filter-item {
  margin-bottom: 12px;
}

.filter-input,
.ant-picker,
.ant-picker-input > input {
  border-radius: 8px;
  padding: 8px;
  background-color: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%; /* Đảm bảo chiều rộng 100% */
  height: 40px; /* Chiều cao đồng nhất */
  transition: box-shadow 0.3s ease;
}

.filter-input:focus,
.ant-picker-focused {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.filter-button {
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  transition: background-color 0.3s ease;
}

.filter-button:hover {
  background-color: #0056b3;
}
</style>
