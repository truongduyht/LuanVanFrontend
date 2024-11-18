<script setup>
import { onMounted, ref, watch } from "vue";
import Service from "../../../Services/API";
import moment from "moment";

const listUser = ref([]);
const current = ref(1);
const pageSize = ref(5);
const total = ref(0);

const fetchData = async () => {
  const data = await Service.readPanigation_User(
    `?page=${+current.value}&limit=${+pageSize.value}`
  );
  console.log(data);

  if (data && data.data.EC === 0 && data.data.DT.pagination.length > 0) {
    listUser.value = data.data.DT.pagination.map((user) => ({
      ...user,
      createdAt: moment(user.createdAt).format("DD/MM/YYYY"),
    }));
    total.value = data.data.DT?.meta?.total;
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

const columns = [
  {
    title: "Họ tên",
    dataIndex: "UserName",
    key: "UserName",
  },
  {
    title: "Số điện thoại",
    dataIndex: "PhoneNumber",
    key: "PhoneNumber",
  },
  {
    title: "Ngày tạo tài khoản",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];
</script>

<template>
  <div>
    <div class="d-flex gap-2">
      <p>Quản Lý Người Dùng :</p>
      <p>
        <b class="text-warning">{{ total || 0 }}</b> Người Dùng
      </p>
    </div>
    <div>
      <a-table :dataSource="listUser" :columns="columns" />
    </div>
  </div>
</template>

<style></style>
