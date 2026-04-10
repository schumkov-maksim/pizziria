<script setup lang="ts">
interface Slide {
  image: string
  tag: string
  title: string
  titleEm: string
  sub: string
  btnPrimary: { label: string; to: string }
  btnGhost:   { label: string; to: string }
}

const slides: Slide[] = [
  {
    image:      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=85&fit=crop',
    tag:        'Seit 1998 in Musterstadt',
    title:      'Authentische',
    titleEm:    'Italienische Pizza',
    sub:        'Frisch gebacken im Holzofen – jeden Tag.',
    btnPrimary: { label: 'Jetzt bestellen', to: '/#menu' },
    btnGhost:   { label: 'Mehr erfahren',  to: '/about' },
  },
  {
    image:      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=85&fit=crop',
    tag:        'Tradition trifft Geschmack',
    title:      'Frisch aus dem',
    titleEm:    'Holzofen',
    sub:        '485 °C – fertig in 90 Sekunden.',
    btnPrimary: { label: 'Speisekarte', to: '/#menu' },
    btnGhost:   { label: 'Reservieren', to: '/kontakt' },
  },
  {
    image:      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1920&q=85&fit=crop',
    tag:        'Schnell & lecker',
    title:      'Lieferung in',
    titleEm:    '30 Minuten',
    sub:        'Mit E-Bike – umweltfreundlich und pünktlich.',
    btnPrimary: { label: 'Pizza wählen', to: '/#menu' },
    btnGhost:   { label: 'Kontakt',      to: '/kontakt' },
  },
]

// ── Swiper setup ────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null)
const progressKey  = ref(0)

const swiper = useSwiper(containerRef, {
  loop:     true,
  speed:    800,
  autoplay: { delay: 5000, disableOnInteraction: false },
})

onMounted(() => {
  containerRef.value?.addEventListener('swiperslidechange', () => {
    progressKey.value++
  })
})
</script>

<template>
  <section class="hero-slider">
    <ClientOnly>
      <swiper-container ref="containerRef" class="slider__swiper">
        <swiper-slide
          v-for="(slide, i) in slides"
          :key="i"
          class="slide"
          :style="`background-image: url('${slide.image}')`"
        >
          <div class="slide__overlay" />
          <div class="slide__content">
            <span class="slide__tag reveal-up">{{ slide.tag }}</span>
            <h1 class="slide__title reveal-up">
              {{ slide.title }}<br>
              <em>{{ slide.titleEm }}</em>
            </h1>
            <p class="slide__sub reveal-up">{{ slide.sub }}</p>
            <div class="slide__btns reveal-up">
              <NuxtLink :to="slide.btnPrimary.to" class="btn btn--primary">
                {{ slide.btnPrimary.label }}
              </NuxtLink>
              <NuxtLink :to="slide.btnGhost.to" class="btn btn--ghost">
                {{ slide.btnGhost.label }}
              </NuxtLink>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <!-- Prev / Next arrows -->
    <button
      class="slider__arrow slider__arrow--prev"
      aria-label="Vorheriges Bild"
      @click="swiper.prev()"
    >&#8249;</button>
    <button
      class="slider__arrow slider__arrow--next"
      aria-label="Nächstes Bild"
      @click="swiper.next()"
    >&#8250;</button>

    <!-- Progress bar (resets on each slide change via :key) -->
    <div :key="progressKey" class="slider__progress" />
  </section>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

$red:        #c0392b;
$red-dark:   #922b21;
$white:      #ffffff;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

/* ── Section wrapper ────────────────────────────────────── */
.hero-slider {
  position: relative;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
}

/* ── Swiper fills the section ───────────────────────────── */
.slider__swiper {
  width: 100%;
  height: 100%;
}

/* ── Each slide ─────────────────────────────────────────── */
swiper-slide.slide {
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  height: 100%;
}

.slide__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(0, 0, 0, .72) 0%,
    rgba(0, 0, 0, .45) 55%,
    rgba(0, 0, 0, .20) 100%
  );
}

.slide__content {
  position: relative;
  z-index: 2;
  color: $white;
  max-width: 660px;
  padding-top: 72px; /* clear fixed header */
  padding-left: clamp(1.25rem, 5vw, 4rem);
}

/* ── Slide text ─────────────────────────────────────────── */
.slide__tag {
  display: inline-block;
  background: $red;
  color: $white;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: .35rem .9rem;
  border-radius: 50px;
  margin-bottom: 1.25rem;
}

.slide__title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.6rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.12;
  margin-bottom: 1.25rem;
  text-shadow: 0 2px 12px rgba(0, 0, 0, .3);

  em {
    color: #f5c842;
    font-style: italic;
  }
}

.slide__sub {
  font-size: 1.15rem;
  font-weight: 300;
  opacity: .9;
  margin-bottom: 2rem;
  max-width: 420px;
}

.slide__btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── Reveal-up animation (triggered on active slide) ────── */
.reveal-up {
  opacity: 0;
  transform: translateY(30px);
}

swiper-slide.swiper-slide-active .reveal-up {
  animation: revealUp .7s ease both;
}
swiper-slide.swiper-slide-active .slide__tag   { animation-delay: .10s; }
swiper-slide.swiper-slide-active .slide__title { animation-delay: .25s; }
swiper-slide.swiper-slide-active .slide__sub   { animation-delay: .40s; }
swiper-slide.swiper-slide-active .slide__btns  { animation-delay: .55s; }

@keyframes revealUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0);     }
}

/* ── Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  padding: .8rem 1.8rem;
  border-radius: 50px;
  font-size: .95rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition;

  &--primary {
    background: $red;
    color: $white;
    border: 2px solid $red;
    box-shadow: 0 4px 20px rgba(192, 57, 43, .4);

    &:hover { background: $red-dark; border-color: $red-dark; transform: translateY(-2px); }
  }

  &--ghost {
    background: transparent;
    color: $white;
    border: 2px solid rgba(255, 255, 255, .65);

    &:hover { background: rgba(255, 255, 255, .12); border-color: $white; transform: translateY(-2px); }
  }

  &:active { transform: scale(.97); }
}

/* ── Arrows ─────────────────────────────────────────────── */
.slider__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background: rgba(255, 255, 255, .12);
  color: $white;
  border: 1px solid rgba(255, 255, 255, .25);
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 1.8rem;
  line-height: 1;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    background: $red;
    border-color: $red;
    transform: translateY(-50%) scale(1.08);
  }

  &--prev { left: 2rem; }
  &--next { right: 2rem; }
}

/* ── Progress bar ───────────────────────────────────────── */
.slider__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: $red;
  animation: sliderProgress 5s linear forwards;
}

@keyframes sliderProgress {
  from { width: 0; }
  to   { width: 100%; }
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .slide__title { font-size: 2.2rem; }

  .slider__arrow {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;

    &--prev { left: .75rem; }
    &--next { right: .75rem; }
  }
}
</style>
