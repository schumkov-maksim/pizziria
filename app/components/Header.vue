<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

const scrolled  = ref(false)
const navOpen   = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

function toggleNav() {
  navOpen.value = !navOpen.value
}

function closeNav() {
  navOpen.value = false
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="header__inner container">

      <!-- Logo -->
      <NuxtLink to="/" class="logo" @click="closeNav">
        <span class="logo__icon">🍕</span>
        <span class="logo__text">La Bella Pizza</span>
      </NuxtLink>

      <!-- Main nav -->
      <nav class="nav" :class="{ 'nav--open': navOpen }">
        <NuxtLink to="/#menu"    class="nav__link" @click="closeNav">Speisekarte</NuxtLink>
        <NuxtLink to="/about"    class="nav__link" @click="closeNav">Über uns</NuxtLink>
        <NuxtLink to="/kontakt"  class="nav__link" @click="closeNav">Kontakt</NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Cart button -->
        <button class="cart-btn" aria-label="Warenkorb öffnen">
          <span class="cart-btn__icon">🛒</span>
          <span class="cart-btn__label">Warenkorb</span>
          <span v-if="cart.totalCount > 0" class="cart-count">{{ cart.totalCount }}</span>
        </button>

        <!-- Burger toggle -->
        <button
          class="burger"
          :class="{ open: navOpen }"
          aria-label="Menü öffnen"
          @click="toggleNav"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

    </div>
  </header>
</template>

<style lang="scss">
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

// Design-system tokens
$red:        #c0392b;
$red-dark:   #922b21;
$dark:       #111111;
$white:      #ffffff;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

/* ── Header shell ───────────────────────────────────────── */
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 900;
  transition: background $transition, box-shadow $transition;

  &.scrolled {
    background: rgba(17, 17, 17, .95);
    backdrop-filter: blur(16px);
    box-shadow: 0 2px 24px rgba(0, 0, 0, .4);
  }
}

/* ── Inner flex row ─────────────────────────────────────── */
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Logo ───────────────────────────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: $white;
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: .3px;
  flex-shrink: 0;
  text-decoration: none;

  &__icon { font-size: 1.6rem; }
}

/* ── Nav ────────────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__link {
  color: rgba(255, 255, 255, .8);
  font-size: .9rem;
  font-weight: 500;
  letter-spacing: .03em;
  position: relative;
  text-decoration: none;
  transition: color $transition;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: $red;
    border-radius: 2px;
    transition: width $transition;
  }

  &:hover,
  &.router-link-active {
    color: $white;

    &::after { width: 100%; }
  }
}

/* ── Cart button ────────────────────────────────────────── */
.cart-btn {
  display: flex;
  align-items: center;
  gap: .4rem;
  background: $red;
  color: $white;
  border: none;
  border-radius: 50px;
  padding: .5rem 1rem;
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition;
  box-shadow: 0 4px 12px rgba(192, 57, 43, .35);

  &:hover {
    background: $red-dark;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(192, 57, 43, .45);
  }

  &__icon { font-size: 1rem; }
}

/* ── Cart badge ─────────────────────────────────────────── */
.cart-count {
  background: $white;
  color: $red;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: .7rem;
  font-weight: 700;
}

/* ── Burger ─────────────────────────────────────────────── */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: .4rem;
  cursor: pointer;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: $white;
    border-radius: 2px;
    transition: all $transition;
  }

  &.open {
    span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
  }
}

/* ── Mobile breakpoint ──────────────────────────────────── */
@media (max-width: 640px) {
  .burger { display: flex; }

  .nav {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: rgba(17, 17, 17, .97);
    flex-direction: column;
    padding: 1.75rem 2rem;
    gap: 1.1rem;
    align-items: flex-start;
    border-top: 1px solid rgba(255, 255, 255, .08);
    transform: translateY(-10px);
    opacity: 0;
    pointer-events: none;
    transition: all $transition;

    &.nav--open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
  }

  .cart-btn__label { display: none; }
}
</style>
