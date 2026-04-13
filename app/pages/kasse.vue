<script setup lang="ts">
import { useCartStore } from "~/stores/cart";
import type { CartItem } from "~/stores/cart";

useSeoMeta({
  title: "Kasse",
});

definePageMeta({ layout: false });

const cart = useCartStore();

const DELIVERY_FEE = 2.5;
const DELIVERY_FREE = 20.0;

const fmt = (n: number) => n.toFixed(2).replace(".", ",") + "\u202f€";

const deliveryMode = ref<"delivery" | "pickup">("delivery");
const paymentMode = ref<"cash" | "card" | "paypal" | "creditcard">("cash");

const showSuccess = ref(false);
const orderNum = ref("");
const successMsg = ref("");
const successItems = ref<CartItem[]>([]);
const successTotal = ref(0);
const step = ref<1 | 2 | 3>(2);

const form = reactive({
  street: "",
  houseNr: "",
  plz: "",
  city: "",
  floor: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  ccNum: "",
  ccExp: "",
  ccCvv: "",
  ccName: "",
  notes: "",
  agb: false,
});

const errors = reactive<Record<string, boolean>>({});

const subtotal = computed(() =>
  cart.items.reduce((s, i) => s + i.price * i.quantity, 0),
);
const fee = computed(() => {
  if (deliveryMode.value === "pickup" || subtotal.value >= DELIVERY_FREE)
    return 0;
  return DELIVERY_FEE;
});
const total = computed(() => subtotal.value + fee.value);

function setDelivery(mode: "delivery" | "pickup") {
  deliveryMode.value = mode;
}

function setPayment(mode: "cash" | "card" | "paypal" | "creditcard") {
  paymentMode.value = mode;
}

function formatCardNum(e: Event) {
  const el = e.target as HTMLInputElement;
  const v = el.value.replace(/\D/g, "").slice(0, 16);
  form.ccNum = v.replace(/(.{4})/g, "$1 ").trim();
  el.value = form.ccNum;
}

function formatExp(e: Event) {
  const el = e.target as HTMLInputElement;
  let v = el.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
  form.ccExp = v;
  el.value = form.ccExp;
}

function validateField(field: string): boolean {
  const val = (form as Record<string, unknown>)[field];
  const ok = typeof val === "string" && val.trim() !== "";
  errors[field] = !ok;
  return ok;
}

function validateAll(): boolean {
  const required = ["firstName", "lastName", "email", "phone"];
  if (deliveryMode.value === "delivery")
    required.push("street", "houseNr", "plz", "city");

  let ok = true;
  required.forEach((f) => {
    if (!validateField(f)) ok = false;
  });

  if (!form.agb) {
    errors.agb = true;
    ok = false;
  } else {
    delete errors.agb;
  }

  return ok;
}

function submitOrder() {
  if (!validateAll()) {
    nextTick(() => {
      const el = document.querySelector(
        ".input--error, .agb-row--error",
      ) as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }

  successItems.value = [...cart.items];
  successTotal.value = total.value;

  const num =
    "#LBP-" +
    new Date().getFullYear() +
    "-" +
    String(Math.floor(Math.random() * 9000) + 1000);
  orderNum.value = num;

  const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
  successMsg.value =
    deliveryMode.value === "delivery"
      ? `Hallo <strong>${name}</strong>, wir liefern Ihre Bestellung in ca. <strong>30 Minuten</strong> zu Ihnen.<br>Eine Bestätigung erhalten Sie per E-Mail.`
      : `Hallo <strong>${name}</strong>, Ihre Bestellung ist in ca. <strong>20 Minuten</strong> abholbereit.<br>Pizzastraße 12, 12345 Musterstadt.`;

  cart.clearCart();
  step.value = 3;
  showSuccess.value = true;

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const path = document.querySelector(
        ".success-check",
      ) as SVGPathElement | null;
      if (path) path.style.strokeDashoffset = "0";
    }, 200);
  }
}
</script>

<template>
  <div class="co-page">
    <!-- ── Header ── -->
    <header class="header scrolled">
      <div class="co-header-inner container">
        <NuxtLink to="/" class="logo">
          <span class="logo__icon">🍕</span>
          <span class="logo__text">La Bella Pizza</span>
        </NuxtLink>

        <div class="checkout-steps">
          <div class="cstep cstep--done">
            <span class="cstep__num">1</span>
            <span class="cstep__label">Warenkorb</span>
          </div>
          <div class="cstep-line" />
          <div
            class="cstep"
            :class="step > 2 ? 'cstep--done' : 'cstep--active'"
          >
            <span class="cstep__num">2</span>
            <span class="cstep__label">Kasse</span>
          </div>
          <div class="cstep-line" />
          <div class="cstep" :class="step >= 3 ? 'cstep--active' : ''">
            <span class="cstep__num">3</span>
            <span class="cstep__label">Bestätigung</span>
          </div>
        </div>

        <NuxtLink to="/#menu" class="btn btn--ghost co-back-btn"
          >← Weiter einkaufen</NuxtLink
        >
      </div>
    </header>

    <!-- ── Empty cart ── -->
    <div v-if="cart.items.length === 0 && !showSuccess" class="checkout-empty">
      <div class="container">
        <div class="empty-box">
          <div class="empty-box__icon">🛒</div>
          <h2>Ihr Warenkorb ist leer</h2>
          <p>Fügen Sie Artikel hinzu, bevor Sie zur Kasse gehen.</p>
          <NuxtLink to="/#menu" class="btn btn--primary"
            >Zur Speisekarte</NuxtLink
          >
        </div>
      </div>
    </div>

    <!-- ── Checkout main ── -->
    <main v-if="cart.items.length > 0" class="checkout-main">
      <div class="container checkout-layout">
        <!-- Left: form -->
        <div class="checkout-form-col">
          <!-- 1. Lieferart -->
          <section class="co-section">
            <h2 class="co-section__title">
              <span class="co-section__num">1</span>
              Lieferart
            </h2>
            <div class="delivery-tabs">
              <button
                class="dtv"
                :class="{ 'dtv--active': deliveryMode === 'delivery' }"
                @click="setDelivery('delivery')"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 5v3h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div>
                  <strong>Lieferung</strong>
                  <small>Ca. 30 Minuten</small>
                </div>
              </button>
              <button
                class="dtv"
                :class="{ 'dtv--active': deliveryMode === 'pickup' }"
                @click="setDelivery('pickup')"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div>
                  <strong>Abholung</strong>
                  <small>Fertig in 20 Minuten</small>
                </div>
              </button>
            </div>

            <Transition name="sf">
              <div
                v-if="deliveryMode === 'delivery'"
                key="delivery"
                class="delivery-address"
              >
                <div class="form-row">
                  <div class="form-group">
                    <label for="street">Straße *</label>
                    <input
                      id="street"
                      v-model="form.street"
                      type="text"
                      placeholder="Musterstraße"
                      :class="{
                        'input--error': errors.street,
                        'input--ok': !errors.street && form.street,
                      }"
                      @blur="validateField('street')"
                    />
                  </div>
                  <div class="form-group form-group--sm">
                    <label for="houseNr">Nr. *</label>
                    <input
                      id="houseNr"
                      v-model="form.houseNr"
                      type="text"
                      placeholder="12a"
                      :class="{
                        'input--error': errors.houseNr,
                        'input--ok': !errors.houseNr && form.houseNr,
                      }"
                      @blur="validateField('houseNr')"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group form-group--sm">
                    <label for="plz">PLZ *</label>
                    <input
                      id="plz"
                      v-model="form.plz"
                      type="text"
                      placeholder="12345"
                      maxlength="5"
                      :class="{
                        'input--error': errors.plz,
                        'input--ok': !errors.plz && form.plz,
                      }"
                      @blur="validateField('plz')"
                    />
                  </div>
                  <div class="form-group">
                    <label for="city">Stadt *</label>
                    <input
                      id="city"
                      v-model="form.city"
                      type="text"
                      placeholder="Musterstadt"
                      :class="{
                        'input--error': errors.city,
                        'input--ok': !errors.city && form.city,
                      }"
                      @blur="validateField('city')"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="floor">Etage / Klingelname</label>
                  <input
                    id="floor"
                    v-model="form.floor"
                    type="text"
                    placeholder="z. B. 3. OG, Name Müller (optional)"
                  />
                </div>
              </div>

              <div v-else key="pickup" class="pickup-info">
                <div class="info-banner">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <strong>Abholung bei uns:</strong>
                    Pizzastraße 12, 12345 Musterstadt — Mo–Fr 11–22 Uhr, Sa–So
                    12–23 Uhr
                  </div>
                </div>
              </div>
            </Transition>
          </section>

          <!-- 2. Kontaktdaten -->
          <section class="co-section">
            <h2 class="co-section__title">
              <span class="co-section__num">2</span>
              Kontaktdaten
            </h2>
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Vorname *</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  placeholder="Max"
                  autocomplete="given-name"
                  :class="{
                    'input--error': errors.firstName,
                    'input--ok': !errors.firstName && form.firstName,
                  }"
                  @blur="validateField('firstName')"
                />
              </div>
              <div class="form-group">
                <label for="lastName">Nachname *</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  placeholder="Mustermann"
                  autocomplete="family-name"
                  :class="{
                    'input--error': errors.lastName,
                    'input--ok': !errors.lastName && form.lastName,
                  }"
                  @blur="validateField('lastName')"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="email">E-Mail *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="max@beispiel.de"
                  autocomplete="email"
                  :class="{
                    'input--error': errors.email,
                    'input--ok': !errors.email && form.email,
                  }"
                  @blur="validateField('email')"
                />
              </div>
              <div class="form-group">
                <label for="phone">Telefon *</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+49 123 456 789"
                  autocomplete="tel"
                  :class="{
                    'input--error': errors.phone,
                    'input--ok': !errors.phone && form.phone,
                  }"
                  @blur="validateField('phone')"
                />
              </div>
            </div>
          </section>

          <!-- 3. Zahlungsart -->
          <section class="co-section">
            <h2 class="co-section__title">
              <span class="co-section__num">3</span>
              Zahlungsart
            </h2>
            <div class="payment-grid">
              <label
                class="payment-card"
                :class="{ 'payment-card--active': paymentMode === 'cash' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  :checked="paymentMode === 'cash'"
                  @change="setPayment('cash')"
                />
                <div class="payment-card__inner">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  <div>
                    <strong>Barzahlung</strong
                    ><small>Bei Lieferung / Abholung</small>
                  </div>
                  <span class="payment-card__check">✓</span>
                </div>
              </label>

              <label
                class="payment-card"
                :class="{ 'payment-card--active': paymentMode === 'card' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  :checked="paymentMode === 'card'"
                  @change="setPayment('card')"
                />
                <div class="payment-card__inner">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <div>
                    <strong>EC-Karte</strong><small>Girocard / Maestro</small>
                  </div>
                  <span class="payment-card__check">✓</span>
                </div>
              </label>

              <label
                class="payment-card"
                :class="{ 'payment-card--active': paymentMode === 'paypal' }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  :checked="paymentMode === 'paypal'"
                  @change="setPayment('paypal')"
                />
                <div class="payment-card__inner">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path d="M7 11C7 11 6 17 13 17H17L19 7H14C9 7 7 11 7 11z" />
                    <path
                      d="M4 16C4 16 3 22 10 22H14L16 12H11C6 12 4 16 4 16z"
                    />
                  </svg>
                  <div>
                    <strong>PayPal</strong><small>Schnell &amp; sicher</small>
                  </div>
                  <span class="payment-card__check">✓</span>
                </div>
              </label>

              <label
                class="payment-card"
                :class="{
                  'payment-card--active': paymentMode === 'creditcard',
                }"
              >
                <input
                  type="radio"
                  name="payment"
                  value="creditcard"
                  :checked="paymentMode === 'creditcard'"
                  @change="setPayment('creditcard')"
                />
                <div class="payment-card__inner">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                    <line x1="5" y1="15" x2="9" y2="15" />
                    <line x1="12" y1="15" x2="14" y2="15" />
                  </svg>
                  <div>
                    <strong>Kreditkarte</strong><small>Visa / Mastercard</small>
                  </div>
                  <span class="payment-card__check">✓</span>
                </div>
              </label>
            </div>

            <Transition name="sf">
              <div v-if="paymentMode === 'creditcard'" class="cc-fields">
                <div class="form-group">
                  <label for="ccNum">Kartennummer</label>
                  <input
                    id="ccNum"
                    type="text"
                    :value="form.ccNum"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    @input="formatCardNum"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="ccExp">Gültig bis</label>
                    <input
                      id="ccExp"
                      type="text"
                      :value="form.ccExp"
                      placeholder="MM / JJ"
                      maxlength="7"
                      @input="formatExp"
                    />
                  </div>
                  <div class="form-group">
                    <label for="ccCvv">CVV</label>
                    <input
                      id="ccCvv"
                      v-model="form.ccCvv"
                      type="text"
                      placeholder="123"
                      maxlength="3"
                    />
                  </div>
                  <div class="form-group">
                    <label for="ccName">Name auf der Karte</label>
                    <input
                      id="ccName"
                      v-model="form.ccName"
                      type="text"
                      placeholder="MAX MUSTERMANN"
                    />
                  </div>
                </div>
              </div>
            </Transition>
          </section>

          <!-- 4. Anmerkungen -->
          <section class="co-section">
            <h2 class="co-section__title">
              <span class="co-section__num">4</span>
              Anmerkungen <span class="co-section__optional">optional</span>
            </h2>
            <div class="form-group">
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                placeholder="z. B. keine Zwiebeln, bitte klingeln bei Müller …"
              />
            </div>
          </section>

          <!-- Mobile submit -->
          <div class="co-submit-mobile">
            <div class="agb-row" :class="{ 'agb-row--error': errors.agb }">
              <input id="agbMobile" v-model="form.agb" type="checkbox" />
              <label for="agbMobile"
                >Ich akzeptiere die <a href="#">AGB</a> und
                <a href="#">Datenschutzbestimmungen</a>.</label
              >
            </div>
            <button
              class="btn btn--primary btn--full btn--lg"
              @click="submitOrder"
            >
              Jetzt kostenpflichtig bestellen →
            </button>
          </div>
        </div>

        <!-- Right: Order summary -->
        <aside class="checkout-summary">
          <div class="summary-inner">
            <h3 class="summary-title">Bestellübersicht</h3>

            <ul class="summary-list">
              <li
                v-for="item in cart.items"
                :key="item.id"
                class="summary-item"
              >
                <div class="summary-item__info">
                  <span class="summary-item__name">{{ item.name }}</span>
                  <span class="summary-item__meta">×{{ item.quantity }}</span>
                </div>
                <div class="summary-item__right">
                  <span class="summary-item__price">{{
                    fmt(item.price * item.quantity)
                  }}</span>
                  <button
                    class="summary-item__rm"
                    :aria-label="`${item.name} entfernen`"
                    @click="cart.removeItem(item.id)"
                  >
                    ✕
                  </button>
                </div>
              </li>
            </ul>

            <NuxtLink to="/#menu" class="summary-add-link"
              >+ Weitere Artikel hinzufügen</NuxtLink
            >

            <div class="summary-calc">
              <div class="calc-row">
                <span>Zwischensumme</span>
                <span>{{ fmt(subtotal) }}</span>
              </div>
              <template v-if="deliveryMode === 'pickup'">
                <div class="calc-row">
                  <span>Abholung</span><span class="calc-free">Kostenlos</span>
                </div>
              </template>
              <template v-else-if="subtotal >= DELIVERY_FREE">
                <div class="calc-row">
                  <span>Liefergebühr</span>
                  <span class="calc-free"
                    >Kostenlos ab {{ fmt(DELIVERY_FREE) }}</span
                  >
                </div>
              </template>
              <template v-else>
                <div class="calc-row">
                  <span>Liefergebühr</span><span>{{ fmt(DELIVERY_FEE) }}</span>
                </div>
                <div class="calc-hint">
                  Kostenlos ab {{ fmt(DELIVERY_FREE) }}
                </div>
              </template>
              <div class="calc-row calc-row--total">
                <span>Gesamtbetrag</span>
                <span>{{ fmt(total) }}</span>
              </div>
            </div>

            <div class="agb-row" :class="{ 'agb-row--error': errors.agb }">
              <input id="agb" v-model="form.agb" type="checkbox" />
              <label for="agb"
                >Ich akzeptiere die <a href="#">AGB</a> und
                <a href="#">Datenschutz&shy;bestimmungen</a>.</label
              >
            </div>

            <button
              class="btn btn--primary btn--full btn--lg"
              @click="submitOrder"
            >
              Jetzt kostenpflichtig bestellen →
            </button>

            <div class="summary-trust">
              <span>🔒 SSL-verschlüsselt</span>
              <span>🍕 Frisch geliefert</span>
              <span>✅ Sicher &amp; einfach</span>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- ── Success screen ── -->
    <Transition name="success-fade">
      <div v-if="showSuccess" class="order-success">
        <div class="success-card">
          <div class="success-icon">
            <svg viewBox="0 0 52 52" fill="none">
              <circle
                cx="26"
                cy="26"
                r="25"
                stroke="#c0392b"
                stroke-width="2"
              />
              <path
                d="M14 27l8 8 16-16"
                stroke="#c0392b"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="success-check"
              />
            </svg>
          </div>
          <h2>Bestellung eingegangen!</h2>
          <p class="success-order-num">
            Bestellnummer: <strong>{{ orderNum }}</strong>
          </p>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="success-msg" v-html="successMsg" />
          <div class="success-summary">
            <div
              v-for="item in successItems"
              :key="item.id"
              class="success-item"
            >
              <span
                >{{ item.name }} <em>×{{ item.quantity }}</em></span
              >
              <span>{{ fmt(item.price * item.quantity) }}</span>
            </div>
            <div class="success-total">
              <span>Gesamtbetrag</span>
              <span>{{ fmt(successTotal) }}</span>
            </div>
          </div>
          <NuxtLink to="/" class="btn btn--primary"
            >Zurück zur Startseite</NuxtLink
          >
        </div>
      </div>
    </Transition>

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <NuxtLink to="/" class="logo" style="margin-bottom: 0.5rem">
            <span class="logo__icon">🍕</span>
            <span class="logo__text">La Bella Pizza</span>
          </NuxtLink>
          <p>Pizzastraße 12, 12345 Musterstadt</p>
        </div>
        <nav class="footer__nav">
          <NuxtLink to="/">Speisekarte</NuxtLink>
          <NuxtLink to="/about">Über uns</NuxtLink>
          <NuxtLink to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="footer__hours">
          <strong>Öffnungszeiten</strong>
          <span>Mo–Fr 11:00–22:00</span>
          <span>Sa–So 12:00–23:00</span>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          © {{ new Date().getFullYear() }} La Bella Pizza
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
// ── Tokens ──────────────────────────────────────────────────
$red: #c0392b;
$red-dark: #922b21;
$dark: #111111;
$white: #ffffff;
$cream: #fdf8f2;
$text: #1a1a1a;
$muted: #777777;
$border: #e8e0d5;
$green: #27ae60;
$transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// ── Page shell ───────────────────────────────────────────────
.co-page {
  background: #f7f4f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  > .footer {
    margin-top: auto;
  }
}

// ── Header (reuses global .header classes) ───────────────────
.co-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.co-back-btn {
  border-color: rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
  white-space: nowrap;
}

// ── Checkout steps ───────────────────────────────────────────
.checkout-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cstep {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}

.cstep__num {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  transition: all $transition;
}

.cstep--active {
  color: $white;
  .cstep__num {
    border-color: $red;
    background: $red;
  }
}

.cstep--done {
  color: rgba(255, 255, 255, 0.55);
  .cstep__num {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
}

.cstep-line {
  width: 2rem;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

// ── Empty cart ───────────────────────────────────────────────
.checkout-empty {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 5rem 0;
}

.empty-box {
  text-align: center;
  max-width: 420px;
  margin: 0 auto;
  background: $white;
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.12);

  &__icon {
    font-size: 3.5rem;
    margin-bottom: 1.25rem;
  }

  h2 {
    font-family: "Playfair Display", serif;
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    color: $dark;
  }

  p {
    color: $muted;
    margin-bottom: 1.5rem;
  }
}

// ── Main layout ──────────────────────────────────────────────
.checkout-main {
  padding: 3rem 0 5rem;
  flex: 1;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

// ── Form column ──────────────────────────────────────────────
.checkout-form-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.co-section {
  background: $white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.co-section__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: "Playfair Display", serif;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: $dark;
}

.co-section__num {
  width: 1.8rem;
  height: 1.8rem;
  background: $dark;
  color: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  flex-shrink: 0;
}

.co-section__optional {
  font-family: "Inter", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: $muted;
  margin-left: 0.25rem;
}

// ── Delivery tabs ────────────────────────────────────────────
.delivery-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.dtv {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.25rem;
  border: 2px solid $border;
  border-radius: 12px;
  background: $white;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all $transition;

  svg {
    flex-shrink: 0;
    color: $muted;
    transition: color $transition;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
  strong {
    font-size: 0.9rem;
    font-weight: 700;
    color: $text;
    display: block;
  }
  small {
    font-size: 0.75rem;
    color: $muted;
  }

  &:hover {
    border-color: $dark;
  }

  &--active {
    border-color: $dark;
    background: $dark;

    svg {
      color: rgba(255, 255, 255, 0.7);
    }
    strong {
      color: $white;
    }
    small {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

// ── Address / pickup info ────────────────────────────────────
.delivery-address {
  animation: revealUp 0.3s ease;
}

.info-banner {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  background: $cream;
  border: 1px solid $border;
  border-left: 3px solid $red;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.6;
  animation: revealUp 0.3s ease;

  svg {
    flex-shrink: 0;
    margin-top: 0.15rem;
    color: $red;
  }
}

// ── Form elements ────────────────────────────────────────────
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &--sm {
    flex: 0 0 120px;
  }

  label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: $muted;
  }

  input,
  select,
  textarea {
    border: 2px solid $border;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-family: inherit;
    color: $text;
    background: $white;
    transition:
      border-color $transition,
      box-shadow $transition;
    width: 100%;

    &:focus {
      outline: none;
      border-color: $dark;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
    }
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }
}

.input--error {
  border-color: $red !important;
  background: #fff8f8 !important;
}
.input--ok {
  border-color: $green !important;
}

// ── Payment cards ────────────────────────────────────────────
.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.payment-card {
  cursor: pointer;

  input {
    display: none;
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    border: 2px solid $border;
    border-radius: 12px;
    transition: all $transition;
    position: relative;

    svg {
      color: $muted;
      flex-shrink: 0;
      transition: color $transition;
    }
    div {
      flex: 1;
    }
    strong {
      font-size: 0.875rem;
      font-weight: 700;
      display: block;
    }
    small {
      font-size: 0.75rem;
      color: $muted;
    }
  }

  &__check {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: 2px solid $border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    color: transparent;
    flex-shrink: 0;
    transition: all $transition;
  }

  &:hover &__inner {
    border-color: $dark;
  }

  &--active &__inner {
    border-color: $dark;
    background: #f8f8f8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &--active &__check {
    background: $dark;
    border-color: $dark;
    color: $white;
  }

  &--active &__inner svg {
    color: $dark;
  }
}

// ── Credit card fields ───────────────────────────────────────
.cc-fields {
  margin-top: 1.25rem;
  padding: 1.25rem;
  background: $cream;
  border-radius: 12px;
  border: 1px solid $border;
  animation: revealUp 0.3s ease;
}

// ── AGB row ──────────────────────────────────────────────────
.agb-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 0.83rem;
  color: $muted;
  line-height: 1.55;
  padding: 0.25rem 0;

  input[type="checkbox"] {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: $dark;
    flex-shrink: 0;
    margin-top: 0.15rem;
    cursor: pointer;
  }

  a {
    color: $red;
    text-decoration: underline;
  }

  &--error {
    animation: shake 0.35s ease;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

// ── Mobile submit ────────────────────────────────────────────
.co-submit-mobile {
  background: $white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: none;
  flex-direction: column;
  gap: 1rem;
}

// ── Order summary (right) ────────────────────────────────────
.checkout-summary {
  position: sticky;
  top: 88px;
}

.summary-inner {
  background: $dark;
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3);
}

.summary-title {
  font-family: "Playfair Display", serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: $white;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.summary-item {
  display: flex;
  gap: 0.85rem;
  align-items: center;

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__name {
    font-size: 0.88rem;
    font-weight: 600;
    color: $white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: 0.73rem;
    color: rgba(255, 255, 255, 0.35);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__price {
    font-size: 0.9rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
  }

  &__rm {
    background: rgba(255, 255, 255, 0.07);
    border: none;
    color: rgba(255, 255, 255, 0.3);
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all $transition;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(192, 57, 43, 0.3);
      color: #ff9090;
    }
  }
}

.summary-add-link {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color $transition;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
}

.summary-calc {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.85rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);

  &--total {
    font-size: 1.05rem;
    font-weight: 700;
    color: $white;
    margin-top: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.calc-free {
  color: #6dda8f;
  font-weight: 600;
}
.calc-hint {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.25);
  text-align: right;
}

.summary-inner .agb-row {
  color: rgba(255, 255, 255, 0.35);

  a {
    color: rgba(255, 255, 255, 0.55);
  }
  input[type="checkbox"] {
    accent-color: $red;
  }
}

.summary-trust {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.25);
  flex-wrap: wrap;
  gap: 0.3rem;
}

// ── Buttons (self-contained for this page) ───────────────────
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all $transition;
  border: 2px solid transparent;

  &--primary {
    background: $red;
    color: $white;
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(192, 57, 43, 0.35);

    &:hover {
      background: $red-dark;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(192, 57, 43, 0.4);
    }
  }

  &--ghost {
    background: transparent;
    color: $white;
    border-color: rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1.1rem;
    font-size: 0.85rem;

    &:hover {
      border-color: $white;
    }
  }

  &--full {
    width: 100%;
  }

  &--lg {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
  }
}

// ── Success screen ───────────────────────────────────────────
.order-success {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.success-card {
  background: $white;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 32px 96px rgba(0, 0, 0, 0.3);
  animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;

  svg {
    width: 100%;
    height: 100%;
  }
}

.success-check {
  stroke-dasharray: 35;
  stroke-dashoffset: 35;
  transition: stroke-dashoffset 0.6s ease 0.2s;
}

.success-card h2 {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: $dark;
}

.success-order-num {
  font-size: 0.875rem;
  color: $muted;
  margin-bottom: 0.75rem;
}
.success-msg {
  font-size: 0.9rem;
  color: $muted;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.success-summary {
  background: $cream;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.success-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  em {
    color: $muted;
    font-style: normal;
  }
}

.success-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.95rem;
  padding-top: 0.5rem;
  border-top: 1px solid $border;
  margin-top: 0.25rem;
}

// ── Success transition ───────────────────────────────────────
.success-fade-enter-active {
  animation: fadeIn 0.4s ease;
}
.success-fade-leave-active {
  animation: fadeIn 0.3s ease reverse;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// ── Section toggle transition ────────────────────────────────
.sf-enter-active,
.sf-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.sf-enter-from,
.sf-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ── Header & Footer shared styles (self-contained) ───────────
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 900;
  transition:
    background $transition,
    box-shadow $transition;

  &.scrolled {
    background: rgba(17, 17, 17, 0.95);
    backdrop-filter: blur(16px);
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.4);
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $white;
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-weight: 700;
  flex-shrink: 0;
  text-decoration: none;

  &__icon {
    font-size: 1.6rem;
  }
}

.footer {
  background: #0d0d0d;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 3rem;
    align-items: start;
  }

  &__brand {
    .logo {
      color: $white;
    }
    p {
      margin-top: 0.35rem;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    a {
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color $transition;
      &:hover {
        color: $white;
      }
    }
  }

  &__hours {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    strong {
      color: $white;
      display: block;
      margin-bottom: 0.25rem;
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.25rem 0;
    text-align: center;
    font-size: 0.8rem;
  }
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 960px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
  .checkout-summary {
    display: none;
  }
  .co-submit-mobile {
    display: flex;
  }
  .cstep__label {
    display: none;
  }
}

@media (max-width: 640px) {
  .co-header-inner {
    padding: 0 1rem;
  }
  .co-back-btn {
    display: none;
  }
  .co-section {
    padding: 1.5rem;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .form-group--sm {
    flex: unset;
  }
  .payment-grid {
    grid-template-columns: 1fr 1fr;
  }
  .success-card {
    padding: 2rem 1.5rem;
  }
}
</style>
