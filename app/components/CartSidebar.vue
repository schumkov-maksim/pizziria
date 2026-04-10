<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const fmt  = (n: number) => n.toFixed(2).replace('.', ',') + '\u202f€'

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') cart.closeCart()
}

onMounted(()  => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <Teleport to="body">

    <!-- Overlay -->
    <Transition name="overlay-fade">
      <div
        v-if="cart.isOpen"
        class="cart-overlay"
        @click="cart.closeCart()"
      />
    </Transition>

    <!-- Sidebar -->
    <div class="cart-sidebar" :class="{ 'cart-sidebar--open': cart.isOpen }" role="dialog" aria-label="Warenkorb">

      <!-- Header -->
      <div class="cart-sidebar__header">
        <h3>🛒 Warenkorb</h3>
        <button class="cart-close" aria-label="Schließen" @click="cart.closeCart()">✕</button>
      </div>

      <!-- Items -->
      <ul class="cart-list">
        <li v-if="cart.items.length === 0" class="cart-empty">
          Dein Warenkorb ist noch leer.
        </li>

        <li
          v-for="item in cart.items"
          :key="item.id"
          class="cart-item"
        >
          <div class="cart-item__info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.quantity }} × {{ fmt(item.price) }}</small>
          </div>
          <span class="cart-item__price">{{ fmt(item.price * item.quantity) }}</span>
          <button
            class="cart-item__rm"
            :aria-label="`${item.name} entfernen`"
            @click="cart.removeItem(item.id)"
          >✕</button>
        </li>
      </ul>

      <!-- Footer -->
      <div class="cart-sidebar__footer">
        <div class="cart-total-row">
          <span>Gesamt</span>
          <strong>{{ fmt(cart.totalPrice) }}</strong>
        </div>
        <NuxtLink
          to="/kasse"
          class="btn btn--primary btn--full"
          @click="cart.closeCart()"
        >
          Zur Kasse →
        </NuxtLink>
      </div>

    </div>
  </Teleport>
</template>

<style lang="scss">
$dark:       #111111;
$white:      #ffffff;
$cream:      #fdf8f2;
$red:        #c0392b;
$muted:      #777777;
$border:     #e8e0d5;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Overlay ──────────────────────────────────────────────────
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .5);
  z-index: 1100;
  backdrop-filter: blur(3px);
}

// ── Sidebar ──────────────────────────────────────────────────
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -420px;
  width: min(400px, 100vw);
  height: 100dvh;
  background: $white;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  transition: right .4s cubic-bezier(.4, 0, .2, 1);
  box-shadow: -8px 0 48px rgba(0, 0, 0, .2);

  &--open { right: 0; }
}

// ── Sidebar header ────────────────────────────────────────────
.cart-sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid $border;
  background: $dark;
  color: $white;

  h3 { font-size: 1.1rem; font-weight: 600; }
}

.cart-close {
  background: rgba(255, 255, 255, .1);
  border: none;
  color: $white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: .9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background $transition;

  &:hover { background: $red; }
}

// ── Item list ─────────────────────────────────────────────────
.cart-list {
  list-style: none;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: thin;
}

.cart-empty {
  text-align: center;
  color: $muted;
  padding: 3rem 0;
  font-size: .9rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: .85rem;
  padding: .85rem 0;
  border-bottom: 1px solid $border;
  animation: slideInRight .3s ease;

  &__info {
    flex: 1;
    min-width: 0;

    strong {
      display: block;
      font-size: .9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    small { color: $muted; font-size: .78rem; }
  }

  &__price {
    font-weight: 700;
    color: $red;
    font-size: .9rem;
    white-space: nowrap;
  }

  &__rm {
    background: none;
    border: none;
    color: $muted;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    font-size: .75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition;
    flex-shrink: 0;

    &:hover { background: #fee; color: $red; }
  }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

// ── Sidebar footer ────────────────────────────────────────────
.cart-sidebar__footer {
  padding: 1.25rem 1.5rem 1.75rem;
  border-top: 1px solid $border;
  background: $cream;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  align-items: center;

  strong {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: $red;
  }
}

// ── Full-width button variant ─────────────────────────────────
.btn--full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .85rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  border-radius: 50px;
  text-decoration: none;
}

// ── Overlay transition ────────────────────────────────────────
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity .3s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to     { opacity: 0; }
</style>
