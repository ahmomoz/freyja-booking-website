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
const { data: newsList } = await useFetch(`/admin/news`, {
  baseURL: apiBaseUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => {
    const { result } = response || {};
    const newsList = result.filter((news) => {
      return news._id === id;
    });
    return newsList[0];
  },
  onResponseError({ response }) {
    const { message } = response?._data;
    console.error("Error", message);
    navigateTo("/");
  },
});

// 編輯最新消息資料結構
const editNewsList = computed(() => {
  if (!newsList.value) return null;
  return {
    title: newsList.value.title,
    description: newsList.value.description,
    image: newsList.value.image,
  };
});

// 編輯最新消息
const editNews = async (id) => {
  try {
    await $fetch(`/admin/news/${id}`, {
      baseURL: apiBaseUrl,
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
      body: {
        ...editNewsList.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "修改成功",
      showConfirmButton: false,
      timer: 1500,
    });

    navigateTo("/admin/news");
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
  title: () => `Freyja後台 | 編輯最新消息`,
  ogTitle: () => `Freyja後台 | 編輯最新消息`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja後台 | 編輯最新消息`,
});
</script>
<template>
  <div class="container">
    <VForm v-slot="{ errors, meta, resetForm }">
      <h1 class="fs-3 mt-3">最新消息 - 編輯</h1>
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
                v-model="editNewsList.title"
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
                v-model="editNewsList.image"
              />
              <VErrorMessage name="圖片" class="invalid-feedback" />
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
                v-model="editNewsList.description"
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
          @click="editNews(newsList._id)"
          :disabled="!meta.valid"
        >
          確認修改
        </button>
      </div>
    </VForm>
  </div>
</template>
<style scoped></style>
