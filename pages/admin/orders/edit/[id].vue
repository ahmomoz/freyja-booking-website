<script setup>
import dayjs from "dayjs";
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"]
});

const route = useRoute();
const router = useRouter();

const { $swal } = useNuxtApp();

// 日期轉換
const formatDate = (dateStr) => {
  return dayjs(dateStr).format("YYYY/MM/DD");
};

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// 取得遠端資料
const { id } = route.params;
const token = useCookie("auth");
const { data: orderList } = await useFetch(`/admin/orders`, {
  baseURL: apiBaseUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => {
    const { result } = response || {};
    const orderList = result.filter((order) => {
      return order._id === id;
    });
    return orderList[0];
  },
  onResponseError({ response }) {
    const { message } = response?._data;
    console.error("Error", message);
    navigateTo("/");
  },
});

// 編輯訂單資料結構
const editOrderList = computed(() => {
  if (!orderList.value) return null;
  return {
    roomId: orderList.value.roomId._id,
    checkInDate: formatDate(orderList.value.checkInDate),
    checkOutDate: formatDate(orderList.value.checkOutDate),
    peopleNum: orderList.value.peopleNum,
    userInfo: {
      address: {
        ...orderList.value.userInfo.address,
      },
      name: orderList.value.userInfo.name,
      phone: orderList.value.userInfo.phone,
      email: orderList.value.userInfo.email,
    },
  };
});

// 編輯訂單
const editOrder = async (id) => {
  try {
    await $fetch(`/admin/orders/${id}`, {
      baseURL: apiBaseUrl,
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
      body: {
        ...editOrderList.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "修改成功",
      showConfirmButton: false,
      timer: 1500,
    });

    navigateTo("/admin/orders");
  } catch (error) {
    const message = error.response?._data.message || "發生未知錯誤，請稍後再試";
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// 返回前一頁
const goBack = () => {
  router.go(-1);
};

// seo
useSeoMeta({
  title: () => `Freyja後台 | 編輯訂單`,
  ogTitle: () => `Freyja後台 | 編輯訂單`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 編輯訂單`,
});
</script>
<template>
  <div class="container">
    <VForm v-slot="{ errors, meta, resetForm }">
      <h1 class="fs-3 mt-3">訂單編號 - {{ orderList._id }}</h1>
      <div class="mx-auto">
        <div class="card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">訂房資訊</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">房型名稱</label>
              <p class="text-primary">{{ orderList.roomId.name }}</p>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">坪數</label>
                <p class="text-primary">{{ orderList.roomId.areaInfo }}</p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">床型資訊</label>
                <p class="text-primary">{{ orderList.roomId.bedInfo }}</p>
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">入住人數</label>
                <p class="text-primary">{{ orderList.peopleNum }} 人</p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">入住價格 / 一晚</label>
                <p class="text-primary">
                  NT $ {{ $formatPrice(orderList.roomId.price) }}
                </p>
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">入住時間</label>
                <p class="text-primary">
                  <span v-timeFormat="orderList.checkInDate"></span>
                </p>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">退房時間</label>
                <p class="text-primary">
                  <span v-timeFormat="orderList.checkOutDate"></span>
                </p>
              </div>
            </div>
            <NuxtLink
              class="btn btn-primary"
              :to="`/admin/rooms/edit/${orderList.roomId._id}`"
              >前往查看 / 編輯房型詳細</NuxtLink
            >
          </div>
        </div>

        <div class="card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">訂購人資訊</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="username" class="form-label">*訂購人姓名</label>
              <VField
                id="username"
                name="訂購人姓名"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['訂購人姓名'] }"
                placeholder="請輸入訂購人姓名"
                rules="required|username"
                v-model="editOrderList.userInfo.name"
              />
              <VErrorMessage name="訂購人姓名" class="invalid-feedback" />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="userPhone" class="form-label">*訂購人電話</label>
                <VField
                  id="userPhone"
                  name="訂購人電話"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人電話'] }"
                  rules="required|isPhone"
                  placeholder="請輸入訂購人電話"
                  v-model="editOrderList.userInfo.phone"
                />
                <VErrorMessage name="訂購人電話" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="userEmail" class="form-label">*訂購人信箱</label>
                <VField
                  id="userEmail"
                  name="訂購人信箱"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人信箱'] }"
                  rules="required|email"
                  placeholder="請輸入訂購人信箱"
                  v-model="editOrderList.userInfo.email"
                />
                <VErrorMessage name="訂購人信箱" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="userZipCode" class="form-label"
                  >*訂購人郵遞區號</label
                >
                <VField
                  id="userZipCode"
                  name="訂購人郵遞區號"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人郵遞區號'] }"
                  rules="required"
                  placeholder="請輸入訂購人郵遞區號"
                  v-model.number="editOrderList.userInfo.address.zipcode"
                />
                <VErrorMessage name="訂購人郵遞區號" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="userAddressDetail" class="form-label"
                  >*訂購人詳細地址</label
                >
                <VField
                  id="userAddressDetail"
                  name="訂購人詳細地址"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['訂購人詳細地址'] }"
                  rules="required"
                  placeholder="請輸入訂購人詳細地址"
                  v-model="editOrderList.userInfo.address.detail"
                />
                <VErrorMessage name="訂購人詳細地址" class="invalid-feedback" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-end mt-3 mb-5">
        <button
          type="button"
          class="btn btn-outline-secondary mx-2"
          @click="goBack"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary text-light"
          @click="editOrder(orderList._id)"
          :disabled="!meta.valid"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>
<style scoped></style>
