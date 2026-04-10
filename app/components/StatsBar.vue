<script setup lang="ts">
interface Stat {
  target: number
  suffix: string
  label:  string
}

const stats: Stat[] = [
  { target: 27,   suffix: '+',    label: 'Pizzasorten'      },
  { target: 1998, suffix: '',     label: 'Gegründet'        },
  { target: 30,   suffix: ' Min', label: 'Lieferzeit'       },
  { target: 98,   suffix: '%',    label: 'Zufriedene Kunden' },
]

// ── Counter animation ────────────────────────────────────────
const counts   = ref<number[]>(stats.map(() => 0))
const barRef   = ref<HTMLElement | null>(null)
const animated = ref(false)

function animateCounter(index: number, target: number) {
  const duration = target >= 1000 ? 2000 : 1400
  const start    = performance.now()

  function tick(now: number) {
    const elapsed  = now - start
    const progress = Math.min(elapsed / duration, 1)
    // ease-out quad
    const ease     = 1 - (1 - progress) * (1 - progress)
    counts.value[index] = Math.round(ease * target)
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated.value) {
        animated.value = true
        stats.forEach((s, i) => animateCounter(i, s.target))
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (barRef.value) observer.observe(barRef.value)
})
</script>

<template>
  <div ref="barRef" class="stats-bar">
    <div class="stats-bar__inner">

      <template v-for="(stat, i) in stats" :key="stat.label">
        <!-- Divider (not before the first item) -->
        <div v-if="i > 0" class="stat-divider" aria-hidden="true" />

        <div class="stat">
          <div class="stat__value">
            <span class="stat__num">{{ counts[i].toLocaleString('de-DE') }}</span>
            <span v-if="stat.suffix" class="stat__suffix">{{ stat.suffix }}</span>
          </div>
          <span class="stat__label">{{ stat.label }}</span>
        </div>
      </template>

    </div>
  </div>
</template>

<style lang="scss">
$dark:       #111111;
$white:      #ffffff;
$red:        #c0392b;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

/* ── Bar wrapper ────────────────────────────────────────── */
.stats-bar {
  background: $dark;
  color: $white;
  border-top:    1px solid rgba(255, 255, 255, .06);
  border-bottom: 1px solid rgba(255, 255, 255, .06);
}

/* ── Inner flex row ─────────────────────────────────────── */
.stats-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Single stat ────────────────────────────────────────── */
.stat {
  flex: 1;
  text-align: center;
  padding: 2.25rem 1.5rem;
  transition: background $transition;

  &:hover { background: rgba(255, 255, 255, .03); }
}

/* ── Value row (number + suffix) ────────────────────────── */
.stat__value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: .05em;
  white-space: nowrap;
  line-height: 1;
  margin-bottom: .5rem;
}

.stat__num {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -.02em;
}

.stat__suffix {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: $red;
  line-height: 1;
}

/* ── Label ──────────────────────────────────────────────── */
.stat__label {
  display: block;
  font-size: .72rem;
  font-weight: 600;
  color: rgba(255, 255, 255, .35);
  letter-spacing: .1em;
  text-transform: uppercase;
}

/* ── Vertical divider ───────────────────────────────────── */
.stat-divider {
  width: 1px;
  height: 3rem;
  background: rgba(255, 255, 255, .08);
  flex-shrink: 0;
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .stats-bar__inner { flex-wrap: wrap; }
  .stat             { flex: 1 1 calc(50% - 1rem); min-width: 140px; }
  .stat-divider     { display: none; }
}

@media (max-width: 400px) {
  .stat__num    { font-size: 2.2rem; }
  .stat__suffix { font-size: 1.2rem; }
}
</style>
