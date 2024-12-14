<script setup></script>

<template>
  <header
    class="navbar navbar-dark sticky-top flex-wrap flex-md-nowrap shadow bg-neutral-120"
  >
    <NuxtLink to="/admin" class="navbar-brand col-md-3 col-lg-2 me-0 px-3"
      >Freyja - 後台</NuxtLink
    >
    <button
      class="navbar-toggler d-md-none me-2 collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
  </header>
  <div class="container">
    <div class="row">
      <nav
        id="sidebarMenu"
        class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <NuxtLink to="/admin" class="nav-link link-hover text-neutral-120 active">
                <i class="bi bi-house fs-4 me-2"></i>
                首頁
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/admin/orders" class="nav-link link-hover text-neutral-120">
                <i class="bi bi-filter-square fs-4 me-2"></i>
                訂單列表
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/admin/rooms" class="nav-link link-hover text-neutral-120">
                <i class="bi bi-handbag fs-4 me-2"></i>
                房型管理
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/admin/news" class="nav-link link-hover text-neutral-120">
                <i class="bi bi-card-text fs-4 me-2"></i>
                最新消息管理
              </NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink to="/admin/culinary" class="nav-link link-hover text-neutral-120">
                <i class="bi bi-tags fs-4 me-2"></i>
                佳餚管理
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
#sidebarMenu {
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  width: 250px;
  z-index: 1000;
  height: 100vh;
}

.link-hover {
  transition: 0.3s;
  &:hover {
    transform: translate(5px, 0px);
    transition: 0.3s;
  }
}
</style>
