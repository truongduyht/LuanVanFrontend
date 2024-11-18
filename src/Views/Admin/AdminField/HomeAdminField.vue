<script setup>
import { IconTrash } from "@tabler/icons-vue";
import { IconEdit } from "@tabler/icons-vue";
import { IconPencilMinus } from "@tabler/icons-vue";

import { onMounted, ref, watch } from "vue";
import { computed } from "vue";

import ModalAddField from "./ModalField/ModalAddField.vue";
import ModalUpdateField from "./ModalField/ModalUpdateField.vue";
import ModalDeleteField from "./ModalField/ModalDeleteField.vue";
import ModalUpdateStatus from "./ModalField/ModalUpdateFieldStatus.vue"; // Import modal cập nhật trạng thái

import Service from "../../../Services/API";

const isShowModalAdd = ref(false);
const isShowModalUpdate = ref(false);
const dataModalUpdate = ref({});
const isShowModalDelete = ref(false);
const dataModalDelete = ref({});
const isShowModalUpdateStatus = ref(false); // Biến quản lý modal cập nhật trạng thái
const dataModalUpdateStatus = ref({}); // Dữ liệu cho modal cập nhật trạng thái

const listField = ref([]);
const current = ref(1);
const pageSize = ref(5);
const total = ref(0);

const pagination = computed(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "15"],
}));

//MODAL UPDATE Field
const handleUpdate = async (record) => {
  isShowModalUpdate.value = true;
  dataModalUpdate.value = record;
};

const closeModalUpdate = () => {
  isShowModalUpdate.value = false;
};

// MODAL DELETE Field
const handleDelete = async (record) => {
  isShowModalDelete.value = true;
  dataModalDelete.value = record;
};
const closeModalDelete = (record) => {
  isShowModalDelete.value = false;
};

// MODAL ADD Field
const handleAddField = async () => {
  isShowModalAdd.value = true;
};
const closeModalAdd = () => {
  isShowModalAdd.value = false;
};

// MODAL UPDATE STATUS
const handleEditStatus = async (record) => {
  isShowModalUpdateStatus.value = true;
  dataModalUpdateStatus.value = record; // Lưu record để truyền vào modal
};

const closeModalUpdateStatus = () => {
  isShowModalUpdateStatus.value = false;
};

const columns = [
  {
    title: "Ảnh",
    dataIndex: "IMGField",
    key: "IMGField",
  },
  {
    title: "Tên Sân",
    dataIndex: "FieldName",
    key: "FieldName",
  },
  {
    title: "Loại Sân",
    dataIndex: "FieldType",
    key: "FieldType",
  },
  {
    title: "Giá (30p)",
    dataIndex: "Price30Minute",
    key: "Price30Minute",
  },
  {
    title: "Trạng Thái",
    key: "Status",
    customRender: ({ record }) => {
      return record.Status === "ok" ? "Hoạt động" : "Bảo trì";
    },
  },
  {
    title: "Thao Tác",
    key: "action",
  },
];

const handleTableChange = (data) => {
  if (data) {
    current.value = data.current;
    pageSize.value = data.pageSize;
    total.value = data.total;
  }
};

// Xử lí Gọi API và phân trang

const fetchData = async () => {
  const data = await Service.readPanigate(
    `?page=${+current.value}&limit=${+pageSize.value}&sort=-createdAt`
  );

  if (data && data.data.EC === 0 && data.data.DT.pagination.length > 0) {
    listField.value = data.data.DT.pagination;
    total.value = data.data.DT?.meta?.total;
    console.log(listField);
  }
};

onMounted(() => {
  fetchData();
});

watch(
  [current, pageSize],
  () => {
    fetchData();
  },
  { immediate: true }
);
</script>

<template>
  <div class="CRUD">
    <div class="d-flex justify-content-between pb-4 my-2">
      <button
        @click="handleAddField"
        class="btn btn-primary border border-primary"
      >
        Thêm Sân
      </button>
    </div>
    <a-table
      :dataSource="listField"
      :columns="columns"
      bordered
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'IMGField'">
          <div>
            <img
              class="border rounded"
              height="100"
              width="100"
              :src="record?.IMGField"
              alt="notFound"
            />
          </div>
        </template>
        <!-- Trạng thái -->
        <template v-if="column.key === 'Status'">
          <div class="d-flex align-items-center">
            <span v-if="record.Status === 'ok'" class="status-active">
              Hoạt động
            </span>
            <span v-else class="status-inactive">Bảo trì</span>
            <!-- Icon chỉnh sửa trạng thái -->
            <IconPencilMinus
              @click="() => handleEditStatus(record)"
              :style="{ color: 'blue', marginLeft: '10px', cursor: 'pointer' }"
            />
          </div>
        </template>
        <!-- Action -->
        <template v-if="column.key === 'action'">
          <div class="d-flex">
            <div class="poiter">
              <IconEdit
                @click="() => handleUpdate(record)"
                :style="{ color: 'blue' }"
              />
            </div>
            <div class="mx-3 poiter">
              <IconTrash
                @click="() => handleDelete(record)"
                :style="{ color: 'red' }"
              />
            </div>
          </div>
        </template>
      </template>
    </a-table>

    <ModalAddField
      :isShowModalAdd="isShowModalAdd"
      :closeModalAdd="closeModalAdd"
      :fetchData="fetchData"
    />

    <ModalUpdateField
      :isShowModalUpdate="isShowModalUpdate"
      :closeModalUpdate="closeModalUpdate"
      :dataModalUpdate="dataModalUpdate"
      :fetchData="fetchData"
    />

    <ModalDeleteField
      :isShowModalDelete="isShowModalDelete"
      :closeModalDelete="closeModalDelete"
      :dataModalDelete="dataModalDelete"
      :fetchData="fetchData"
    />

    <!-- Modal cập nhật trạng thái -->
    <ModalUpdateStatus
      :isShowModalUpdateStatus="isShowModalUpdateStatus"
      :closeModalUpdateStatus="closeModalUpdateStatus"
      :dataModalUpdateStatus="dataModalUpdateStatus"
      :fetchData="fetchData"
    />
  </div>
</template>

<style setup>
.poiter {
  cursor: pointer;
}
.status-active {
  background-color: #d4edda;
  color: #155724;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
}
</style>
