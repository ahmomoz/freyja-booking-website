<script setup>
definePageMeta({
  layout: "account",
});

const { $swal } = useNuxtApp();

const userLoginObject = ref({
  email: "",
  password: "",
});
const isRememberEmail = ref();

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

// 送出登入請求
const loginAccount = async (requsetBody) => {
  const loader = loadingHandler.show();
  try {
    const { result, token } = await $fetch("/user/login", {
      baseURL: apiBaseUrl,
      method: "POST",
      body: {
        ...requsetBody,
      },
    });

    if (isRememberEmail !== "") {
      const auth = useCookie("auth", {
        path: "/",
        maxAge: 60 * 60 * 48,
      });
      auth.value = token;

      const userNameCookie = useCookie("username", {
        path: "/",
        maxAge: 60 * 60 * 48,
      });
      userNameCookie.value = result.name;
    }

    $swal.fire({
      position: "center",
      icon: "success",
      title: "登入成功，跳轉至後台",
      showConfirmButton: false,
      timer: 1500,
    });

    loader.hide();
    navigateTo("/admin");
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
  title: () => `Freyja | 後台 - 登入`,
  ogTitle: () => `Freyja | 後台 - 登入`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | 後台 - 登入`,
});
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <h1 class="text-neutral-0 fw-bold">登入後台系統</h1>
    </div>

    <form class="mb-10">
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="email">
          電子信箱
        </label>
        <input
          id="email"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入信箱"
          type="email"
          v-model="userLoginObject.email"
        />
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
        <input
          id="password"
          class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
          placeholder="請輸入密碼"
          type="password"
          v-model="userLoginObject.password"
        />
      </div>
      <div
        class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7"
      >
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input
            id="remember"
            class="form-check-input"
            type="checkbox"
            value=""
            v-model="isRememberEmail"
          />
          <label class="form-check-label fw-bold" for="remember">
            記住帳號
          </label>
        </div>
      </div>
      <button
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="button"
        @click="loginAccount(userLoginObject)"
      >
        登入
      </button>
    </form>
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
