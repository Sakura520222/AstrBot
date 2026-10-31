<script setup>
import { useData, useRouter, withBase } from "vitepress";

const router = useRouter();
const { lang } = useData();

const goHome = () => {
  router.go(withBase("/"));
};
</script>

<template>
  <div class="NotFound">
    <img
      :src="withBase('/404-seio.png')"
      alt="404 Not Found"
      class="not-found-image"
    />
    <h1 class="not-found-title">
      {{ lang.startsWith("en") ? "Page not found" : "页面不存在" }}
    </h1>
    <p class="not-found-desc">
      {{
        lang.startsWith("en")
          ? "Check the address or return to the documentation."
          : "请检查地址，或返回文档首页。"
      }}
    </p>
    <button @click="goHome" class="not-found-button">
      {{ lang.startsWith("en") ? "Documentation" : "文档首页" }}
    </button>
  </div>
</template>

<style scoped>
.NotFound {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found-image {
  max-width: 400px;
  width: 100%;
  margin-bottom: 2rem;
}

.not-found-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.not-found-desc {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
}

.not-found-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: var(--vp-c-brand-1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.not-found-button:hover {
  background-color: var(--vp-c-brand-2);
}

@media (max-width: 768px) {
  .not-found-image {
    max-width: 300px;
  }

  .not-found-title {
    font-size: 1.25rem;
  }
}
</style>
