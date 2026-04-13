<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)

const values = [
  {
    title: 'Bio-Zutaten',
    text: 'Ausschließlich zertifizierte Bio-Ware. Keine Konservierungsstoffe, kein künstliches Aroma – versprochen.',
    icon: 'leaf',
  },
  {
    title: 'Holzofen-Tradition',
    text: 'Unser Ofen erreicht 485 °C. Die Pizza ist in unter 90 Sekunden fertig – knusprig außen, weich und saftig innen.',
    icon: 'flame',
  },
  {
    title: 'Fairer Handel',
    text: 'Unsere Lieferanten kennen wir persönlich. Faire Preise und nachhaltige Landwirtschaft stehen für uns an erster Stelle.',
    icon: 'handshake',
  },
  {
    title: 'Schnelle Lieferung',
    text: 'Unser Team liefert mit E-Bikes – umweltfreundlich und in max. 30 Minuten direkt zu Ihrer Tür.',
    icon: 'bolt',
  },
]

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
    }),
    { threshold: 0.1 }
  )
  sectionRef.value?.querySelectorAll<HTMLElement>('.reveal-up').forEach((el) => io.observe(el))
})
</script>

<template>
  <section ref="sectionRef" class="values section">
    <div class="container">

      <div class="section-head">
        <span class="section-tag reveal-up">Was uns ausmacht</span>
        <h2 class="section-title reveal-up" style="--delay:.1s">Unsere Werte</h2>
      </div>

      <div class="values__grid">
        <div
          v-for="(v, i) in values"
          :key="v.title"
          class="value-card reveal-up"
          :style="`--delay:${i * .1}s`"
        >
          <div class="value-card__icon">
            <svg v-if="v.icon === 'leaf'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            <svg v-else-if="v.icon === 'flame'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
            <svg v-else-if="v.icon === 'handshake'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m11 17 2 2a1 1 0 1 0 3-3"/>
              <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/>
              <path d="m21 3 1 11h-2"/>
              <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/>
              <path d="M3 4h8"/>
            </svg>
            <svg v-else-if="v.icon === 'bolt'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>

          <h3>{{ v.title }}</h3>
          <p>{{ v.text }}</p>
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

// ── Section — DARK background ─────────────────────────────────
.values {
  padding: 6rem 0;
  background: $dark;

  .section-title { color: $white; }
  .section-sub   { color: rgba(255, 255, 255, .45); }
  .section-tag   { color: $red; }
}

// ── Grid with 1px dividers ────────────────────────────────────
.values__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, .07);
  border-radius: 20px;
  overflow: hidden;
}

// ── Value card ────────────────────────────────────────────────
.value-card {
  background: $dark;
  border-radius: 0;
  padding: 2.75rem 2rem;
  text-align: left;
  box-shadow: none;
  transition: background $transition;
  position: relative;

  &:hover {
    background: rgba(192, 57, 43, .08);
    transform: none;
    box-shadow: none;
  }

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(192, 57, 43, .12);
    border: 1px solid rgba(192, 57, 43, .25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    color: $red;
    transition: background $transition, border-color $transition;
  }

  &:hover .value-card__icon {
    background: rgba(192, 57, 43, .2);
    border-color: rgba(192, 57, 43, .45);
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    margin-bottom: .6rem;
    color: $white;
  }

  p {
    font-size: .875rem;
    color: rgba(255, 255, 255, .5);
    line-height: 1.7;
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 768px) {
  .values__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .values__grid {
    grid-template-columns: 1fr;
  }
}
</style>
