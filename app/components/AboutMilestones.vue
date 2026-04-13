<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef   = ref<HTMLElement | null>(null)

interface Milestone {
  year: string
  title: string
  label: string
  done?: boolean
  current?: boolean
  icon: string
}

const milestones: Milestone[] = [
  {
    year: '1998',
    title: 'Die Gründung',
    label: 'Familie Russo eröffnet La Bella Pizza – fünf Tische, ein Traum, eine Leidenschaft.',
    done: true,
    icon: 'home',
  },
  {
    year: '2005',
    title: 'Der Holzofen',
    label: 'Einführung des echten Neapolitaner Holzofens – authentischer Geschmack bei 485 °C.',
    done: true,
    icon: 'flame',
  },
  {
    year: '2012',
    title: 'Große Erweiterung',
    label: 'Umbau auf 60 Sitzplätze – die ganze Stadt entdeckt La Bella.',
    done: true,
    icon: 'users',
  },
  {
    year: '2019',
    title: 'Digital & Nachhaltig',
    label: 'Online-Bestellsystem und E-Bike-Lieferservice – schnell, modern und umweltfreundlich.',
    done: true,
    icon: 'phone',
  },
  {
    year: 'Heute',
    title: 'Nr. 1 in Musterstadt',
    label: 'Über 1.998 begeisterte Stammkunden und die höchste Bewertung der Stadt.',
    current: true,
    icon: 'check',
  },
]

onMounted(() => {
  // Animate spine line when section enters view
  const spineIo = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        trackRef.value?.classList.add('milestones--animated')
        spineIo.unobserve(e.target)
      }
    }),
    { threshold: 0.3 }
  )
  if (sectionRef.value) spineIo.observe(sectionRef.value)

  // Reveal-up animations
  const revealIo = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealIo.unobserve(e.target) }
    }),
    { threshold: 0.1 }
  )
  sectionRef.value?.querySelectorAll<HTMLElement>('.reveal-up').forEach((el) => revealIo.observe(el))
})
</script>

<template>
  <section ref="sectionRef" class="milestones section" id="milestones">
    <div class="milestones__bg-deco" aria-hidden="true" />
    <div class="container">

      <!-- Section header -->
      <div class="section-head">
        <span class="section-tag reveal-up">Unser Weg</span>
        <h2 class="section-title reveal-up" style="--delay:.1s">Meilensteine</h2>
        <p class="section-sub reveal-up" style="--delay:.2s">
          Von einem kleinen Laden mit fünf Tischen zur beliebtesten Pizzeria der Stadt.
        </p>
      </div>

      <!-- Horizontal timeline track -->
      <div ref="trackRef" class="milestones__track" id="milestonesTrack">

        <!-- Animated horizontal spine line -->
        <div class="milestones__spine" id="milestonesLine">
          <div class="milestones__spine-fill" />
        </div>

        <!-- Milestone items -->
        <div
          v-for="(m, i) in milestones"
          :key="m.year"
          class="milestone"
          :class="{ 'milestone--done': m.done, 'milestone--current': m.current }"
        >
          <!-- Icon dot (sits on the spine line) -->
          <div class="milestone__dot">
            <svg v-if="m.icon === 'home'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <svg v-else-if="m.icon === 'flame'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
            <svg v-else-if="m.icon === 'users'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <svg v-else-if="m.icon === 'phone'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <svg v-else-if="m.icon === 'check'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <!-- Vertical connector from dot down to card -->
          <div class="milestone__connector" />

          <!-- Card -->
          <div class="milestone__card" :class="{ 'milestone__card--current': m.current }">
            <div
              class="milestone__year-badge"
              :class="{ 'milestone__year-badge--current': m.current }"
            >
              {{ m.year }}
            </div>
            <h4 class="milestone__title">{{ m.title }}</h4>
            <p class="milestone__label">{{ m.label }}</p>
            <span v-if="m.current" class="milestone__badge-live">
              <span class="milestone__badge-dot" />
              Aktuell aktiv
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$white:      #ffffff;
$dark:       #111111;
$muted:      #777777;
$border:     #e8e0d5;
$text:       #222222;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section — WHITE background ────────────────────────────────
.milestones {
  padding: 7rem 0 6rem;
  background: $white;
  overflow: hidden;
  position: relative;
}

.milestones__bg-deco {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 0%, rgba(192, 57, 43, .04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 90% 80%, rgba(230, 126, 34, .03) 0%, transparent 60%);
  pointer-events: none;
}

// ── Horizontal track ──────────────────────────────────────────
.milestones__track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  padding-top: 5rem;
  margin-top: 3rem;
}

// ── Spine — horizontal line ───────────────────────────────────
.milestones__spine {
  position: absolute;
  top: 28px;
  left: calc(10% + 16px);
  right: calc(10% + 16px);
  height: 2px;
  background: $border;
  z-index: 0;
  border-radius: 2px;
  overflow: hidden;
}

.milestones__spine-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, $red 0%, #e67e22 100%);
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 1.4s cubic-bezier(.4, 0, .2, 1);
  border-radius: 2px;
}

.milestones--animated .milestones__spine-fill {
  transform: scaleX(1);
}

// ── Individual milestone ──────────────────────────────────────
.milestone {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Dot sits at the top on the spine
.milestone__dot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: $white;
  border: 2px solid $border;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all $transition;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .07);

  svg { color: $muted; transition: color $transition; }
}

.milestone--done .milestone__dot {
  border-color: $red;
  background: rgba(192, 57, 43, .05);
  box-shadow: 0 0 0 4px rgba(192, 57, 43, .07), 0 2px 12px rgba(192, 57, 43, .18);

  svg { color: $red; }
}

.milestone--current .milestone__dot {
  background: $red;
  border-color: $red;
  width: 60px;
  height: 60px;
  top: -4px;
  box-shadow: 0 6px 24px rgba(192, 57, 43, .45), 0 0 0 8px rgba(192, 57, 43, .12);

  svg { color: $white; }
}

// Vertical connector: from dot down to card
.milestone__connector {
  width: 2px;
  height: 2.5rem;
  background: linear-gradient(to bottom, rgba(192, 57, 43, .3), transparent);
  margin-bottom: .5rem;
  border-radius: 2px;
}

.milestone--done .milestone__connector {
  background: linear-gradient(to bottom, rgba(192, 57, 43, .45), rgba(192, 57, 43, .08));
}

.milestone--current .milestone__connector {
  background: linear-gradient(to bottom, $red, rgba(192, 57, 43, .15));
}

// ── Card ──────────────────────────────────────────────────────
.milestone__card {
  background: $white;
  border: 1.5px solid $border;
  border-radius: 16px;
  padding: 1.1rem 1rem 1.25rem;
  text-align: center;
  transition: all $transition;
  width: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, .05);

  .milestone:hover & {
    border-color: rgba(192, 57, 43, .3);
    box-shadow: 0 8px 28px rgba(192, 57, 43, .12);
    transform: translateY(-3px);
  }

  &--current {
    border-color: rgba(192, 57, 43, .35);
    background: linear-gradient(135deg, rgba(192, 57, 43, .04) 0%, rgba(230, 126, 34, .03) 100%);
    box-shadow: 0 4px 20px rgba(192, 57, 43, .13);
  }
}

.milestone__year-badge {
  display: inline-block;
  font-family: 'Playfair Display', serif;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: $red;
  background: rgba(192, 57, 43, .08);
  border: 1px solid rgba(192, 57, 43, .15);
  border-radius: 20px;
  padding: .2rem .7rem;
  margin-bottom: .65rem;

  &--current {
    background: $red;
    color: $white;
    border-color: $red;
  }
}

.milestone__title {
  font-family: 'Playfair Display', serif;
  font-size: .92rem;
  font-weight: 700;
  color: $text;
  margin-bottom: .45rem;
  line-height: 1.3;
}

.milestone__label {
  font-size: .76rem;
  color: $muted;
  line-height: 1.6;
  padding: 0 .15rem;
}

// ── Live badge ────────────────────────────────────────────────
.milestone__badge-live {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .7rem;
  font-weight: 600;
  color: #16a34a;
  background: rgba(22, 163, 74, .08);
  border: 1px solid rgba(22, 163, 74, .2);
  border-radius: 20px;
  padding: .22rem .65rem;
  margin-top: .75rem;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.milestone__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  animation: pulse-green 1.8s ease-in-out infinite;
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, .5); }
  50%       { box-shadow: 0 0 0 5px rgba(22, 163, 74, 0); }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 1024px) {
  .milestones__track {
    grid-template-columns: repeat(3, 1fr);
  }

  .milestones__spine { display: none; }
}

@media (max-width: 768px) {
  .milestones__track {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
}

@media (max-width: 480px) {
  .milestones__track {
    grid-template-columns: 1fr;
  }
}
</style>
