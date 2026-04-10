<template>
  <footer class="footer">
    <div class="container footer__inner">

      <!-- Brand -->
      <div class="footer__brand">
        <NuxtLink to="/" class="footer__logo">
          <span>🍕</span> La Bella Pizza
        </NuxtLink>
        <p>
          Pizzastraße 12, 12345 Musterstadt<br>
          +49 123 456 789
        </p>
      </div>

      <!-- Navigation -->
      <nav class="footer__nav" aria-label="Footer Navigation">
        <NuxtLink to="/">Startseite</NuxtLink>
        <NuxtLink to="/#menu">Speisekarte</NuxtLink>
        <NuxtLink to="/about">Über uns</NuxtLink>
        <NuxtLink to="/kontakt">Kontakt</NuxtLink>
      </nav>

      <!-- Opening hours -->
      <div class="footer__hours">
        <strong>Öffnungszeiten</strong>
        <span>Mo – Fr &nbsp;11:00 – 22:00</span>
        <span>Sa – So &nbsp;12:00 – 23:00</span>
      </div>

    </div>

    <div class="footer__bottom">
      <div class="container">
        © {{ new Date().getFullYear() }} La Bella Pizza – Alle Rechte vorbehalten.
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
$dark:       #111111;
$white:      #ffffff;
$red:        #c0392b;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Footer shell ─────────────────────────────────────────────
.footer {
  background: $dark;
  color: rgba(255, 255, 255, .7);
}

// ── Main row ─────────────────────────────────────────────────
.footer__inner {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 3rem;
  padding: 3.5rem 0 2.5rem;
  align-items: start;
}

// ── Brand ────────────────────────────────────────────────────
.footer__brand {
  p {
    font-size: .875rem;
    line-height: 1.7;
    opacity: .6;
    margin-top: .75rem;
  }
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  color: $white;
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: .3px;
}

// ── Nav ──────────────────────────────────────────────────────
.footer__nav {
  display: flex;
  flex-direction: column;
  gap: .65rem;

  a {
    font-size: .875rem;
    transition: color $transition;

    &:hover { color: $white; }
  }
}

// ── Opening hours ─────────────────────────────────────────────
.footer__hours {
  display: flex;
  flex-direction: column;
  gap: .35rem;

  strong {
    display: block;
    color: $white;
    font-size: .875rem;
    margin-bottom: .25rem;
  }

  span {
    font-size: .85rem;
    opacity: .6;
  }
}

// ── Bottom bar ────────────────────────────────────────────────
.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, .08);
  padding: 1.25rem 0;
  font-size: .8rem;
  text-align: center;
  opacity: .4;
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 1024px) {
  .footer__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
