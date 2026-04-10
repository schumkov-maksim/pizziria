<script setup lang="ts">
import { useMenuStore } from '~/stores/menu'
import { useCartStore } from '~/stores/cart'

const menu = useMenuStore()
const cart = useCartStore()

const fmt = (n: number) => n.toFixed(2).replace('.', ',') + '\u202f€'

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

// ── Pizza options data ────────────────────────────────────────
const SIZES = [
  { label: 'Klein',  sub: '25 cm', extra: 0    },
  { label: 'Mittel', sub: '30 cm', extra: 2.00 },
  { label: 'Groß',   sub: '35 cm', extra: 4.00 },
  { label: 'Jumbo',  sub: '40 cm', extra: 6.00 },
]

const DOUGHS = [
  { label: 'Klassisch',       extra: 0.00 },
  { label: 'Dünn & Knusprig', extra: 0.50 },
  { label: 'Vollkorn',        extra: 1.00 },
  { label: 'Dicke Kruste',    extra: 1.50 },
]

// ── Modal ─────────────────────────────────────────────────────
interface ModalItem {
  id:      number
  name:    string
  desc:    string
  price:   number
  img:     string
  isPizza: boolean
}

const modal = reactive({
  open:     false,
  item:     null as ModalItem | null,
  qty:      1,
  sizeIdx:  1,   // default: Mittel
  doughIdx: 0,   // default: Klassisch
})

const sizeExtra  = computed(() => modal.item?.isPizza ? SIZES[modal.sizeIdx].extra   : 0)
const doughExtra = computed(() => modal.item?.isPizza ? DOUGHS[modal.doughIdx].extra : 0)
const unitPrice  = computed(() => (modal.item ? modal.item.price + sizeExtra.value + doughExtra.value : 0))
const modalTotal = computed(() => unitPrice.value * modal.qty)

function openModal(item: ModalItem) {
  modal.item     = item
  modal.qty      = 1
  modal.sizeIdx  = 1
  modal.doughIdx = 0
  modal.open     = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modal.open = false
  document.body.style.overflow = ''
}

function changeQty(delta: number) {
  modal.qty = Math.max(1, Math.min(10, modal.qty + delta))
}

function confirmAdd() {
  if (!modal.item) return
  const suffix = modal.item.isPizza
    ? ` (${SIZES[modal.sizeIdx].label}, ${DOUGHS[modal.doughIdx].label})`
    : ''
  cart.addItem(
    { id: modal.item.id, name: modal.item.name + suffix, price: unitPrice.value },
    modal.qty,
  )
  closeModal()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
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
        <button class="ctab" :class="{ 'ctab--active': menu.activeTab === 'pizza' }" @click="menu.setTab('pizza')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          Pizzen <em>{{ menu.pizzas.length }}</em>
        </button>
        <button class="ctab" :class="{ 'ctab--active': menu.activeTab === 'salad' }" @click="menu.setTab('salad')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 2v10l4.5 4.5"/>
          </svg>
          Salate <em>{{ menu.salads.length }}</em>
        </button>
        <button class="ctab" :class="{ 'ctab--active': menu.activeTab === 'drink' }" @click="menu.setTab('drink')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 2h8l1 7H7L8 2z"/><path d="M7 9c0 5 2 9 5 9s5-4 5-9"/>
          </svg>
          Getränke <em>{{ menu.drinks.length }}</em>
        </button>
      </div>

      <!-- Drink sub-filter -->
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
          >{{ f.label }}</button>
        </div>
      </Transition>

      <!-- ── Grids ── -->
      <Transition name="tab-fade" mode="out-in">

        <!-- Pizza -->
        <div v-if="menu.activeTab === 'pizza'" key="pizza" class="catalog-grid">
          <article v-for="p in menu.pizzas" :key="p.id" class="card">
            <div class="card__img-wrap">
              <img :src="p.img" :alt="p.name" class="card__img" loading="lazy" />
              <span v-if="p.badge" class="card__badge">{{ p.badge }}</span>
            </div>
            <div class="card__body">
              <h3>{{ p.name }}</h3>
              <p>{{ p.desc }}</p>
              <div class="card__footer">
                <span class="price">ab {{ fmt(p.base) }}</span>
                <button
                  class="card__order-btn"
                  @click.stop="openModal({ id: p.id, name: p.name, desc: p.desc, price: p.base, img: p.img, isPizza: true })"
                >Bestellen</button>
              </div>
            </div>
          </article>
        </div>

        <!-- Salads -->
        <div v-else-if="menu.activeTab === 'salad'" key="salad" class="catalog-grid">
          <article v-for="s in menu.salads" :key="s.id" class="card">
            <div class="card__img-wrap">
              <img :src="s.img" :alt="s.name" class="card__img" loading="lazy" />
              <span v-if="s.badge" class="card__badge">{{ s.badge }}</span>
            </div>
            <div class="card__body">
              <h3>{{ s.name }}</h3>
              <p>{{ s.desc }}</p>
              <div class="card__footer">
                <span class="price">{{ fmt(s.price) }}</span>
                <button
                  class="card__order-btn"
                  @click.stop="openModal({ id: s.id, name: s.name, desc: s.desc, price: s.price, img: s.img, isPizza: false })"
                >Bestellen</button>
              </div>
            </div>
          </article>
        </div>

        <!-- Drinks -->
        <div v-else key="drink" class="catalog-grid">
          <article v-for="d in menu.filteredDrinks" :key="d.id" class="card">
            <div class="card__img-wrap">
              <img :src="d.img" :alt="d.name" class="card__img" loading="lazy" />
              <span class="card__badge">{{ d.catLabel }}</span>
            </div>
            <div class="card__body">
              <h3>{{ d.name }} <span class="card__vol">{{ d.vol }}</span></h3>
              <p>{{ d.desc }}</p>
              <div class="card__footer">
                <span class="price">{{ fmt(d.price) }}</span>
                <button
                  class="card__order-btn"
                  @click.stop="openModal({ id: d.id, name: d.name, desc: d.desc, price: d.price, img: d.img, isPizza: false })"
                >Bestellen</button>
              </div>
            </div>
          </article>
        </div>

      </Transition>
    </div>
  </section>

  <!-- ── Order Modal ── -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modal.open" class="modal-backdrop" @click.self="closeModal">
        <div class="modal" role="dialog" aria-modal="true">

          <!-- Close -->
          <button class="modal__close" aria-label="Schließen" @click="closeModal">✕</button>

          <!-- Image -->
          <div v-if="modal.item" class="modal__img-wrap">
            <img :src="modal.item.img" :alt="modal.item.name" class="modal__img" />
            <div class="modal__img-overlay" />
          </div>

          <!-- Body -->
          <div v-if="modal.item" class="modal__body">
            <h2 class="modal__title">{{ modal.item.name }}</h2>
            <p class="modal__desc">{{ modal.item.desc }}</p>

            <!-- Größe (nur Pizza) -->
            <fieldset v-if="modal.item?.isPizza" class="option-group">
              <legend>Größe wählen</legend>
              <div class="option-row">
                <button
                  v-for="(size, i) in SIZES"
                  :key="i"
                  type="button"
                  class="option-chip"
                  :class="{ 'option-chip--active': modal.sizeIdx === i }"
                  @click="modal.sizeIdx = i"
                >
                  <span class="chip-label">{{ size.label }}</span>
                  <span class="chip-sub">{{ size.sub }}</span>
                  <span v-if="size.extra > 0" class="chip-extra">+{{ fmt(size.extra) }}</span>
                </button>
              </div>
            </fieldset>

            <!-- Teig (nur Pizza) -->
            <fieldset v-if="modal.item?.isPizza" class="option-group">
              <legend>Teig wählen</legend>
              <div class="option-row">
                <button
                  v-for="(dough, i) in DOUGHS"
                  :key="i"
                  type="button"
                  class="option-chip"
                  :class="{ 'option-chip--active': modal.doughIdx === i }"
                  @click="modal.doughIdx = i"
                >
                  <span class="chip-label">{{ dough.label }}</span>
                  <span v-if="dough.extra > 0" class="chip-extra">+{{ fmt(dough.extra) }}</span>
                </button>
              </div>
            </fieldset>

            <!-- Qty -->
            <div class="qty-row">
              <span>Anzahl</span>
              <div class="qty-ctrl">
                <button aria-label="Weniger" @click="changeQty(-1)">−</button>
                <span class="qty-display">{{ modal.qty }}</span>
                <button aria-label="Mehr" @click="changeQty(1)">+</button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal__footer">
            <div class="modal__price-wrap">
              <span class="modal__price-label">Gesamtpreis</span>
              <span class="modal__price">{{ fmt(modalTotal) }}</span>
            </div>
            <button class="btn btn--primary btn--lg" @click="confirmAdd">
              In den Warenkorb 🛒
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
$red:        #c0392b;
$red-dark:   #922b21;
$cream:      #fdf8f2;
$white:      #ffffff;
$dark:       #111111;
$muted:      #777777;
$border:     #e8e0d5;
$text:       #222222;
$transition: .3s cubic-bezier(.4, 0, .2, 1);

// ── Section ─────────────────────────────────────────────────
.catalog { background: $cream; padding: 5rem 0; }

// ── Tab bar ──────────────────────────────────────────────────
.catalog-tabs {
  display: flex; gap: .5rem;
  background: $white; border-radius: 14px;
  padding: .4rem; margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  width: fit-content;
}

.ctab {
  display: flex; align-items: center; gap: .55rem;
  padding: .7rem 1.6rem; border: none; border-radius: 10px;
  background: transparent; font-family: inherit;
  font-size: .9rem; font-weight: 600; color: $muted;
  cursor: pointer; transition: all $transition; white-space: nowrap;

  svg { opacity: .5; transition: opacity $transition; flex-shrink: 0; }
  em  {
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,.07); color: $muted;
    border-radius: 50px; font-style: normal; font-size: .68rem; font-weight: 700;
    min-width: 1.3rem; padding: .05rem .35rem; transition: all $transition;
  }
  &:hover     { color: $text; background: rgba(0,0,0,.04); }
  &:hover svg { opacity: .75; }
  &--active   {
    background: $dark; color: $white;
    box-shadow: 0 4px 14px rgba(0,0,0,.2);
    svg { opacity: 1; stroke: $white; }
    em  { background: rgba(255,255,255,.15); color: rgba(255,255,255,.8); }
  }
}

// ── Sub-filter ───────────────────────────────────────────────
.sub-tabs--show { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 2rem; }

.stab {
  background: $white; border: 2px solid $border; border-radius: 50px;
  padding: .4rem 1.1rem; font-size: .82rem; font-weight: 600;
  color: $muted; cursor: pointer; transition: all $transition; font-family: inherit;
  &:hover    { border-color: $red; color: $red; }
  &--active  { background: $red; border-color: $red; color: $white; box-shadow: 0 4px 12px rgba(192,57,43,.3); }
}

// ── Grid ─────────────────────────────────────────────────────
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
  gap: 1.75rem;
}

// ── Card ─────────────────────────────────────────────────────
.card {
  background: $white; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  transition: transform $transition, box-shadow $transition;
  display: flex; flex-direction: column;

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 60px rgba(0,0,0,.18), 0 0 0 1px rgba(192,57,43,.08);
  }
}

.card__img-wrap { position: relative; height: 200px; overflow: hidden; }

.card__img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .6s cubic-bezier(.4,0,.2,1);
  .card:hover & { transform: scale(1.08); }
}

.card__badge {
  position: absolute; top: .75rem; left: .75rem;
  background: $red; color: $white;
  font-size: .7rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: .25rem .65rem; border-radius: 50px;
  box-shadow: 0 2px 8px rgba(192,57,43,.4);
}

.card__body {
  padding: 1.25rem 1.4rem 1.4rem; flex: 1;
  display: flex; flex-direction: column;
  h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: .35rem; }
  p  { font-size: .875rem; color: $muted; flex: 1; margin-bottom: 1rem; line-height: 1.55; }
}

.card__footer {
  display: flex; align-items: center;
  justify-content: space-between; margin-top: auto; gap: .75rem;
}

.price {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: 1.15rem; color: $red;
}

.card__vol {
  display: inline-block; background: rgba(0,0,0,.06); color: $muted;
  font-size: .68rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
  padding: .15rem .5rem; border-radius: 50px; margin-left: .4rem; vertical-align: middle;
}

// ── Bestellen button (on card) ────────────────────────────────
.card__order-btn {
  display: inline-flex; align-items: center; gap: .3rem;
  background: $red; color: $white;
  border: none; border-radius: 50px;
  padding: .45rem 1.1rem;
  font-size: .82rem; font-weight: 700; font-family: inherit;
  cursor: pointer; white-space: nowrap;
  transition: background $transition, transform $transition, box-shadow $transition;
  box-shadow: 0 3px 10px rgba(192,57,43,.3);

  &:hover {
    background: $red-dark;
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(192,57,43,.4);
  }
  &:active { transform: scale(.97); }
}

// ── Tab transitions ───────────────────────────────────────────
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

.tab-fade-enter-active { transition: opacity .22s ease, transform .22s ease; }
.tab-fade-leave-active { transition: opacity .15s ease; }
.tab-fade-enter-from   { opacity: 0; transform: translateY(10px); }
.tab-fade-leave-to     { opacity: 0; }

// ── Modal backdrop ────────────────────────────────────────────
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.72);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

// ── Modal box ─────────────────────────────────────────────────
.modal {
  position: relative;
  background: $white; border-radius: 20px;
  width: min(480px, 100%); max-height: 90vh;
  overflow-y: auto; overflow-x: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,.35);
  scrollbar-width: thin;
}

.modal__close {
  position: absolute; top: 1rem; right: 1rem; z-index: 2;
  background: rgba(255,255,255,.9); border: none; border-radius: 50%;
  width: 2.2rem; height: 2.2rem;
  font-size: .9rem; color: $text;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  transition: all $transition; cursor: pointer;
  display: flex; align-items: center; justify-content: center;

  &:hover { background: $red; color: $white; transform: rotate(90deg); }
}

// ── Modal image ───────────────────────────────────────────────
.modal__img-wrap {
  position: relative; height: 220px; overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.modal__img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .4s ease;
  .modal__img-wrap:hover & { transform: scale(1.04); }
}

.modal__img-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
  background: linear-gradient(transparent, rgba(0,0,0,.35));
}

// ── Modal body ────────────────────────────────────────────────
.modal__body { padding: 1.5rem 1.75rem; }

.modal__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem; margin-bottom: .4rem;
}

.modal__desc { font-size: .9rem; color: $muted; margin-bottom: 1.25rem; }

// ── Option groups (Größe / Teig) ──────────────────────────────
.option-group {
  border: none;
  margin-bottom: 1.25rem;

  legend {
    font-size: .78rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: $muted; margin-bottom: .6rem; display: block;
  }
}

.option-row { display: flex; flex-wrap: wrap; gap: .5rem; }

.option-chip {
  display: flex; flex-direction: column; align-items: center; gap: .1rem;
  border: 2px solid $border; border-radius: 10px;
  padding: .55rem .85rem; cursor: pointer;
  transition: all $transition;
  min-width: 80px; text-align: center;
  user-select: none; background: $white;
  font-family: inherit;

  &:hover { border-color: $red; background: #fff5f4; }

  &--active {
    border-color: $red; background: #fff5f4;
    box-shadow: 0 0 0 3px rgba(192,57,43,.12);
  }
}

.chip-label { font-weight: 600; font-size: .875rem; color: $text; }
.chip-sub   { font-size: .72rem; color: $muted; }
.chip-extra { font-size: .72rem; color: $red; font-weight: 600; }

// ── Qty row ───────────────────────────────────────────────────
.qty-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 0 0;
  border-top: 1px solid $border;
  font-weight: 600;
}

.qty-ctrl {
  display: flex; align-items: center; gap: .75rem;
  border: 2px solid $border; border-radius: 50px;
  padding: .25rem .5rem;
  transition: border-color $transition;
  &:focus-within { border-color: $red; }

  button {
    background: none; border: none;
    width: 1.8rem; height: 1.8rem;
    font-size: 1.2rem; font-weight: 700; color: $red;
    border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background $transition;
    &:hover { background: rgba(192,57,43,.1); }
  }
}

.qty-display {
  font-size: 1rem; font-weight: 700;
  min-width: 1.5rem; text-align: center;
}

// ── Modal footer ──────────────────────────────────────────────
.modal__footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.75rem 1.75rem;
  border-top: 1px solid $border; gap: 1rem;
}

.modal__price-wrap { display: flex; flex-direction: column; }

.modal__price-label {
  font-size: .75rem; color: $muted;
  text-transform: uppercase; letter-spacing: .06em;
}

.modal__price {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem; font-weight: 700; color: $red;
  transition: all .2s;
}

// ── Primary button (used in modal) ────────────────────────────
.btn--primary {
  display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
  background: $red; color: $white; border: none; border-radius: 50px;
  padding: .75rem 1.5rem; font-size: .95rem; font-weight: 700; font-family: inherit;
  cursor: pointer; white-space: nowrap;
  transition: background $transition, transform $transition, box-shadow $transition;
  box-shadow: 0 4px 16px rgba(192,57,43,.35);
  &:hover  { background: $red-dark; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(192,57,43,.45); }
  &:active { transform: scale(.97); }
}

.btn--lg { padding: .85rem 1.75rem; font-size: 1rem; }

// ── Modal transition ──────────────────────────────────────────
.modal-enter-active { transition: opacity .25s ease; }
.modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }

.modal-enter-active .modal { animation: modalIn .3s cubic-bezier(.34,1.56,.64,1) both; }
.modal-leave-active .modal { animation: modalOut .2s ease both; }

@keyframes modalIn  {
  from { opacity: 0; transform: scale(.9) translateY(20px); }
  to   { opacity: 1; transform: scale(1)  translateY(0); }
}
@keyframes modalOut {
  to   { opacity: 0; transform: scale(.95) translateY(10px); }
}

// ── Responsive ────────────────────────────────────────────────
@media (max-width: 640px) {
  .catalog-tabs { width: 100%; overflow-x: auto; }
  .modal__footer { flex-direction: column; align-items: stretch; }
}
</style>
