<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"]
});

</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col mt-4 text-end">
        <NuxtLink to="/" class="nav-link text-neutral-120 link-hover fs-5">
          <i class="bi bi-arrow-up-left-square me-1"></i>
          跳轉至前台首頁
        </NuxtLink>
      </div>
    </div>
    <div class="row g-4 row-cols-lg-4 mb-4 mt-2">
      <div class="col">
        <div class="card shadow-sm">
          <NuxtLink
            to="/admin/orders"
            class="text-decoration-none text-neutral-120 link-hover"
          >
            <div class="card-body text-center">
              <h3 class="display-7">
                <i class="bi bi-filter-square fs-4 me-2"></i>訂單列表
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="col">
        <div class="card shadow-sm">
          <NuxtLink
            to="/admin/rooms"
            class="text-decoration-none text-neutral-120 link-hover"
          >
            <div class="card-body text-center">
              <h3 class="display-7">
                <i class="bi bi-handbag fs-4 me-2"></i>房型管理
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="col">
        <div class="card shadow-sm">
          <NuxtLink
            to="/admin/news"
            class="text-decoration-none text-neutral-120 link-hover"
          >
            <div class="card-body text-center">
              <h3 class="display-7">
                <i class="bi bi-card-text fs-4 me-2"></i>最新消息管理
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
      <div class="col">
        <div class="card shadow-sm">
          <NuxtLink
            to="/admin/culinary"
            class="text-decoration-none text-neutral-120 link-hover"
          >
            <div class="card-body text-center">
              <h3 class="display-7">
                <i class="bi bi-tags fs-4 me-2"></i>佳餚管理
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-hover {
  transition: 0.3s;
  &:hover {
    transform: translate(5px, 0px);
    transition: 0.3s;
  }
}
</style>
