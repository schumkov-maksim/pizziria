<script setup lang="ts">
const { data: page } = await useAsyncData('home', () =>
  queryCollection('content').path('/').first()
)

useSeoMeta({
  title: page.value?.title ?? 'Homepage',
})
</script>

<template>
  <div>
    <div v-if="page" class="max-w-3xl mx-auto px-6 py-12 prose prose-lg">
      <ContentRenderer :value="page" />
    </div>
    <HeroSlider />
    <StatsBar />
    <DealsSection />
    <MenuCatalog />
    <BenefitsSection />
  </div>
</template>
