export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const { $swal } = useNuxtApp();

  // 取得環境變數API
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  const errorAlert = () => {
    $swal.fire({
      position: "top-end",
      title: "請先登入",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return;
  }

  const token = useCookie("auth");
  if (!token.value) {
    errorAlert();
    navigateTo("/login");
  }

  try {
    await $fetch("/user/check", {
      baseURL: apiBaseUrl,
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });
  } catch (error) {
    token.value = null;
    return navigateTo("/login");
  }
});
