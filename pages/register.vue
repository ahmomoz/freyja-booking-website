<script setup>
definePageMeta({
  layout: "account",
});

const { $swal } = useNuxtApp();

const userRegisterObject = ref({
  name: "",
  email: "",
  password: "",
  phone: "",
  birthday: "",
  address: {
    zipcode: "",
    detail: "",
  },
});
const isAgree = ref(false);

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

// 註冊資料送出前驗證
const isEmailAndPasswordValid = ref(false);
const checkPassword = ref();
const errorMessage = ref();
const isEmailAndPasswordValidFn = () => {
  if (userRegisterObject.value.password !== checkPassword.value) {
    errorMessage.value = "兩次輸入的密碼不一致";
    return false;
  }

  isEmailAndPasswordValid.value = true;
  errorMessage.value = "";
  return true;
};

// 生日邏輯處理 (年月日合併成 birthday )
const birthDate = reactive({
  year: "",
  month: "",
  day: "",
});
watch(
  () => ({ ...birthDate }),
  ({ year, month, day }) => {
    if (year && month && day) {
      userRegisterObject.value.birthday = `${year}-${String(month).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
    } else {
      userRegisterObject.value.birthday = "";
    }
  },
  { deep: true }
);

// 送出註冊資料請求
const processRegistration = async (requsetBody) => {
  const loader = loadingHandler.show();
  try {
    await $fetch("/user/signup", {
      baseURL: apiBaseUrl,
      method: "POST",
      body: {
        ...requsetBody,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "註冊成功",
      showConfirmButton: false,
      timer: 1500,
    });

    loader.hide();
    navigateTo("/login");
  } catch (error) {
    const message = error.response?._data.message;
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
  title: () => `Freyja | 註冊`,
  ogTitle: () => `Freyja | 註冊`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | 註冊`,
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VForm
        v-slot="{ errors, meta, resetForm }"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            *電子信箱
          </label>
          <VField
            id="email"
            name="電子信箱"
            type="email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['電子信箱'] }"
            placeholder="hello@exsample.com"
            rules="required|email"
            v-model="userRegisterObject.email"
          />
          <VErrorMessage name="電子信箱" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            *密碼
          </label>
          <VField
            id="password"
            name="密碼"
            type="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['密碼'] }"
            placeholder="請輸入密碼 ( 需8碼以上 )"
            rules="required||password"
            v-model="userRegisterObject.password"
          />
          <VErrorMessage name="密碼" class="invalid-feedback" />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
            *確認密碼
          </label>
          <VField
            id="confirmPassword"
            name="確認密碼"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['確認密碼'] }"
            placeholder="請再輸入一次密碼"
            type="password"
            rules="required||password"
            v-model="checkPassword"
          />
          <VErrorMessage name="確認密碼" class="invalid-feedback" />
        </div>
        <div v-if="errorMessage" class="text-danger text-end">
          {{ errorMessage }}
        </div>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="button"
          @click="isEmailAndPasswordValidFn"
          :disabled="!meta.valid"
        >
          下一步
        </button>
      </VForm>
      <VForm
        v-slot="{ errors, meta, resetForm }"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
          <VField
            id="name"
            name="姓名"
            type="text"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required|username"
            v-model="userRegisterObject.name"
          />
          <VErrorMessage name="姓名" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="phone">
            手機號碼
          </label>
          <VField
            id="phone"
            name="手機號碼"
            type="tel"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors['手機號碼'] }"
            placeholder="請輸入手機號碼"
            rules="required|isPhone"
            v-model="userRegisterObject.phone"
          />
          <VErrorMessage name="手機號碼" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
          <div class="d-flex gap-2">
            <select
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthDate.year"
            >
              <option v-for="year in 65" :key="year" :value="year + 1958">
                {{ year + 1958 }} 年
              </option>
            </select>
            <select
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthDate.month"
            >
              <option v-for="month in 12" :key="month" :value="month">
                {{ month }} 月
              </option>
            </select>
            <select
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthDate.day"
            >
              <option v-for="day in 31" :key="day" :value="day">
                {{ day }} 日
              </option>
            </select>
          </div>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="address">
            地址
          </label>
          <div>
            <VField
              id="zipcode"
              name="郵遞區號"
              type="text"
              class="form-control p-4 rounded-3 mb-2"
              :class="{ 'is-invalid': errors['郵遞區號'] }"
              placeholder="請輸入郵遞區號"
              rules="required"
              v-model="userRegisterObject.address.zipcode"
            />
            <VErrorMessage name="郵遞區號" class="invalid-feedback" />
            <VField
              id="address"
              name="地址"
              type="text"
              class="form-control p-4 rounded-3"
              placeholder="請輸入詳細地址"
              :class="{ 'is-invalid': errors['地址'] }"
              rules="required"
              v-model="userRegisterObject.address.detail"
            />
            <VErrorMessage name="地址" class="invalid-feedback" />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            v-model="isAgree"
          />
          <label class="form-check-label fw-bold" for="agreementCheck">
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="button"
          @click="processRegistration(userRegisterObject)"
          :disabled="!meta.valid || !isAgree"
        >
          完成註冊
        </button>
      </VForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="/login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
