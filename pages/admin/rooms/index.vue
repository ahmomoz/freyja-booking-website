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

// 取得遠端資料
const token = useCookie("auth");
const { data: roomsList, refresh } = await useFetch(`/admin/rooms`, {
  baseURL: apiBaseUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => {
    const { result } = response || {};
    return result;
  },
  onResponseError({ response }) {
    const { message } = response?._data;
    console.error("Error", message);
    navigateTo("/");
  },
});

// 刪除房型資料
const deleteRoom = (title, id) => {
  $swal
    .fire({
      title: "即將刪除房型",
      text: `確定要刪除「${title}」嗎？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#eb5a68",
      cancelButtonColor: "#8bafd7",
      confirmButtonText: "確定刪除",
      cancelButtonText: "取消",
    })
    .then(async(result) => {
      if (result.isConfirmed) {
        try {
          await $fetch(`/admin/rooms/${id}`, {
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

          refresh();
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
  title: () => `Freyja後台 | 房型管理`,
  ogTitle: () => `Freyja後台 | 房型管理`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 房型管理`,
});
</script>

<template>
  <h1 class="fs-3 mt-3">房型管理</h1>
  <div class="card my-1 my-lg-4 shadow-sm">
    <div class="card-header">
      <div class="text-end py-2">
        <NuxtLink class="btn btn-primary text-light" to="/admin/rooms/new">
          <span class="bi bi-plus"></span>
          建立新的房型
        </NuxtLink>
      </div>
    </div>
    <div class="card-body">
      <table class="table table-hover">
        <thead class="bg-light">
          <tr class="align-middle">
            <th>房型名稱</th>
            <th>坪數</th>
            <th>床型</th>
            <th>
              售價
              <span class="bi bi-arrow-down-up ms-1"></span>
            </th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="room in roomsList" :key="room._id">
            <td>{{ room.name }}</td>
            <td>{{ room.areaInfo }}</td>
            <td>{{ room.bedInfo }}</td>
            <td>NT${{ $formatPrice(room.price) }}</td>
            <td>
              <span class="text-primary" v-if="room.status === 1">上架中</span>
              <span v-else>未上架</span>
            </td>
            <td>
              <div class="btn-group">
                <NuxtLink
                  class="btn btn-outline-primary btn-sm"
                  :to="`/admin/rooms/edit/${room._id}`"
                >
                  編輯
                </NuxtLink>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteRoom(room.name, room._id)"
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
