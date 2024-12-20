export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();

  // 取得環境變數API
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return;
  }

  const token = useCookie("auth");
  if (!token.value) {
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
