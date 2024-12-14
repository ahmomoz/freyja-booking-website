<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"]
});

const { $swal } = useNuxtApp();
const { $formatPrice } = useNuxtApp();

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// 計算天數
const countDateDiffs = (start, end) => {
  var startDate = new Date(start);
  var endDate = new Date(end);
  return parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24);
};

// 取得遠端資料
const token = useCookie("auth");
const { data: orderList } = await useFetch(`/admin/orders`, {
  baseURL: apiBaseUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => {
    const result = response.result.filter((order) => order.status === 0) || {};
    return result;
  },
  onResponseError({ response }) {
    const { message } = response?._data;
    console.error("Error", message);
    navigateTo("/");
  },
});

// 刪除訂單
const deleteOrder = (id) => {
  $swal
    .fire({
      title: "即將刪除訂單",
      text: `確定要刪除此訂單嗎？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#eb5a68",
      cancelButtonColor: "#8bafd7",
      confirmButtonText: "確定刪除",
      cancelButtonText: "取消",
    })
    .then((result) => {
      if (result.isConfirmed) {
        try {
          $fetch(`/admin/orders/${id}`, {
            baseURL: apiBaseUrl,
            method: "DELETE",
            headers: {
              Authorization: token.value,
            },
          });

          $swal.fire({
            position: "center",
            icon: "success",
            title: "刪除成功",
            showConfirmButton: false,
            timer: 1500,
          });

          window.location.reload();
        } catch (error) {
          const message =
            error.response?._data.message || "發生未知錯誤，請稍後再試";
          $swal.fire({
            position: "center",
            icon: "error",
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
};

// seo
useSeoMeta({
  title: () => `Freyja後台 | 訂單管理`,
  ogTitle: () => `Freyja後台 | 訂單管理`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 訂單管理`,
});
</script>

<template>
  <h1 class="fs-3 mt-3">訂單管理</h1>
  <div class="card my-1 my-lg-4 shadow-sm">
    <div class="card-body">
      <table class="table table-hover">
        <thead class="bg-light">
          <tr class="align-middle">
            <th>訂單編號</th>
            <th>訂購房型</th>
            <th>訂購人</th>
            <th>入住時間</th>
            <th>退房時間</th>
            <th>
              金額
              <span class="bi bi-arrow-down-up ms-1"></span>
            </th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orderList" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.roomId.name }}</td>
            <td>{{ order.userInfo.name }}</td>
            <td><span v-timeFormat="order.checkInDate"></span></td>
            <td><span v-timeFormat="order.checkOutDate"></span></td>
            <td>
              <span
                >NT$
                {{
                  $formatPrice(
                    order.roomId.price *
                      countDateDiffs(order.checkInDate, order.checkOutDate)
                  )
                }}</span
              >
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/admin/orders/edit/${order._id}`"
                >
                  編輯
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteOrder(order._id)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
