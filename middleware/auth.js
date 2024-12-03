export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  if (
    import.meta.client &&  
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered 
  ) {
    return;
  }

  const token = useCookie("auth");
  if (!token.value) return navigateTo('/login');

  try {
    await $fetch("/user/check", {
      baseURL: "https://freyja-r41s.onrender.com/api/v1",
      method: "GET",
        headers: {
          Authorization: token.value,
        },
    })
  } catch (error) {
    token.value = null;
    return navigateTo('/login');
  }
});