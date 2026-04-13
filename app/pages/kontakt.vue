<script setup lang="ts">
const form = reactive({
  fname: "",
  lname: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

useSeoMeta({
  title: "Kontakt",
});
const errors = reactive<Record<string, boolean>>({});
const sent = ref(false);
const senderName = ref("");

function validate(field: string): boolean {
  const val = (form as Record<string, string>)[field];
  const ok = typeof val === "string" && val.trim() !== "";
  errors[field] = !ok;
  return ok;
}

function handleSubmit() {
  const required = ["fname", "lname", "email", "message"];
  let ok = true;
  required.forEach((f) => {
    if (!validate(f)) ok = false;
  });
  if (!ok) return;

  senderName.value = form.fname.trim();
  sent.value = true;

  if (import.meta.client) {
    nextTick(() => {
      const el = document.querySelector(".form-success") as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}

// Scroll reveal
onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
});
</script>

<template>
  <!-- ── Page Hero ── -->
  <section class="page-hero page-hero--dark">
    <div class="container">
      <nav class="breadcrumb">
        <NuxtLink to="/">Startseite</NuxtLink>
        <span>/</span>
        <span>Kontakt</span>
      </nav>
      <h1 class="reveal-up">Kontakt</h1>
      <p class="reveal-up" style="--delay: 0.15s">
        Wir freuen uns auf Ihre Nachricht oder Ihren Besuch!
      </p>
    </div>
  </section>

  <!-- ── Contact Section ── -->
  <section class="contact-page">
    <div class="container">
      <div class="contact-split reveal-up">
        <!-- Left: info panel -->
        <div class="contact-info-col">
          <div class="contact-info-col__head">
            <h2>So erreichen<br />Sie uns</h2>
            <p>
              Wir sind für Sie da – persönlich, telefonisch oder per E-Mail.
            </p>
          </div>

          <div class="contact-items">
            <div class="contact-item">
              <div class="contact-item__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div class="contact-item__text">
                <h4>Adresse</h4>
                <p>Pizzastraße 12<br />12345 Musterstadt</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  />
                </svg>
              </div>
              <div class="contact-item__text">
                <h4>Telefon</h4>
                <a href="tel:+49123456789">+49 123 456 789</a>
                <small>Auch für Tischreservierungen</small>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div class="contact-item__text">
                <h4>E-Mail</h4>
                <a href="mailto:info@labella-pizza.de">info@labella-pizza.de</a>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div class="contact-item__text">
                <h4>Öffnungszeiten</h4>
                <table class="hours-table">
                  <tbody>
                    <tr>
                      <td>Mo – Fr</td>
                      <td>11:00 – 22:00</td>
                    </tr>
                    <tr>
                      <td>Samstag</td>
                      <td>12:00 – 23:00</td>
                    </tr>
                    <tr>
                      <td>Sonntag</td>
                      <td>12:00 – 22:00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"
                  />
                  <rect width="7" height="7" x="14" y="10" rx="1" />
                  <path
                    d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
                  />
                </svg>
              </div>
              <div class="contact-item__text">
                <h4>Liefergebiet</h4>
                <p>Musterstadt &amp; Umgebung</p>
                <small>Kostenlos ab 20 € Bestellwert</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: form panel -->
        <div class="contact-form-col">
          <h2>Nachricht senden</h2>

          <form
            v-if="!sent"
            class="contact-form"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div class="form-row">
              <div class="form-group">
                <label for="fname">Vorname *</label>
                <input
                  id="fname"
                  v-model="form.fname"
                  type="text"
                  name="fname"
                  placeholder="Max"
                  autocomplete="given-name"
                  :class="{
                    'cf-error': errors.fname,
                    'cf-ok': !errors.fname && form.fname,
                  }"
                  @blur="validate('fname')"
                />
              </div>
              <div class="form-group">
                <label for="lname">Nachname *</label>
                <input
                  id="lname"
                  v-model="form.lname"
                  type="text"
                  name="lname"
                  placeholder="Mustermann"
                  autocomplete="family-name"
                  :class="{
                    'cf-error': errors.lname,
                    'cf-ok': !errors.lname && form.lname,
                  }"
                  @blur="validate('lname')"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="femail">E-Mail *</label>
                <input
                  id="femail"
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="max@beispiel.de"
                  autocomplete="email"
                  :class="{
                    'cf-error': errors.email,
                    'cf-ok': !errors.email && form.email,
                  }"
                  @blur="validate('email')"
                />
              </div>
              <div class="form-group">
                <label for="fphone">Telefon</label>
                <input
                  id="fphone"
                  v-model="form.phone"
                  type="tel"
                  name="phone"
                  placeholder="+49 123 456 789"
                  autocomplete="tel"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="subject">Betreff</label>
              <select id="subject" v-model="form.subject" name="subject">
                <option value="">Bitte wählen…</option>
                <option value="reservation">Tischreservierung</option>
                <option value="order">Bestellfrage</option>
                <option value="feedback">Feedback</option>
                <option value="catering">Catering-Anfrage</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Nachricht *</label>
              <textarea
                id="message"
                v-model="form.message"
                name="message"
                rows="5"
                placeholder="Ihre Nachricht an uns…"
                :class="{
                  'cf-error': errors.message,
                  'cf-ok': !errors.message && form.message,
                }"
                @blur="validate('message')"
              />
            </div>

            <button type="submit" class="cf-submit">Nachricht senden →</button>
          </form>

          <!-- Success state -->
          <div v-else class="form-success">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#27ae60"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Vielen Dank, <strong>{{ senderName }}</strong
            >!<br />
            Ihre Nachricht wurde gesendet. Wir melden uns innerhalb von 24
            Stunden.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Map section ── -->
  <div class="map-section">
    <div class="container map-inner">
      <div class="map-info">
        <p class="map-info__tag">Wo Sie uns finden</p>
        <h3>Besuchen Sie uns</h3>
        <p>
          Pizzastraße 12<br />
          12345 Musterstadt<br /><br />
          Mo–Fr 11:00–22:00 Uhr<br />
          Sa–So 12:00–23:00 Uhr
        </p>
        <a
          href="https://www.google.com/maps/search/Pizzastraße+12,+Musterstadt"
          target="_blank"
          rel="noopener noreferrer"
          class="cf-map-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Route planen
        </a>
      </div>

      <div class="map-visual">
        <div class="map-visual__grid" />
        <div class="map-visual__content">
          <div class="map-visual__dot" />
          <span class="map-visual__label">Pizzastraße 12, Musterstadt</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// ── Tokens ──────────────────────────────────────────────────
$red: #c0392b;
$red-dark: #922b21;
$dark: #111111;
$dark-2: #1a1a1a;
$dark-3: #222222;
$white: #ffffff;
$cream: #fdf8f2;
$text: #1a1a1a;
$muted: #777777;
$border: #e8e0d5;
$green: #27ae60;
$transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// ── Page Hero ────────────────────────────────────────────────
.page-hero {
  padding: 10rem 0 5rem;
  background: $dark;
  color: $white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        ellipse at 30% 60%,
        rgba(192, 57, 43, 0.25) 0%,
        transparent 65%
      ),
      radial-gradient(
        ellipse at 70% 40%,
        rgba(192, 57, 43, 0.15) 0%,
        transparent 55%
      );
    z-index: 1;
  }

  .container {
    position: relative;
    z-index: 2;
  }

  h1 {
    font-family: "Playfair Display", serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 0.65rem;
  }

  p {
    opacity: 0.7;
    font-size: 1.1rem;
  }
}

// ── Breadcrumb ───────────────────────────────────────────────
.breadcrumb {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.25rem;

  a {
    color: $red;
    text-decoration: none;
    transition: opacity $transition;
    &:hover {
      opacity: 0.8;
    }
  }
}

// ── Contact Section ──────────────────────────────────────────
.contact-page {
  padding: 5rem 0;
  background: #f7f4f0;
}

.contact-split {
  display: grid;
  grid-template-columns: 380px 1fr;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.14);
}

// ── Left: dark info panel ────────────────────────────────────
.contact-info-col {
  background: $dark;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;

  &__head {
    margin-bottom: 2.5rem;

    h2 {
      font-family: "Playfair Display", serif;
      font-size: 1.75rem;
      color: $white;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.45);
      line-height: 1.65;
    }
  }
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &__icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(192, 57, 43, 0.15);
    border: 1px solid rgba(192, 57, 43, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $red;
    flex-shrink: 0;
  }

  &__text {
    h4 {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.35);
      margin-bottom: 0.3rem;
    }

    p,
    a {
      font-weight: 500;
      color: $white;
      font-size: 0.95rem;
      line-height: 1.6;
      text-decoration: none;
      transition: color $transition;
    }

    a:hover {
      color: $red;
    }

    small {
      display: block;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.82rem;
      margin-top: 0.2rem;
    }
  }
}

.hours-table {
  width: 100%;
  font-size: 0.88rem;
  border-collapse: collapse;

  td {
    padding-bottom: 0.3rem;
    color: rgba(255, 255, 255, 0.65);
  }
  td:last-child {
    text-align: right;
    font-weight: 600;
    color: $white;
  }
}

// ── Right: form panel ────────────────────────────────────────
.contact-form-col {
  background: $white;
  padding: 3rem 2.5rem;

  h2 {
    font-family: "Playfair Display", serif;
    font-size: 1.75rem;
    margin-bottom: 1.75rem;
    color: $text;
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
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
      border-color: $red;
      box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 140px;
  }

  select {
    cursor: pointer;
    appearance: auto;
  }
}

.cf-error {
  border-color: $red !important;
  background: #fff8f8 !important;
}
.cf-ok {
  border-color: $green !important;
}

.cf-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: $red;
  color: $white;
  border: none;
  border-radius: 50px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all $transition;
  box-shadow: 0 4px 16px rgba(192, 57, 43, 0.35);

  &:hover {
    background: $red-dark;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(192, 57, 43, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.form-success {
  background: #d5f5e3;
  border: 2px solid $green;
  border-radius: 12px;
  padding: 1.75rem 1.5rem;
  color: #1a5632;
  font-weight: 600;
  text-align: center;
  line-height: 1.65;
  animation: revealUp 0.4s ease;

  svg {
    display: block;
    margin: 0 auto 0.75rem;
  }
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ── Map section ──────────────────────────────────────────────
.map-section {
  background: $dark-2;
  padding: 5rem 0;
}

.map-inner {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 4rem;
  align-items: center;
}

.map-info__tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: $red;
  margin-bottom: 0.75rem;
}

.map-info {
  h3 {
    font-family: "Playfair Display", serif;
    font-size: 1.8rem;
    color: $white;
    margin-bottom: 0.75rem;
    line-height: 1.25;
  }

  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    line-height: 1.75;
    margin-bottom: 1.5rem;
  }
}

.cf-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: $white;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all $transition;

  &:hover {
    border-color: $white;
    background: rgba(255, 255, 255, 0.08);
  }
}

.map-visual {
  background: $dark-3;
  border-radius: 16px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  &__dot {
    width: 18px;
    height: 18px;
    background: $red;
    border-radius: 50%;
    box-shadow:
      0 0 0 10px rgba(192, 57, 43, 0.18),
      0 0 0 22px rgba(192, 57, 43, 0.08);
    animation: pulse 2s ease-in-out infinite;
  }

  &__label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.88rem;
    margin-top: 0.25rem;
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 10px rgba(192, 57, 43, 0.18),
      0 0 0 22px rgba(192, 57, 43, 0.08);
  }
  50% {
    box-shadow:
      0 0 0 14px rgba(192, 57, 43, 0.22),
      0 0 0 30px rgba(192, 57, 43, 0.05);
  }
}

// ── Responsive ───────────────────────────────────────────────
@media (max-width: 1024px) {
  .contact-split {
    grid-template-columns: 1fr;
  }
  .map-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .map-visual {
    height: 220px;
  }
}

@media (max-width: 640px) {
  .contact-info-col,
  .contact-form-col {
    padding: 2rem 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .page-hero {
    padding: 8rem 0 4rem;
  }
}
</style>
