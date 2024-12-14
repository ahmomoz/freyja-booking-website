<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"]
});

const route = useRoute();
const router = useRouter();

const { $swal } = useNuxtApp();

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// 取得遠端資料
const { id } = route.params;
const token = useCookie("auth");
const { data: culinaryList } = await useFetch(`/admin/culinary`, {
  baseURL: apiBaseUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => {
    const { result } = response || {};
    const culinaryList = result.filter((culinary) => {
      return culinary._id === id;
    });
    return culinaryList[0];
  },
  onResponseError({ response }) {
    const { message } = response?._data;
    console.error("Error", message);
    navigateTo("/");
  },
});

// 編輯訂單資料結構
const editCulinaryList = computed(() => {
  if (!culinaryList.value) return null;
  return {
    title: culinaryList.value.title,
    description: culinaryList.value.description,
    diningTime: culinaryList.value.diningTime,
    image: culinaryList.value.image,
  };
});

// 編輯佳餚
const editCulinary = async () => {
  try {
    await $fetch(`/admin/culinary/${id}`, {
      baseURL: apiBaseUrl,
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
      body: {
        ...editCulinaryList.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "修改成功",
      showConfirmButton: false,
      timer: 1500,
    });

    navigateTo("/admin/culinary");
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
  title: () => `Freyja後台 | 編輯佳餚`,
  ogTitle: () => `Freyja後台 | 編輯佳餚`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 編輯佳餚`,
});
</script>
<template>
  <div class="container">
    <VForm v-slot="{ errors, meta, resetForm }">
      <h1 class="fs-3 mt-3">美味佳餚 - 編輯</h1>
      <div class="mx-auto">
        <div class="card mt-4 shadow-sm">
          <div class="card-header">
            <h5 class="my-1">基本資訊</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="title" class="form-label">*標題</label>
              <VField
                id="title"
                name="標題"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['標題'] }"
                placeholder="請輸入標題"
                rules="required"
                v-model="editCulinaryList.title"
              />
              <VErrorMessage name="標題" class="invalid-feedback" />
            </div>

            <div class="mb-3">
              <label for="image" class="form-label">*圖片</label>
              <VField
                id="image"
                name="圖片"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['圖片'] }"
                rules="required"
                placeholder="請輸入圖片"
                v-model="editCulinaryList.image"
              />
              <VErrorMessage name="圖片" class="invalid-feedback" />
            </div>

            <div class="mb-3">
              <label for="diningTime" class="form-label">*用餐時間 (請依照格式填寫：ex.SUN-MON 14:00-19:30)</label>
              <VField
                id="diningTime"
                name="用餐時間"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['用餐時間'] }"
                rules="required"
                placeholder="請輸入用餐時間(ex.SUN-MON 14:00-19:30)"
                v-model="editCulinaryList.diningTime"
              />
              <VErrorMessage name="用餐時間" class="invalid-feedback" />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">*描述</label>
              <VField
                id="description"
                name="描述"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['描述'] }"
                rules="required"
                placeholder="請輸入描述"
                as="textarea"
                v-model="editCulinaryList.description"
              />
              <VErrorMessage name="描述" class="invalid-feedback" />
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
          @click="editCulinary"
          :disabled="!meta.valid"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>
<style scoped></style>
