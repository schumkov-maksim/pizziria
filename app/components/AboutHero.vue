<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)

const stats = [
  { value: '28', suffix: '+', label: 'Jahre Erfahrung' },
  { value: '27', suffix: '+', label: 'Pizzasorten' },
  { value: '98', suffix: '%', label: 'Zufriedene Kunden' },
  { value: '30', suffix: "'", label: 'Lieferzeit' },
]

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
    }),
    { threshold: 0.12 }
  )
  sectionRef.value?.querySelectorAll<HTMLElement>('.reveal-up').forEach((el) => io.observe(el))
})
</script>

<template>
  <section ref="sectionRef" class="page-hero page-hero--img">
    <img
      class="page-hero__bg"
      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85&fit=crop"
      alt="Restaurant Atmosphäre"
      loading="eager"
    />

    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb reveal-up">
        <NuxtLink to="/">Startseite</NuxtLink>
        <span>/</span>
        <span>Über uns</span>
      </nav>

      <!-- Title -->
      <h1 class="reveal-up">Unsere Geschichte</h1>
      <p class="reveal-up" style="--delay:.15s">
        Leidenschaft, Handwerk und echter Geschmack seit 1998.
      </p>

      <!-- Stats strip -->
      <div class="page-hero__stats reveal-up" style="--delay:.3s">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="hero-stat"
        >
          <strong>{{ stat.value }}<em>{{ stat.suffix }}</em></strong>
          <span>{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$dark:       #111111;
$white:      #ffffff;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Hero section ─────────────────────────────────────────────
.page-hero {
  padding: 10rem 0 5rem;
  background: $dark;
  color: $white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
  }

  // Default red radial overlay
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 60%, rgba(192, 57, 43, .25) 0%, transparent 65%);
    z-index: 1;
  }

  // When background image is present
  &--img::before {
    background:
      linear-gradient(rgba(10, 10, 10, .82) 0%, rgba(10, 10, 10, .6) 100%),
      radial-gradient(ellipse at 30% 60%, rgba(192, 57, 43, .4) 0%, transparent 60%);
  }

  .container {
    position: relative;
    z-index: 2;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: .65rem;
  }

  p {
    opacity: .7;
    font-size: 1.1rem;
  }
}

// ── Breadcrumb ────────────────────────────────────────────────
.breadcrumb {
  display: flex;
  justify-content: center;
  gap: .5rem;
  font-size: .85rem;
  color: rgba(255, 255, 255, .5);
  margin-bottom: 1.25rem;

  a {
    color: $red;
    text-decoration: none;
    transition: opacity $transition;
    &:hover { opacity: .8; }
  }
}

// ── Stats strip ───────────────────────────────────────────────
.page-hero__stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(255, 255, 255, .12);
}

.hero-stat {
  text-align: center;
  padding: 0 3rem;
  border-right: 1px solid rgba(255, 255, 255, .1);

  &:last-child { border-right: none; }

  strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    color: $white;
    line-height: 1;

    em {
      font-style: normal;
      color: $red;
      font-size: 1.6rem;
      vertical-align: super;
    }
  }

  span {
    display: block;
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .13em;
    color: rgba(255, 255, 255, .38);
    margin-top: .5rem;
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 768px) {
  .page-hero__stats {
    gap: 0;
    flex-wrap: wrap;
  }

  .hero-stat {
    padding: .75rem 1.5rem;
    flex: 1 1 calc(50% - 3rem);
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
  }
}
</style>
