<script setup lang="ts">
import { onMounted, ref } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)

interface TeamMember {
  initials: string
  name: string
  role: string
  quote: string
  meta: { icon: 'clock' | 'location' | 'phone'; text: string }[]
  gradA: string
  gradB: string
  gradC: string
}

const team: TeamMember[] = [
  {
    initials: 'MR',
    name: 'Marco Russo',
    role: 'Gründer & Chefpizzaiolo',
    quote: '„Eine gute Pizza braucht keine Kompromisse – nur gute Zutaten und Zeit."',
    meta: [
      { icon: 'clock', text: '28 Jahre Erfahrung' },
      { icon: 'location', text: 'Neapel, Italien' },
    ],
    gradA: '#7b1800', gradB: '#c0392b', gradC: '#e67e22',
  },
  {
    initials: 'SR',
    name: 'Sofia Russo',
    role: 'Geschäftsführerin',
    quote: '„Unsere Kunden sind wie Familie. Ihr Lächeln ist unser größter Erfolg."',
    meta: [
      { icon: 'clock', text: '20 Jahre im Betrieb' },
      { icon: 'phone', text: 'Kundenservice' },
    ],
    gradA: '#0a1f36', gradB: '#1a3a5c', gradC: '#2980b9',
  },
  {
    initials: 'LB',
    name: 'Luca Bianchi',
    role: 'Küchenchef',
    quote: '„Ich experimentiere täglich mit neuen Kombinationen, um euch zu überraschen."',
    meta: [
      { icon: 'clock', text: '15 Jahre Küche' },
      { icon: 'location', text: 'Mailand, Italien' },
    ],
    gradA: '#280733', gradB: '#4a1259', gradC: '#8e44ad',
  },
  {
    initials: 'AM',
    name: 'Anna Müller',
    role: 'Service & Lieferung',
    quote: '„Pünktlich, freundlich und immer mit einem Lächeln – das ist mein Versprechen."',
    meta: [
      { icon: 'clock', text: '8 Jahre dabei' },
      { icon: 'location', text: 'Musterstadt' },
    ],
    gradA: '#042818', gradB: '#0a4a2a', gradC: '#27ae60',
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
  <section ref="sectionRef" class="team section">
    <div class="container">

      <div class="section-head">
        <span class="section-tag reveal-up">Die Menschen dahinter</span>
        <h2 class="section-title reveal-up" style="--delay:.1s">Unser Team</h2>
        <p class="section-sub reveal-up" style="--delay:.2s">
          Jeder von uns bringt ein Stück Italien in Ihre Küche – mit Herz, Handwerk und Leidenschaft.
        </p>
      </div>

      <div class="team__grid">
        <div
          v-for="(m, i) in team"
          :key="m.name"
          class="team-card reveal-up"
          :style="`--delay:${i * .1}s`"
        >
          <!-- Gradient top banner -->
          <div
            class="team-card__top"
            :style="`--grad-a:${m.gradA}; --grad-b:${m.gradB}; --grad-c:${m.gradC}`"
          >
            <!-- Avatar — absolutely at bottom of banner, overflows into body -->
            <div class="team-card__avatar">{{ m.initials }}</div>
            <div class="team-card__role-badge">{{ m.role }}</div>
          </div>

          <!-- Body — padded top to make room for avatar -->
          <div class="team-card__body">
            <h3>{{ m.name }}</h3>
            <div class="team-card__divider" />
            <p>{{ m.quote }}</p>

            <div class="team-card__meta">
              <span
                v-for="item in m.meta"
                :key="item.text"
                class="team-card__meta-item"
              >
                <svg v-if="item.icon === 'clock'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <svg v-else-if="item.icon === 'location'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <svg v-else-if="item.icon === 'phone'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ item.text }}
              </span>
            </div>
          </div>
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
$text:       #222222;
$muted:      #777777;
$border:     #e8e0d5;
$transition: .35s cubic-bezier(.4, 0, .2, 1);

// ── Section ──────────────────────────────────────────────────
.team {
  padding: 7rem 0;
  background: $cream;
}

.team__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 2rem;
}

// ── Card ──────────────────────────────────────────────────────
.team-card {
  background: $white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .07);
  transition: all $transition;
  position: relative;
  border: 1.5px solid transparent;

  &:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, .13);
    transform: translateY(-8px);
    border-color: rgba(192, 57, 43, .15);
  }

  // ── Gradient top banner ──────────────────────────────────
  &__top {
    position: relative;
    height: 140px;
    background: linear-gradient(135deg, var(--grad-a) 0%, var(--grad-b) 50%, var(--grad-c) 100%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 0;
  }

  // ── Avatar — overflows from top to body ──────────────────
  &__avatar {
    position: absolute;
    bottom: -32px;
    left: 50%;
    transform: translateX(-50%);
    width: 68px;
    height: 68px;
    border-radius: 50%;
    background: $white;
    border: 3px solid $white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: $text;
    letter-spacing: -.02em;
    z-index: 2;
  }

  // ── Role badge ────────────────────────────────────────────
  &__role-badge {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: .65rem;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, .92);
    background: rgba(0, 0, 0, .25);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, .18);
    border-radius: 20px;
    padding: .22rem .75rem;
  }

  // ── Body ─────────────────────────────────────────────────
  &__body {
    padding: 3rem 1.75rem 1.75rem;
    text-align: center;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: $text;
    margin-bottom: .5rem;
  }

  &__divider {
    width: 36px;
    height: 2px;
    background: linear-gradient(90deg, $red, #e67e22);
    border-radius: 2px;
    margin: 0 auto .85rem;
  }

  p {
    font-size: .85rem;
    color: $muted;
    line-height: 1.72;
    font-style: italic;
    margin-bottom: 1.1rem;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: .45rem;
    border-top: 1px solid $border;
    padding-top: 1rem;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: .5rem;
    font-size: .74rem;
    color: $muted;
    justify-content: center;

    svg { color: $red; flex-shrink: 0; }
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 640px) {
  .team__grid {
    grid-template-columns: 1fr;
  }
}
</style>
