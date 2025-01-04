<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"]
});

const router = useRouter();

const { $swal } = useNuxtApp();

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// 房型資料結構
const room = ref({
  name: "",
  description: "",
  imageUrl: "",
  imageUrlList: [],
  areaInfo: "",
  bedInfo: "",
  maxPeople: "",
  price: "",
  layoutInfo: [
    {
      title: "市景",
      isProvide: false,
    },
    {
      title: "獨立衛浴",
      isProvide: false,
    },
    {
      title: "客廳",
      isProvide: false,
    },
    {
      title: "書房",
      isProvide: false,
    },
    {
      title: "樓層電梯",
      isProvide: false,
    },
  ],
  facilityInfo: [
    {
      title: "平面電視",
      isProvide: false,
    },
    {
      title: "吹風機",
      isProvide: false,
    },
    {
      title: "冰箱",
      isProvide: false,
    },
    {
      title: "熱水壺",
      isProvide: false,
    },
    {
      title: "檯燈",
      isProvide: false,
    },
    {
      title: "衣櫥",
      isProvide: false,
    },
    {
      title: "除濕機",
      isProvide: false,
    },
    {
      title: "浴缸",
      isProvide: false,
    },
    {
      title: "書桌",
      isProvide: false,
    },
    {
      title: "音響",
      isProvide: false,
    },
  ],
  amenityInfo: [
    {
      title: "衛生紙",
      isProvide: false,
    },
    {
      title: "拖鞋",
      isProvide: false,
    },
    {
      title: "沐浴用品",
      isProvide: false,
    },
    {
      title: "清潔用品",
      isProvide: false,
    },
    {
      title: "刮鬍刀",
      isProvide: false,
    },
    {
      title: "吊衣架",
      isProvide: false,
    },
    {
      title: "浴巾",
      isProvide: false,
    },
    {
      title: "刷牙用品",
      isProvide: false,
    },
    {
      title: "罐裝水",
      isProvide: false,
    },
    {
      title: "梳子",
      isProvide: false,
    },
  ],
});
// 房型其他圖片中，新增空的輸入框
const addInput = () => {
  room.value.imageUrlList.push("");
};

// 新增房型
const token = useCookie("auth");
const addRoom = async () => {
  try {
    await $fetch("/admin/rooms", {
      baseURL: apiBaseUrl,
      method: "POST",
      headers: {
        Authorization: token.value,
      },
      body: {
        ...room.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "新增成功",
      showConfirmButton: false,
      timer: 1500,
    });

    navigateTo("/admin/rooms");
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
  title: () => `Freyja後台 | 新增房型`,
  ogTitle: () => `Freyja後台 | 新增房型`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 新增房型`,
});
</script>
<template>
  <div class="container">
    <VForm v-slot="{ errors, meta, resetForm }">
      <h1 class="fs-3 mt-3">房型 - 新增</h1>
      <div class="mx-auto">
        <div class="card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">圖片資訊</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="imageUrl" class="form-label">*房型主圖</label>
              <VField
                id="imageUrl"
                name="房型主圖"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型主圖'] }"
                placeholder="請輸入圖片連結"
                rules="required"
                v-model="room.imageUrl"
              />
              <VErrorMessage name="房型主圖" class="invalid-feedback" />
            </div>
            <div class="mb-3">
              <label for="imageUrl" class="form-label"
                >*房型其他圖片(請至少新增4張圖片)</label
              >
              <div
                v-for="(image, index) in room.imageUrlList"
                :key="index"
                class="mb-3"
              >
                <input
                  :id="'imageUrl-' + index"
                  type="text"
                  class="form-control"
                  :placeholder="'請輸入第 ' + (index + 1) + ' 張圖片連結'"
                  v-model="room.imageUrlList[index]"
                />
              </div>
              <button
                type="button"
                class="btn btn-primary d-block mt-3"
                @click="addInput"
              >
                新增圖片
              </button>
            </div>
          </div>
        </div>
        <div class="card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">基本資訊</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="name" class="form-label">*房型名稱</label>
              <VField
                id="name"
                name="房型名稱"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型名稱'] }"
                placeholder="請輸入房型名稱"
                rules="required"
                v-model="room.name"
              />
              <VErrorMessage name="房型名稱" class="invalid-feedback" />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="areaInfo" class="form-label">*坪數</label>
                <VField
                  id="areaInfo"
                  name="坪數"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['坪數'] }"
                  rules="required"
                  placeholder="請輸入房間坪數(ex.24坪)"
                  v-model="room.areaInfo"
                />
                <VErrorMessage name="坪數" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="bedInfo" class="form-label">*床型資訊</label>
                <VField
                  id="bedInfo"
                  name="床型資訊"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['床型資訊'] }"
                  rules="required"
                  placeholder="請輸入床型資訊(ex.一張大床、兩張大床)"
                  v-model="room.bedInfo"
                />
                <VErrorMessage name="床型資訊" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="maxPeople" class="form-label"
                  >*可入住最多人數</label
                >
                <VField
                  id="maxPeople"
                  name="可入住最多人數"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'is-invalid': errors['可入住最多人數'] }"
                  rules="required||greaterThanZero"
                  placeholder="請輸入最多人數"
                  v-model.number="room.maxPeople"
                />
                <VErrorMessage name="可入住最多人數" class="invalid-feedback" />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">*入住價格 / 一晚</label>
                <VField
                  id="price"
                  name="入住價格"
                  type="number"
                  min="0"
                  class="form-control"
                  :class="{ 'is-invalid': errors['入住價格'] }"
                  rules="required||greaterThanZero"
                  placeholder="請輸入入住價格"
                  v-model.number="room.price"
                />
                <VErrorMessage name="入住價格" class="invalid-feedback" />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-4">
                <label for="category" class="form-label">*房間格局</label>
                <div
                  v-for="(item, index) in room.layoutInfo"
                  :key="'layout-' + index"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'layout-' + index"
                    v-model="item.isProvide"
                  />
                  <label class="form-check-label" :for="'layout-' + index">
                    {{ item.title }}
                  </label>
                </div>
              </div>
              <div class="mb-3 col-md-4">
                <label for="price" class="form-label">*房內設備</label>
                <div
                  v-for="(item, index) in room.facilityInfo"
                  :key="'facility-' + index"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'facility-' + index"
                    v-model="item.isProvide"
                  />
                  <label class="form-check-label" :for="'facility-' + index">
                    {{ item.title }}
                  </label>
                </div>
              </div>
              <div class="mb-3 col-md-4">
                <label for="category" class="form-label">*備品提供</label>
                <div
                  v-for="(item, index) in room.amenityInfo"
                  :key="'amenity-' + index"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'amenity-' + index"
                    v-model="item.isProvide"
                  />
                  <label class="form-check-label" :for="'amenity-' + index">
                    {{ item.title }}
                  </label>
                </div>
              </div>
            </div>

            <hr />

            <div class="mb-3">
              <label for="description" class="form-label">*房型描述</label>
              <VField
                id="description"
                name="房型描述"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['房型描述'] }"
                rules="required"
                placeholder="請輸入房型描述"
                rows="16"
                v-model="room.description"
                as="textarea"
              />
              <VErrorMessage name="房型描述" class="invalid-feedback" />
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
          @click="addRoom"
          :disabled="!meta.valid"
        >
          確認新增
        </button>
      </div>
    </VForm>
  </div>
</template>
<style scoped></style>
