<script setup lang="ts">
import { useMenuStore }  from '~/stores/menu'
import { useCartStore }  from '~/stores/cart'

const menu = useMenuStore()
const cart = useCartStore()

// ── Scroll reveal ────────────────────────────────────────────
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

// ── Add-to-cart feedback ─────────────────────────────────────
const addedId = ref<number | null>(null)

function addToCart(id: number, name: string, price: number) {
  cart.addItem({ id, name, price })
  addedId.value = id
  setTimeout(() => { addedId.value = null }, 1200)
}

const fmt = (n: number) => n.toFixed(2).replace('.', ',') + '\u202f€'
</script>

<template>
  <section ref="sectionRef" id="menu" class="catalog">
    <div class="container">

      <!-- Section head -->
      <div class="section-head reveal-up">
        <span class="section-tag">Speisekarte</span>
        <h2 class="section-title">Was darf es sein?</h2>
        <p class="section-sub">Frisch, ehrlich, lecker – entdecken Sie unsere gesamte Auswahl.</p>
      </div>

      <!-- Tab bar -->
      <div class="catalog-tabs reveal-up">
        <button
          class="ctab"
          :class="{ 'ctab--active': menu.activeTab === 'pizza' }"
          @click="menu.setTab('pizza')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          Pizzen <em>{{ menu.pizzas.length }}</em>
        </button>

        <button
          class="ctab"
          :class="{ 'ctab--active': menu.activeTab === 'salad' }"
          @click="menu.setTab('salad')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
            <path d="M12 2v10l4.5 4.5"/>
          </svg>
          Salate <em>{{ menu.salads.length }}</em>
        </button>

        <button
          class="ctab"
          :class="{ 'ctab--active': menu.activeTab === 'drink' }"
          @click="menu.setTab('drink')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 2h8l1 7H7L8 2z"/>
            <path d="M7 9c0 5 2 9 5 9s5-4 5-9"/>
          </svg>
          Getränke <em>{{ menu.drinks.length }}</em>
        </button>
      </div>

      <!-- Drink sub-filter (only for drinks tab) -->
      <Transition name="fade">
        <div v-if="menu.activeTab === 'drink'" class="sub-tabs sub-tabs--show">
          <button
            v-for="f in [
              { key: 'all',  label: 'Alle' },
              { key: 'soft', label: 'Alkoholfrei' },
              { key: 'alco', label: 'Alkoholisch' },
              { key: 'hot',  label: 'Heiß' },
            ]"
            :key="f.key"
            class="stab"
            :class="{ 'stab--active': menu.activeDrinkFilter === f.key }"
            @click="menu.setDrinkFilter(f.key)"
          >
            {{ f.label }}
          </button>
        </div>
      </Transition>

      <!-- ── Pizza grid ── -->
      <Transition name="fade" mode="out-in">
        <div v-if="menu.activeTab === 'pizza'" key="pizza" class="catalog-grid">
          <article
            v-for="pizza in menu.pizzas"
            :key="pizza.id"
            class="card reveal-up"
          >
            <div class="card__img-wrap">
              <img :src="pizza.img" :alt="pizza.name" class="card__img" loading="lazy" />
              <span v-if="pizza.badge" class="card__badge">{{ pizza.badge }}</span>
            </div>
            <div class="card__body">
              <h3>{{ pizza.name }}</h3>
              <p>{{ pizza.desc }}</p>
              <div class="card__footer">
                <span class="price">
                  ab {{ fmt(pizza.base) }}
                </span>
                <button
                  class="card__cart-btn"
                  :class="{ added: addedId === pizza.id }"
                  @click="addToCart(pizza.id, pizza.name, pizza.base)"
                >
                  {{ addedId === pizza.id ? '✓' : '🛒' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- ── Salad grid ── -->
        <div v-else-if="menu.activeTab === 'salad'" key="salad" class="catalog-grid">
          <article
            v-for="salad in menu.salads"
            :key="salad.id"
            class="card reveal-up"
          >
            <div class="card__img-wrap">
              <img :src="salad.img" :alt="salad.name" class="card__img" loading="lazy" />
              <span v-if="salad.badge" class="card__badge">{{ salad.badge }}</span>
            </div>
            <div class="card__body">
              <h3>{{ salad.name }}</h3>
              <p>{{ salad.desc }}</p>
              <div class="card__footer">
                <span class="price">{{ fmt(salad.price) }}</span>
                <button
                  class="card__cart-btn"
                  :class="{ added: addedId === salad.id }"
                  @click="addToCart(salad.id, salad.name, salad.price)"
                >
                  {{ addedId === salad.id ? '✓' : '🛒' }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- ── Drink grid ── -->
        <div v-else key="drink" class="catalog-grid">
          <article
            v-for="drink in menu.filteredDrinks"
            :key="drink.id"
            class="card reveal-up"
          >
            <div class="card__img-wrap">
              <img :src="drink.img" :alt="drink.name" class="card__img" loading="lazy" />
              <span class="card__badge">{{ drink.catLabel }}</span>
            </div>
            <div class="card__body">
              <h3>
                {{ drink.name }}
                <span class="card__vol">{{ drink.vol }}</span>
              </h3>
              <p>{{ drink.desc }}</p>
              <div class="card__footer">
                <span class="price">{{ fmt(drink.price) }}</span>
                <button
                  class="card__cart-btn"
                  :class="{ added: addedId === drink.id }"
                  @click="addToCart(drink.id, drink.name, drink.price)"
                >
                  {{ addedId === drink.id ? '✓' : '🛒' }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </Transition>

    </div>
  </section>
</template>

<style lang="scss">
$red:        #c0392b;
$cream:      #fdf8f2;
$white:      #ffffff;
$dark:       #111111;
$muted:      #777777;
$border:     #e8e0d5;
$text:       #222222;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section wrapper ─────────────────────────────────────────
.catalog {
  background: $cream;
  padding: 5rem 0;
}

// ── Tab bar ──────────────────────────────────────────────────
.catalog-tabs {
  display: flex;
  gap: .5rem;
  background: $white;
  border-radius: 14px;
  padding: .4rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .08);
  width: fit-content;
}

.ctab {
  display: flex;
  align-items: center;
  gap: .55rem;
  padding: .7rem 1.6rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-family: inherit;
  font-size: .9rem;
  font-weight: 600;
  color: $muted;
  cursor: pointer;
  transition: all $transition;
  white-space: nowrap;

  svg        { opacity: .5; transition: opacity $transition; flex-shrink: 0; }
  em         {
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, .07); color: $muted;
    border-radius: 50px; font-style: normal; font-size: .68rem; font-weight: 700;
    min-width: 1.3rem; padding: .05rem .35rem; transition: all $transition;
  }

  &:hover         { color: $text; background: rgba(0, 0, 0, .04); }
  &:hover svg     { opacity: .75; }

  &--active {
    background: $dark;
    color: $white;
    box-shadow: 0 4px 14px rgba(0, 0, 0, .2);

    svg { opacity: 1; stroke: $white; }
    em  { background: rgba(255, 255, 255, .15); color: rgba(255, 255, 255, .8); }
  }
}

// ── Sub-filter ───────────────────────────────────────────────
.sub-tabs--show {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.stab {
  background: $white;
  border: 2px solid $border;
  border-radius: 50px;
  padding: .4rem 1.1rem;
  font-size: .82rem;
  font-weight: 600;
  color: $muted;
  cursor: pointer;
  transition: all $transition;
  font-family: inherit;

  &:hover      { border-color: $red; color: $red; }
  &--active {
    background: $red; border-color: $red; color: $white;
    box-shadow: 0 4px 12px rgba(192, 57, 43, .3);
  }
}

// ── Grid ─────────────────────────────────────────────────────
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
  gap: 1.75rem;
}

// ── Card ─────────────────────────────────────────────────────
.card {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .12);
  cursor: pointer;
  transition: transform $transition, box-shadow $transition;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 60px rgba(0, 0, 0, .18), 0 0 0 1px rgba(192, 57, 43, .08);
  }
}

.card__img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .6s cubic-bezier(.4, 0, .2, 1);

  .card:hover & { transform: scale(1.08); }
}

.card__badge {
  position: absolute; top: .75rem; left: .75rem;
  background: $red; color: $white;
  font-size: .7rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: .25rem .65rem; border-radius: 50px;
  box-shadow: 0 2px 8px rgba(192, 57, 43, .4);
}

.card__body {
  padding: 1.25rem 1.4rem 1.4rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    margin-bottom: .35rem;
  }

  p {
    font-size: .875rem;
    color: $muted;
    flex: 1;
    margin-bottom: 1rem;
    line-height: 1.55;
  }
}

.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.price {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: $red;

  small { font-size: .7rem; color: $muted; font-family: 'Inter', sans-serif; font-weight: 400; }
}

.card__vol {
  display: inline-block;
  background: rgba(0, 0, 0, .06); color: $muted;
  font-size: .68rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
  padding: .15rem .5rem; border-radius: 50px;
  margin-left: .4rem; vertical-align: middle;
}

// ── Cart add button ──────────────────────────────────────────
.card__cart-btn {
  width: 2.2rem; height: 2.2rem;
  border-radius: 50%;
  border: 2px solid rgba(192, 57, 43, .25);
  background: transparent;
  color: $red;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: all $transition;

  &:hover { background: $red; color: $white; border-color: $red; }
  &.added { background: #27ae60; border-color: #27ae60; color: $white; }
}

// ── Transitions ───────────────────────────────────────────────
.fade-enter-active,
.fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 640px) {
  .catalog-tabs { width: 100%; overflow-x: auto; }
}
</style>
