<script setup>
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const route = useRoute();

const { $swal } = useNuxtApp();
const { $formatPrice } = useNuxtApp();

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// store
const bookingStore = useBookingStore();
const { bookingResult } = storeToRefs(bookingStore);

// 取得遠端資料
const { id } = route.params;
const token = useCookie("auth");
const handleFetchError = ({ response }) => {
  const { message } = response?._data || {};
  $swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
  navigateTo("/");
};

const [{ data: roomList }, { data: userData }] = await Promise.all([
  useFetch(`/rooms/${id}`, {
    baseURL: apiBaseUrl,
    transform: (response) => response?.result,
    onResponseError: handleFetchError,
  }),
  useFetch(`/user`, {
    baseURL: apiBaseUrl,
    method: "GET",
    headers: {
      Authorization: token.value,
    },
    transform: (response) => response.result,
    onResponseError: handleFetchError,
  }),
]);

// 訂購人資料
const { roomId, checkInDate, checkOutDate, peopleNum } = bookingResult.value;
const bookingData = ref({
  roomId,
  checkInDate,
  checkOutDate,
  peopleNum,
  userInfo: {
    address: {
      zipcode: "",
      detail: "",
    },
    name: "",
    phone: "",
    email: "",
  },
});

// 一鍵帶入會員資料
const fillMemberData = () => {
  bookingData.value.userInfo = {
    ...userData.value,
    address: {
      ...userData.value.address,
    },
  };
};

// 編輯訂房資訊狀態
const isPeopleEdit = ref(false);
const temPeopleNum = ref(bookingData.value.peopleNum);
const onInput = () => {
  const value = event.target.value;

  // 限制用戶無法輸入數字以外的值
  if (isNaN(value) || value === "") {
    temPeopleNum.value = "";
  } else {
    // 如果輸入的數字超過最大人數，將數字等於最大人數
    if (parseInt(value) > roomList.value.maxPeople) {
      temPeopleNum.value = roomList.value.maxPeople;
    }
  }
};
const changePeopleNum = () => {
  isPeopleEdit.value = !isPeopleEdit.value;
  bookingData.value.peopleNum = temPeopleNum.value;
};

// Loading 邏輯
const nuxtApp = useNuxtApp();
const isLoading = ref(false);
const sendBookingRequest = ref(false);
nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});
nuxtApp.hook("page:finish", () => {
  isLoading.value = false;
});

// 送出訂單
const confirmBooking = async () => {
  try {
    isLoading.value = true;
    sendBookingRequest.value = true;

    const response = await $fetch("/orders", {
      baseURL: apiBaseUrl,
      method: "POST",
      headers: {
        Authorization: token.value,
      },
      body: {
        ...bookingData.value,
      },
    });

    const bookingId = response?.result?._id;

    $swal.fire({
      position: "center",
      icon: "success",
      title: "預訂成功",
      showConfirmButton: false,
      timer: 1500,
    });

    router.push(`/room/bookingResult/${bookingId}`);
  } catch (error) {
    const message = error.response?._data.message;
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  } finally {
    isLoading.value = false;
  }
};

// 返回上一頁
const goBack = () => {
  router.back();
};

// 如果沒有訂房資訊，返回房型頁面
if (!bookingResult.value.roomId) {
  navigateTo("/room");
}

// seo
useSeoMeta({
  title: () => `Freyja | ${roomList.value.name} ｜確認訂房資訊`,
  ogTitle: () => `Freyja | ${roomList.value.name} ｜確認訂房資訊`,
  ogImage: () => `${roomList.value.imageUrl}`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | ${roomList.value.name} ｜確認訂房資訊`,
  twitterImage: () => `${roomList.value.imageUrl}`,
});
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <VForm v-slot="{ errors, meta, resetForm }">
        <div class="container">
          <button
            class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
            type="button"
            @click="goBack"
          >
            <Icon
              class="fs-5 text-neutral-100"
              icon="mdi:keyboard-arrow-left"
            />
            <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
          </button>

          <div class="row gap-10 gap-md-0">
            <div class="col-12 col-md-7">
              <section>
                <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房資訊
                </h2>
                <div class="d-flex flex-column gap-6">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                      <p class="mb-0 fw-medium">尊爵雙人房</p>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                      <p class="mb-2 fw-medium">
                        入住：<span
                          v-timeFormat="bookingResult.checkInDate"
                        ></span>
                      </p>
                      <p class="mb-0 fw-medium">
                        退房：<span
                          v-timeFormat="bookingResult.checkOutDate"
                        ></span>
                      </p>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                      <p class="mb-0 fw-medium" v-if="!isPeopleEdit">
                        {{ temPeopleNum }} 人
                      </p>
                      <div class="d-flex" v-else>
                        <input
                          id="peopleNum"
                          type="number"
                          class="form-control p-4 fs-8 fs-md-7 rounded-3"
                          :min="1"
                          :max="roomList.maxPeople"
                          v-model="temPeopleNum"
                          @input="onInput"
                          @keyup.enter="changePeopleNum"
                        />
                        <button
                          class="bg-transparent border-0 fw-bold text-decoration-underline"
                          type="button"
                          v-if="isPeopleEdit"
                          @click="changePeopleNum"
                        >
                          確定
                        </button>
                      </div>
                    </div>
                    <button
                      class="bg-transparent border-0 fw-bold text-decoration-underline"
                      type="button"
                      v-if="!isPeopleEdit"
                      @click="isPeopleEdit = !isPeopleEdit"
                    >
                      編輯
                    </button>
                  </div>
                </div>
              </section>

              <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

              <section>
                <div
                  class="d-flex justify-content-between align-items-center mb-10"
                >
                  <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                    訂房人資訊
                  </h2>
                  <button
                    class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                    @click="fillMemberData"
                  >
                    套用會員資料
                  </button>
                </div>
                <div class="d-flex flex-column gap-6">
                  <div class="text-neutral-100">
                    <label
                      for="username"
                      class="form-label fs-8 fs-md-7 fw-bold"
                      >姓名</label
                    >
                    <VField
                      id="username"
                      name="姓名"
                      type="text"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['姓名'] }"
                      placeholder="請輸入姓名"
                      rules="required|username"
                      v-model="bookingData.userInfo.name"
                    />
                    <VErrorMessage name="姓名" class="invalid-feedback" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="phone" class="form-label fs-8 fs-md-7 fw-bold"
                      >手機號碼</label
                    >
                    <VField
                      id="phone"
                      name="手機號碼"
                      type="tel"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['手機號碼'] }"
                      placeholder="請輸入手機號碼"
                      rules="required|isPhone"
                      v-model="bookingData.userInfo.phone"
                    />
                    <VErrorMessage name="手機號碼" class="invalid-feedback" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="email" class="form-label fs-8 fs-md-7 fw-bold"
                      >電子信箱</label
                    >
                    <VField
                      id="email"
                      name="電子信箱"
                      type="email"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['電子信箱'] }"
                      placeholder="請輸入電子信箱"
                      rules="required|email"
                      v-model="bookingData.userInfo.email"
                    />
                    <VErrorMessage name="電子信箱" class="invalid-feedback" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="zipcode" class="form-label fs-8 fs-md-7 fw-bold"
                      >郵遞區號</label
                    >
                    <VField
                      id="zipcode"
                      name="郵遞區號"
                      type="text"
                      class="form-control p-4 rounded-3"
                      :class="{ 'is-invalid': errors['郵遞區號'] }"
                      placeholder="請輸入郵遞區號"
                      rules="required"
                      v-model="bookingData.userInfo.address.zipcode"
                    />
                    <VErrorMessage name="郵遞區號" class="invalid-feedback" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="address" class="form-label fs-8 fs-md-7 fw-bold"
                      >地址</label
                    >
                    <VField
                      id="address"
                      name="地址"
                      type="text"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      placeholder="請輸入詳細地址"
                      :class="{ 'is-invalid': errors['地址'] }"
                      rules="required"
                      v-model="bookingData.userInfo.address.detail"
                    />
                    <VErrorMessage name="地址" class="invalid-feedback" />
                  </div>
                </div>
              </section>

              <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

              <section>
                <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  房間資訊
                </h2>
                <div class="d-flex flex-column gap-6">
                  <section>
                    <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                      房型基本資訊
                    </h3>
                    <ul class="d-flex gap-4 list-unstyled">
                      <li
                        class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                      >
                        <Icon
                          class="mb-2 fs-5 text-primary-100"
                          icon="fluent:slide-size-24-filled"
                        />
                        <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                          {{ roomList.areaInfo }}
                        </p>
                      </li>
                      <li
                        class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                      >
                        <Icon
                          class="mb-2 fs-5 text-primary-100"
                          icon="material-symbols:king-bed"
                        />
                        <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                          {{ roomList.bedInfo }}
                        </p>
                      </li>
                      <li
                        class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                      >
                        <Icon
                          class="mb-2 fs-5 text-primary-100"
                          icon="ic:baseline-person"
                        />
                        <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                          2-{{ roomList.maxPeople }} 人
                        </p>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3
                      class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                    >
                      房間格局
                    </h3>
                    <ul
                      class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                    >
                      <li
                        class="d-flex gap-2"
                        v-for="layout in roomList.layoutInfo"
                        :key="layout.title"
                      >
                        <Icon
                          class="fs-5"
                          :class="
                            layout.isProvide
                              ? 'text-primary-100'
                              : 'text-neutral-60'
                          "
                          :icon="
                            layout.isProvide
                              ? 'material-symbols:check'
                              : 'material-symbols:close'
                          "
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ layout.title }}
                        </p>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3
                      class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                    >
                      房內設備
                    </h3>
                    <ul
                      class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                    >
                      <li
                        class="flex-item d-flex gap-2"
                        v-for="facility in roomList.facilityInfo"
                        :key="facility.title"
                      >
                        <Icon
                          class="fs-5"
                          :class="
                            facility.isProvide
                              ? 'text-primary-100'
                              : 'text-neutral-60'
                          "
                          :icon="
                            facility.isProvide
                              ? 'material-symbols:check'
                              : 'material-symbols:close'
                          "
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ facility.title }}
                        </p>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3
                      class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                    >
                      備品提供
                    </h3>
                    <ul
                      class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                    >
                      <li
                        class="flex-item d-flex gap-2"
                        v-for="amenity in roomList.amenityInfo"
                        :key="amenity.title"
                      >
                        <Icon
                          class="fs-5"
                          :class="
                            amenity.isProvide
                              ? 'text-primary-100'
                              : 'text-neutral-60'
                          "
                          :icon="
                            amenity.isProvide
                              ? 'material-symbols:check'
                              : 'material-symbols:close'
                          "
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ amenity.title }}
                        </p>
                      </li>
                    </ul>
                  </section>
                </div>
              </section>
            </div>

            <div class="col-12 col-md-5">
              <div
                class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
              >
                <img
                  class="img-fluid rounded-3"
                  :src="roomList.imageUrl"
                  :alt="roomList.name"
                />

                <div>
                  <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                    價格詳情
                  </h2>
                  <div
                    class="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div
                      class="d-flex align-items-center text-neutral-100 fw-medium"
                    >
                      <span>NT$ {{ $formatPrice(roomList.price) }}</span>
                      <Icon
                        class="ms-2 me-1 text-neutral-80"
                        icon="material-symbols:close"
                      />
                      <span class="text-neutral-80"
                        >{{ bookingResult.bookingDays }} 晚</span
                      >
                    </div>
                    <span class="fw-medium">
                      NT$
                      {{
                        $formatPrice(roomList.price * bookingResult.bookingDays)
                      }}
                    </span>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center fw-medium"
                  >
                    <p class="d-flex align-items-center mb-0 text-neutral-100">
                      住宿折扣
                    </p>
                    <span class="text-primary-100"> -NT$ 1,000 </span>
                  </div>
                  <hr class="my-6 opacity-100 text-neutral-40" />
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                  >
                    <p class="d-flex align-items-center mb-0">總價</p>
                    <span>
                      NT$
                      {{
                        $formatPrice(
                          roomList.price * bookingResult.bookingDays - 1000
                        )
                      }}
                    </span>
                  </div>
                </div>

                <button
                  class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                  type="button"
                  @click="confirmBooking"
                  :disabled="!meta.valid"
                >
                  確認訂房
                </button>
              </div>
            </div>
          </div>
        </div>
      </VForm>
    </section>

    <BookingLoading v-if="isLoading && sendBookingRequest" />
  </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
