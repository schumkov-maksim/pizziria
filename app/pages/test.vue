<script setup lang="ts">
useSeoMeta({
  title: "Test Page",
  description: "This is a test page for Nuxt 3 and TypeScript.",
});

const { data: page } = await useAsyncData("test-page", () =>
  queryCollection("content").path("/test").first(),
);
</script>

<template>
  <div v-if="page" class="prose max-w-none">
    <ContentRenderer :value="page" />
  </div>
  <div v-else>Inhalt nicht gefunden</div>
</template>
