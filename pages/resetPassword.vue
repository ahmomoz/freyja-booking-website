<script setup>
definePageMeta({
  layout: "account",
});

const router = useRouter();
const { $swal } = useNuxtApp();

const userEmail = ref();
const isSendCode = ref(false);
const generateEmailCode = ref();
const newPassword = ref();

// 取得環境變數API
const {
  public: { apiBaseUrl },
} = useRuntimeConfig();

// loading
const { $useLoading } = useNuxtApp();
const loadingHandler = $useLoading({
  backgroundColor: "gray",
  loader: "dots",
  "is-full-page": false,
});

// 傳送信箱驗證碼
const sendEmailCode = async (email) => {
  const loader = loadingHandler.show();
  try {
    await $fetch("/verify/generateEmailCode", {
      baseURL: apiBaseUrl,
      method: "POST",
      body: {
        email: userEmail.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "已傳送驗證碼",
      showConfirmButton: false,
      timer: 1500,
    });

    loader.hide();
    isSendCode.value = true;
  } catch (error) {
    const { message } = error.response?._data;
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
    loader.hide();
  }
};

// 更改密碼
const resetPassword = async () => {
  const loader = loadingHandler.show();
  try {
    await $fetch("/user/forgot", {
      baseURL: apiBaseUrl,
      method: "POST",
      body: {
        email: userEmail.value,
        code: generateEmailCode.value,
        newPassword: newPassword.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "更改密碼成功",
      showConfirmButton: false,
      timer: 1500,
    });

    loader.hide();
    navigateTo("/login");
  } catch (error) {
    const { message } = error.response?._data;
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
    loader.hide();
  }
};

// seo
useSeoMeta({
  title: () => `Freyja | 忘記密碼`,
  ogTitle: () => `Freyja | 忘記密碼`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | 忘記密碼`,
});
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <h1 class="text-neutral-0 fw-bold">忘記密碼</h1>
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        請輸入電子信箱，我們將寄送驗證碼至您的電子信箱
      </p>
    </div>

    <form class="mb-5">
      <div class="mb-4 fs-8 fs-md-7" v-if="!isSendCode">
        <label class="mb-2 text-neutral-0 fw-bold" for="email">
          電子信箱
        </label>
        <input
          id="email"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
          v-model="userEmail"
        />
        <button
          class="btn btn-primary-100 w-100 mt-5 py-4 text-neutral-0 fw-bold"
          type="button"
          @click="sendEmailCode(userEmail)"
          :disabled="userEmail === null"
        >
          傳送驗證碼
        </button>
      </div>
      <div class="mb-4 fs-8 fs-md-7" v-if="isSendCode">
        <label class="mb-2 text-neutral-0 fw-bold" for="generateEmailCode">
          驗證碼
        </label>
        <input
          id="generateEmailCode"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入驗證碼"
          type="password"
          v-model="generateEmailCode"
        />
        <label class="mt-4 text-neutral-0 fw-bold" for="newPassword"
          >新密碼
        </label>
        <input
          id="newPassword"
          class="form-control mt-2 p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入新密碼"
          type="password"
          v-model="newPassword"
        />
        <button
          class="btn btn-primary-100 w-100 mt-5 py-4 text-neutral-0 fw-bold"
          type="button"
          @click="resetPassword"
        >
          更改密碼
        </button>
      </div>
    </form>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="/register"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
      </NuxtLink>
    </p>
  </div>
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

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}
</style>
