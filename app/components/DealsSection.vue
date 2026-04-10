<script setup lang="ts">
// ── Scroll reveal ────────────────────────────────────────────
const sectionRef = ref<HTMLElement | null>(null)

function useReveal(el: Ref<HTMLElement | null>) {
  onMounted(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    el.value
      ?.querySelectorAll<HTMLElement>('.reveal-up')
      .forEach((node) => io.observe(node))
  })
}

useReveal(sectionRef)

// ── Happy Hour countdown ─────────────────────────────────────
const cd = reactive({ h: '00', m: '00', s: '00' })
const isHappyHourActive = ref(false)
let cdTimer: ReturnType<typeof setInterval> | null = null

function tickCountdown() {
  const now      = new Date()
  const happyStart = new Date(); happyStart.setHours(15, 0, 0, 0)
  const happyEnd   = new Date(); happyEnd.setHours(17, 0, 0, 0)

  isHappyHourActive.value = now >= happyStart && now < happyEnd

  let diff: number
  if (isHappyHourActive.value) {
    diff = Math.floor((happyEnd.getTime() - now.getTime()) / 1000)
  } else {
    if (now >= happyEnd) happyStart.setDate(happyStart.getDate() + 1)
    diff = Math.floor((happyStart.getTime() - now.getTime()) / 1000)
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  cd.h = pad(Math.floor(diff / 3600))
  cd.m = pad(Math.floor((diff % 3600) / 60))
  cd.s = pad(diff % 60)
}

onMounted(() => {
  tickCountdown()
  cdTimer = setInterval(tickCountdown, 1000)
})

onUnmounted(() => {
  if (cdTimer) clearInterval(cdTimer)
})
</script>

<template>
  <section ref="sectionRef" class="offers">
    <div class="container">

      <!-- Section header -->
      <div class="offers__head reveal-up">
        <div>
          <span class="section-tag">Aktuelle Angebote</span>
          <h2 class="section-title" style="color:#fff; text-align:left; margin-bottom:0">
            Spare mit unseren Deals
          </h2>
        </div>
        <p class="offers__sub">
          Täglich neue Deals für Familien, Studenten und alle, die guten Geschmack schätzen.
        </p>
      </div>

      <!-- Cards grid -->
      <div class="offers__grid">

        <!-- ① Happy Hour — featured -->
        <div class="offer-card offer-card--featured reveal-up">
          <span class="offer-tag offer-tag--live">Live · täglich</span>

          <div class="offer-card__discount">–20%</div>

          <h3 class="offer-card__title">
            {{ isHappyHourActive ? '🔥 Happy Hour läuft!' : 'Happy Hour' }}
          </h3>

          <p class="offer-card__desc">
            Alle Pizzen 20&nbsp;% günstiger – jeden Tag von 15:00 bis 17:00 Uhr.
            Automatisch verrechnet.
          </p>

          <!-- Live countdown -->
          <div class="offer-countdown">
            <div class="countdown-unit">
              <span>{{ cd.h }}</span>
              <small>Std</small>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span>{{ cd.m }}</span>
              <small>Min</small>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span>{{ cd.s }}</span>
              <small>Sek</small>
            </div>
          </div>

          <NuxtLink to="/#menu" class="btn btn--primary">Jetzt bestellen</NuxtLink>
        </div>

        <!-- ② Familien-Deal -->
        <div class="offer-card reveal-up" style="--delay:.1s">
          <span class="offer-tag">Familien-Deal</span>

          <div class="offer-card__prices">
            <span class="offer-old">46,80&nbsp;€</span>
            <span class="offer-new">32,90&nbsp;€</span>
          </div>

          <h3 class="offer-card__title">Für die ganze Familie</h3>

          <p class="offer-card__desc">
            2 Pizzen (Ø 35&nbsp;cm) nach Wahl + 4 Softdrinks.
            Einfach zusammenstellen und genießen.
          </p>

          <NuxtLink to="/#menu" class="btn--outline-offer">Zusammenstellen</NuxtLink>
        </div>

        <!-- ③ Mittags-Menü -->
        <div class="offer-card reveal-up" style="--delay:.2s">
          <span class="offer-tag">Mo – Fr · 11–15 Uhr</span>

          <div class="offer-card__prices">
            <span class="offer-old">22,30&nbsp;€</span>
            <span class="offer-new">14,90&nbsp;€</span>
          </div>

          <h3 class="offer-card__title">Mittags-Menü</h3>

          <p class="offer-card__desc">
            Pizza + Salat + Getränk nach Wahl – das perfekte Mittagessen zu einem fairen Preis.
          </p>

          <NuxtLink to="/#menu" class="btn--outline-offer">Zum Menü</NuxtLink>
        </div>

        <!-- ④ Studenten-Rabatt -->
        <div class="offer-card reveal-up" style="--delay:.3s">
          <span class="offer-tag">Mit Studentenausweis</span>

          <div class="offer-card__discount offer-card__discount--sm">–15%</div>

          <h3 class="offer-card__title">Studenten-Rabatt</h3>

          <p class="offer-card__desc">
            15&nbsp;% Rabatt auf die gesamte Bestellung –
            Ausweis vorzeigen oder Code online anfragen.
          </p>

          <NuxtLink to="/kontakt" class="btn--outline-offer">Code anfragen</NuxtLink>
        </div>

      </div><!-- /offers__grid -->
    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$white:      #ffffff;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section wrapper ─────────────────────────────────────────
.offers {
  background: #111111;
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  color: $white;

  // Subtle radial glow top-left
  &::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(192, 57, 43, .18) 0%, transparent 70%);
    top: -150px; left: -100px;
    pointer-events: none;
  }
}

// ── Header row ──────────────────────────────────────────────
.offers__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.5rem;

  .section-tag { color: $red; }
}

.offers__sub {
  max-width: 340px;
  font-size: .9rem;
  color: rgba(255, 255, 255, .4);
  line-height: 1.65;
  text-align: right;
  flex-shrink: 0;
}

// ── Grid ────────────────────────────────────────────────────
.offers__grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr 1fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, .07);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .07);
}

// ── Card base ────────────────────────────────────────────────
.offer-card {
  background: rgba(255, 255, 255, .03);
  padding: 2.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  position: relative;
  transition: background $transition;

  &:hover { background: rgba(255, 255, 255, .07); }
}

.offer-card--featured {
  background: rgba(192, 57, 43, .1);
  border-right: 1px solid rgba(192, 57, 43, .25);

  &:hover { background: rgba(192, 57, 43, .15); }
}

// ── Card tag ────────────────────────────────────────────────
.offer-tag {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  background: rgba(255, 255, 255, .07);
  color: rgba(255, 255, 255, .45);
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 50px;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: .28rem .8rem;
  width: fit-content;

  &--live {
    background: rgba(192, 57, 43, .2);
    border-color: rgba(192, 57, 43, .5);
    color: #ff9090;

    &::before {
      content: '';
      width: 6px; height: 6px;
      border-radius: 50%;
      background: $red;
      display: inline-block;
      animation: blink 1.4s ease infinite;
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: .15; }
}

// ── Discount figure ─────────────────────────────────────────
.offer-card__discount {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 700;
  color: $white;
  line-height: 1;
  letter-spacing: -.02em;

  &--sm { font-size: 2.8rem; }
}

// ── Title & description ──────────────────────────────────────
.offer-card__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: $white;
  line-height: 1.3;
}

.offer-card__desc {
  font-size: .875rem;
  color: rgba(255, 255, 255, .45);
  line-height: 1.7;
  flex: 1;
}

// ── Price row ────────────────────────────────────────────────
.offer-card__prices {
  display: flex;
  align-items: baseline;
  gap: .75rem;
}

.offer-old {
  font-size: .875rem;
  color: rgba(255, 255, 255, .25);
  text-decoration: line-through;
}

.offer-new {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: $white;
  line-height: 1;
}

// ── Outline button (cards) ───────────────────────────────────
.btn--outline-offer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, .18);
  color: rgba(255, 255, 255, .6);
  background: transparent;
  border-radius: 50px;
  padding: .6rem 1.4rem;
  font-size: .875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all $transition;
  text-decoration: none;
  margin-top: auto;

  &:hover {
    border-color: rgba(255, 255, 255, .5);
    color: $white;
    background: rgba(255, 255, 255, .06);
  }
}

// ── Countdown ────────────────────────────────────────────────
.offer-countdown {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 10px;
  padding: .65rem .9rem;
  min-width: 58px;

  span {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: $white;
    line-height: 1;
  }

  small {
    font-size: .6rem;
    color: rgba(255, 255, 255, .3);
    margin-top: .2rem;
    text-transform: uppercase;
    letter-spacing: .08em;
  }
}

.countdown-sep {
  font-size: 1.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, .2);
  padding-bottom: 1.3rem;
  line-height: 1;
  user-select: none;
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 1100px) {
  .offers__grid          { grid-template-columns: 1fr 1fr; }
  .offer-card--featured  { grid-column: span 2; }
}

@media (max-width: 640px) {
  .offers__grid         { grid-template-columns: 1fr; }
  .offer-card--featured { grid-column: span 1; }
  .offers__head         { flex-direction: column; align-items: flex-start; }
  .offers__sub          { text-align: left; max-width: 100%; }
}
</style>
