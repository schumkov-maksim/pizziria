<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
</script>

<template>
  <section ref="sectionRef" class="story section">
    <div class="container story__inner">

      <!-- Image column -->
      <div class="story__img-wrap reveal-up">
        <img
          class="story__img"
          src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=85&fit=crop"
          alt="Unser Holzofen"
          loading="lazy"
        />
        <div class="story__img-badge">
          <strong>1998</strong>
          <span>Gegründet</span>
        </div>
      </div>

      <!-- Text column -->
      <div class="story__text">
        <span class="section-tag reveal-up">Unsere Geschichte</span>
        <h2 class="section-title reveal-up" style="--delay:.1s">
          Von Neapel nach Deutschland – mit Liebe
        </h2>
        <p class="story__para reveal-up" style="--delay:.2s">
          La Bella Pizza wurde 1998 von der Familie Russo gegründet, die ihr Originalrezept direkt
          aus Neapel mitbrachte. Was als kleiner Laden mit fünf Tischen begann, ist heute die
          beliebteste Pizzeria der Stadt.
        </p>
        <blockquote class="story__quote reveal-up" style="--delay:.28s">
          „Frische Zutaten, echter Holzofen und Herzblut – das ist unser ganzes Geheimnis."
        </blockquote>
        <p class="story__para reveal-up" style="--delay:.35s">
          Den Teig bereiten wir täglich um 6 Uhr morgens frisch zu und lassen ihn 24 Stunden
          ruhen – damit er die perfekte Konsistenz bekommt.
        </p>
        <p class="story__para reveal-up" style="--delay:.42s">
          Alle Tomaten, Gewürze und Mozzarella beziehen wir direkt von ausgewählten Produzenten
          aus der Campania-Region Italiens.
        </p>
        <NuxtLink
          to="/#menu"
          class="btn btn--primary reveal-up"
          style="--delay:.5s"
        >
          Jetzt bestellen →
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$cream:      #fdf8f2;
$dark:       #111111;
$muted:      #777777;
$border:     #e8e0d5;
$white:      #ffffff;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section ──────────────────────────────────────────────────
.story {
  background: $white;
}

.story__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

// ── Image column ─────────────────────────────────────────────
.story__img-wrap {
  position: relative;
  flex-shrink: 0;
}

.story__img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, .18);
  transition: transform .4s ease;

  .story__img-wrap:hover & {
    transform: scale(1.02);
  }
}

.story__img-badge {
  position: absolute;
  bottom: -1.25rem;
  right: -1.25rem;
  background: $dark;
  color: $white;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, .18);

  strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #d4a017;
    line-height: 1;
  }

  span {
    font-size: .8rem;
    opacity: .7;
  }
}

// ── Text column ───────────────────────────────────────────────
.story__text {
  .section-title {
    text-align: left;
    margin-bottom: 1.25rem;
  }
}

.story__para {
  color: $muted;
  line-height: 1.75;
  margin-bottom: 1rem;
}

.story__quote {
  border-left: 3px solid $red;
  padding: .75rem 1.25rem;
  margin: 1.5rem 0;
  background: $cream;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  font-size: 1.05rem;
  color: $dark;
  line-height: 1.6;
}

// ── Button ────────────────────────────────────────────────────
.btn--primary {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: $red;
  color: $white;
  border-radius: 50px;
  padding: .75rem 1.75rem;
  font-size: .9rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 1.5rem;
  transition: all $transition;
  box-shadow: 0 4px 16px rgba(192, 57, 43, .35);

  &:hover {
    background: darken($red, 8%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(192, 57, 43, .45);
  }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 1024px) {
  .story__inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .story__img {
    aspect-ratio: 16/9;
  }

  .story__img-badge {
    right: 1rem;
    bottom: -1rem;
  }
}
</style>
