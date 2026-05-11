<script lang="js" setup>
useSeoMeta({
  title: "Homepage",
});
</script>

<template>
  <div>
    <div class="max-w-3xl mx-auto px-6 py-12 prose prose-lg">
      <ContentDoc />
    </div>
    <HeroSlider />
    <StatsBar />
    <DealsSection />
    <MenuCatalog />
    <BenefitsSection />
  </div>
</template>
