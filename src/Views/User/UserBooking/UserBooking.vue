<script setup>
import { ref, watch, watchEffect } from "vue";
import Service from "../../../Services/API";
import { authenticationStore } from "../../../Stores/Authencation";
import moment from "moment";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons-vue";
import { toast } from "vue3-toastify";
import ModalReview from "./ModalReview/ModalReview.vue";
import ModalCancelBooking from "./UpdateBooking/ModalCancelBooking.vue";

const type = ref("waiting");
const activeKey = ref("waiting");
const profile = ref({});
const BookingAll = ref([]);
const isShowModalCancel = ref(false);
const dataModalCancel = ref({});
const isShowModalReview = ref(false);
const dataModalReview = ref({});

// Tab
const handleTabChange = (key) => {
  type.value = key;
};

const handleCancel = async (record) => {
  isShowModalCancel.value = true;
  dataModalCancel.value = record;
};

const closeModalCancel = () => {
  isShowModalCancel.value = false;
};

const handleReview = async (record) => {
  isShowModalReview.value = true;
  dataModalReview.value = record; // Truyền dữ liệu review vào modal
};

const closeModalReview = () => {
  isShowModalReview.value = false;
};

// Gọi API
const fetchData = async () => {
  try {
    const data = await Service.read_Booking(
      `UserID=${profile.value._id}&type=${type.value}&sort=-updatedAt`
    );

    if (data && data.data.EC === 0) {
      BookingAll.value = data.data.DT;
    }
  } catch (error) {
    console.log("error", error);
  }
};

watch(
  [type],
  () => {
    fetchData();
  },
  { immediate: true }
);

watchEffect(() => {
  const authentication = authenticationStore();
  profile.value = authentication.getUser();
  fetchData();
});

const columns = ref([
  {
    title: "Đơn đặt sân",
    dataIndex: "DetailBooking",
    key: "Đơn đặt sân",
  },
  {
    title: "Ngày đặt sân",
    dataIndex: "DateBooking",
    key: "DateBooking",
  },
  {
    title: "Trạng Thái",
    dataIndex: "PaymentStatus",
    key: "PaymentStatus",
  },
  {
    title: "Xem Chi Tiết",
    dataIndex: "DetailBook",
    key: "DetailBook",
  },
  {
    title: "Hành động",
    key: "action",
  },
]);

const getStatusText = (PaymentStatus) => {
  if (PaymentStatus === "waiting") {
    return "Chưa xác nhận";
  } else if (PaymentStatus === "success") {
    return "Đã đặt sân";
  } else if (PaymentStatus === "complete") {
    return "Đã nhận sân";
  } else if (PaymentStatus === "cancel") {
    return "Chờ hoàn tiền";
  } else if (PaymentStatus === "canceled") {
    return "Đã hủy";
  }
};
</script>

<template>
  <div class="min-vh-100 p-5">
    <h3 class="text-center">Lịch sử đặt sân</h3>
    <div>
      <a-tabs v-model="activeKey" @change="handleTabChange">
        <a-tab-pane key="waiting" tab="Đơn chưa xác nhận"></a-tab-pane>
        <a-tab-pane key="success" tab="Đơn đã đặt"></a-tab-pane>
        <a-tab-pane key="complete" tab="Đã nhận sân"></a-tab-pane>
        <a-tab-pane key="cancel" tab="Chờ hoàn tiền"></a-tab-pane>
        <a-tab-pane key="canceled" tab="Đã hủy"></a-tab-pane>
      </a-tabs>
    </div>

    <div>
      <a-table :dataSource="BookingAll" :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'Đơn đặt sân'">
            <div class="d-flex">
              <div v-for="item in record?.DetailBook" :key="item._id">
                <img
                  class="pe-1"
                  :src="item?.FieldID?.IMGField"
                  alt="notFound"
                  width="100"
                  height="100"
                />
              </div>
            </div>
          </template>

          <template v-if="column.key === 'DateBooking'">
            <div>
              {{
                record?.DateBooking &&
                moment(record?.DateBooking).format("DD/MM/YYYY")
              }}
            </div>
          </template>

          <template v-if="column.key === 'PaymentStatus'">
            <div>
              {{ getStatusText(record?.PaymentStatus) }}
            </div>
          </template>

          <template v-if="column.key === 'DetailBook'">
            <div>
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
                        <strong>Sân:</strong> {{ item?.FieldID?.FieldName }}
                      </div>
                      <div>
                        <strong>Số tiền đã thanh toán:</strong>
                        {{ item?.TotalPrice }} VND
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

          <template v-if="column.key === 'action'">
            <div class="d-flex" v-if="type === 'success' || type === 'waiting'">
              <div class="pointer">
                <CloseCircleOutlined
                  class="iconCancel"
                  @click="handleCancel(record)"
                  :style="{ color: 'red' }"
                />
                <ModalCancelBooking
                  :isShowModalCancel="isShowModalCancel"
                  :closeModalCancel="closeModalCancel"
                  :dataModalCancel="dataModalCancel"
                  :fetchData="fetchData"
                />
              </div>
            </div>
            <div class="d-flex" v-if="type === 'complete'">
              <div class="d-flex ms-2 me-3">
                <div class="pointer">
                  <EditOutlined
                    @click="handleReview(record)"
                    :style="{ color: 'blue' }"
                  />
                  <ModalReview
                    :isShowModalReview="isShowModalReview"
                    :closeModalReview="closeModalReview"
                    :dataModalReview="dataModalReview"
                    :fetchData="fetchData"
                  />
                </div>
              </div>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style>
.iconCancel {
  font-size: 20px;
}
.pointer {
  cursor: pointer; /* Thêm style cho con trỏ chuột */
}
</style>
