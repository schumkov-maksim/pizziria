<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)

const stats = [
  { num: '28', sup: '+', label: 'Jahre Erfahrung' },
  { num: '27', sup: '+', label: 'Pizzasorten' },
  { num: '98', sup: '%', label: 'Zufriedene Kunden' },
  { num: '30', sup: "'", label: 'Lieferzeit' },
]

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
    }),
    { threshold: 0.15 }
  )
  sectionRef.value?.querySelectorAll<HTMLElement>('.reveal-up').forEach((el) => io.observe(el))
})
</script>

<template>
  <section ref="sectionRef" class="about-stats">
    <div class="container">
      <div class="about-stats__grid">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          class="about-stat reveal-up"
          :style="`--delay:${i * .1}s`"
        >
          <div class="about-stat__num">
            {{ s.num }}<sup>{{ s.sup }}</sup>
          </div>
          <div class="about-stat__label">{{ s.label }}</div>
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

// ── Section ──────────────────────────────────────────────────
.about-stats {
  background: $dark;
  padding: 5rem 0;
}

.about-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, .06);
  border-radius: 20px;
  overflow: hidden;
}

// ── Stat cell ─────────────────────────────────────────────────
.about-stat {
  background: $dark;
  padding: 2.75rem 2rem;
  text-align: center;
  transition: background $transition;

  &:hover { background: rgba(192, 57, 43, .07); }

  &__num {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: $white;
    line-height: 1;
    margin-bottom: .35rem;
    letter-spacing: -.02em;

    sup {
      font-size: 1.6rem;
      color: $red;
      vertical-align: super;
    }
  }

  &__label {
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: rgba(255, 255, 255, .38);
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 1024px) {
  .about-stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
