<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)

const perks = [
  'Frischer Teig täglich ab 6 Uhr',
  'Lieferung in max. 30 Minuten',
  'Über 27 Pizzasorten zur Wahl',
  '98 % zufriedene Stammkunden',
]

const reviews = [
  {
    initials: 'KM',
    stars: '★★★★★',
    text: '„Beste Pizza der Stadt – wir bestellen jede Woche!"',
    author: '– Klaus M., Stammkunde',
  },
  {
    initials: 'LS',
    stars: '★★★★★',
    text: '„Immer pünktlich, immer frisch. Einfach unschlagbar."',
    author: '– Laura S., Kundin seit 2015',
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
  <section ref="sectionRef" class="cta cta--pro">
    <div class="cta__bg-ring cta__bg-ring--1" aria-hidden="true" />
    <div class="cta__bg-ring cta__bg-ring--2" aria-hidden="true" />
    <div class="cta__emoji-deco" aria-hidden="true">🍕</div>

    <div class="container">
      <div class="cta__inner">

        <!-- Left: text + perks -->
        <div class="cta__content reveal-up">
          <span class="cta__eyebrow">Bereit für echten Geschmack?</span>
          <h2>Überzeugen Sie<br>sich selbst!</h2>
          <p>
            Probieren Sie unsere Pizzen – frisch aus dem Holzofen, mit echten Zutaten aus der
            Campania. Kein Kompromiss, nur Leidenschaft.
          </p>

          <ul class="cta__perks">
            <li v-for="perk in perks" :key="perk" class="cta__perk">
              <span class="cta__perk-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              <span>{{ perk }}</span>
            </li>
          </ul>

          <div class="cta__actions reveal-up" style="--delay:.15s">
            <NuxtLink to="/#menu" class="cta__btn-primary">Speisekarte ansehen →</NuxtLink>
            <NuxtLink to="/kontakt" class="cta__btn-secondary">Tisch reservieren</NuxtLink>
          </div>
        </div>

        <!-- Right: rating card -->
        <div class="cta__card reveal-up" style="--delay:.25s">

          <div class="cta__rating-header">
            <div class="cta__rating-score">4.9</div>
            <div>
              <div class="cta__stars" aria-label="4.9 von 5 Sternen">
                <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="cta__rating-count">Basierend auf 1.998 Bewertungen</span>
            </div>
          </div>

          <div class="cta__reviews">
            <div v-for="r in reviews" :key="r.author" class="cta__review">
              <div class="cta__review-avatar">{{ r.initials }}</div>
              <div>
                <div class="cta__review-stars">{{ r.stars }}</div>
                <p class="cta__review-text">{{ r.text }}</p>
                <span class="cta__review-author">{{ r.author }}</span>
              </div>
            </div>
          </div>

          <div class="cta__badge-row">
            <div class="cta__badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Qualitätsgarantie
            </div>
            <div class="cta__badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              30-Min-Lieferung
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$white:      #ffffff;
$gold:       #fbbf24;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section — RED gradient background ────────────────────────
.cta--pro {
  background: linear-gradient(135deg, #5a0000 0%, #8b1c0e 30%, #c0392b 65%, #c0550a 100%);
  padding: 6rem 0;
  color: $white;
  position: relative;
  overflow: hidden;
}

// ── Decorative rings ──────────────────────────────────────────
.cta__bg-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, .06);
  pointer-events: none;

  &--1 {
    width: 520px;
    height: 520px;
    top: -200px;
    right: -80px;
  }

  &--2 {
    width: 320px;
    height: 320px;
    bottom: -120px;
    left: -60px;
    border-color: rgba(255, 255, 255, .04);
  }
}

.cta__emoji-deco {
  position: absolute;
  font-size: 22rem;
  opacity: .04;
  top: 50%;
  right: 4%;
  transform: translateY(-50%) rotate(-18deg);
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

// ── Two-column layout ─────────────────────────────────────────
.cta__inner {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 5rem;
  align-items: center;
}

// ── Left content ──────────────────────────────────────────────
.cta__eyebrow {
  display: inline-block;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, .6);
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 20px;
  padding: .28rem .85rem;
  margin-bottom: 1.25rem;
}

.cta--pro h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1rem;
  color: $white;
}

.cta--pro p {
  font-size: 1.05rem;
  opacity: .85;
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 480px;
}

// ── Perks ─────────────────────────────────────────────────────
.cta__perks {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .65rem;
}

.cta__perk {
  display: flex;
  align-items: center;
  gap: .6rem;
  font-size: .88rem;
  opacity: .9;
}

.cta__perk-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { color: #fde68a; }
}

// ── Buttons ───────────────────────────────────────────────────
.cta__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.cta__btn-primary {
  background: rgba(255, 255, 255, .12);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(255, 255, 255, .3);
  color: $white;
  padding: .8rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: .95rem;
  transition: all $transition;
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, .22);
    border-color: rgba(255, 255, 255, .5);
    transform: translateY(-2px);
  }
}

.cta__btn-secondary {
  color: rgba(255, 255, 255, .75);
  font-size: .9rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, .35);
  padding: .5rem 0;
  transition: opacity $transition;

  &:hover { opacity: .7; }
}

// ── Rating card ───────────────────────────────────────────────
.cta__card {
  background: rgba(255, 255, 255, .1);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 255, 255, .18);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .15);
}

.cta__rating-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, .12);
}

.cta__rating-score {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: $white;
}

.cta__stars {
  display: flex;
  gap: 2px;
  margin-bottom: .35rem;

  svg {
    width: 16px;
    height: 16px;
    color: $gold;
  }
}

.cta__rating-count {
  font-size: .72rem;
  opacity: .6;
  letter-spacing: .02em;
}

// ── Reviews ───────────────────────────────────────────────────
.cta__reviews {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}

.cta__review {
  display: flex;
  align-items: flex-start;
  gap: .85rem;
}

.cta__review-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .18);
  border: 1.5px solid rgba(255, 255, 255, .22);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .72rem;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: .02em;
}

.cta__review-stars {
  font-size: .72rem;
  color: $gold;
  margin-bottom: .25rem;
  letter-spacing: .05em;
}

.cta__review-text {
  font-size: .8rem;
  opacity: .85;
  line-height: 1.55;
  font-style: italic;
  margin: 0 0 .2rem;
}

.cta__review-author {
  font-size: .7rem;
  opacity: .5;
  font-weight: 500;
}

// ── Badge row ─────────────────────────────────────────────────
.cta__badge-row {
  display: flex;
  gap: .75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, .12);
}

.cta__badge {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, .7);
  background: rgba(255, 255, 255, .07);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 10px;
  padding: .55rem .5rem;

  svg { color: rgba(255, 255, 255, .6); }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 1024px) {
  .cta__inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .cta__card  { max-width: 480px; }
  .cta__emoji-deco { display: none; }
}

@media (max-width: 768px) {
  .cta__perks { grid-template-columns: 1fr; }
  .cta__inner { grid-template-columns: 1fr; }
  .cta__card  { max-width: 100%; }
}
</style>
