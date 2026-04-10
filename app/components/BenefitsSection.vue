<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
    }),
    { threshold: 0.1 }
  )
  sectionRef.value?.querySelectorAll<HTMLElement>('.reveal-up').forEach((el) => io.observe(el))
})

const benefits = [
  {
    num: '01',
    title: 'Bio-Zertifizierte Zutaten',
    text:  'Alle Rohstoffe tragen das EU-Bio-Siegel. Keine Zusatzstoffe, keine Kompromisse.',
  },
  {
    num: '02',
    title: 'Holzofen bei 485 °C',
    text:  'Der echte neapolitanische Holzofen gibt der Pizza den unverwechselbaren Geschmack.',
  },
  {
    num: '03',
    title: '24h Teigruhe',
    text:  'Unser Teig ruht 24 Stunden – für perfekte Luftigkeit und besten Geschmack.',
  },
  {
    num: '04',
    title: 'Lieferung in 30 Minuten',
    text:  'Unser E-Bike-Team bringt Ihre Bestellung heiß und knusprig direkt zu Ihnen.',
  },
]
</script>

<template>
  <section ref="sectionRef" class="benefits section">
    <div class="container benefits__inner">

      <!-- Left: text + list -->
      <div class="benefits__text">
        <span class="section-tag reveal-up">Warum La Bella?</span>
        <h2 class="section-title reveal-up" style="--delay:.1s; text-align:left">
          Qualität,<br>die man schmeckt
        </h2>
        <p class="benefits__intro reveal-up" style="--delay:.2s">
          Wir glauben: Eine gute Pizza braucht keine langen Zutatelisten –
          nur die besten Produkte, echtes Handwerk und ein heißer Holzofen.
        </p>

        <div class="benefits__list">
          <div
            v-for="(b, i) in benefits"
            :key="b.num"
            class="benefit-item reveal-up"
            :style="`--delay:${.3 + i * .1}s`"
          >
            <div class="benefit-item__num">{{ b.num }}</div>
            <div>
              <h4>{{ b.title }}</h4>
              <p>{{ b.text }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: image + badge -->
      <div class="benefits__img-col reveal-up" style="--delay:.2s">
        <img
          class="benefits__img"
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85&fit=crop"
          alt="Pizza aus dem Holzofen"
          loading="lazy"
        />
        <div class="benefits__badge">
          <span class="benefits__badge-num">⭐ 4.9</span>
          <span class="benefits__badge-label">über 2.400 Bewertungen</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$cream:      #fdf8f2;
$white:      #ffffff;
$dark:       #111111;
$muted:      #777777;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section ──────────────────────────────────────────────────
.benefits {
  background: $cream;
  overflow: hidden;
}

.benefits__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

// ── Text side ────────────────────────────────────────────────
.benefits__text {
  max-width: 540px;

  .section-title { margin-bottom: 1.5rem; }
}

.benefits__intro {
  color: $muted;
  margin-bottom: 2rem;
  line-height: 1.7;
}

// ── Benefit items ────────────────────────────────────────────
.benefits__list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.benefit-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  background: $white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .08);
  transition: box-shadow $transition, transform $transition;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, .12);
    transform: translateX(4px);
  }

  &__num {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: $red;
    opacity: .25;
    line-height: 1;
    flex-shrink: 0;
    width: 2rem;
  }

  h4 { font-size: .95rem; font-weight: 700; margin-bottom: .25rem; }
  p  { font-size: .85rem; color: $muted; line-height: 1.6; }
}

// ── Image side ───────────────────────────────────────────────
.benefits__img-col {
  position: relative;

  &:hover .benefits__img { transform: scale(1.02); }
}

.benefits__img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .25);
  transition: transform .4s ease;
}

.benefits__badge {
  position: absolute;
  bottom: -1rem; left: -1.5rem;
  background: $white;
  border-radius: 14px;
  padding: 1rem 1.4rem;
  box-shadow: 0 12px 48px rgba(0, 0, 0, .18);
  display: flex;
  flex-direction: column;
  gap: .2rem;

  &-num   {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700; color: $dark;
  }
  &-label { font-size: .78rem; color: $muted; }
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 1024px) {
  .benefits__inner { grid-template-columns: 1fr; gap: 3rem; }
  .benefits__img   { aspect-ratio: 16/9; }
  .benefits__badge { left: 1rem; }
}
</style>
