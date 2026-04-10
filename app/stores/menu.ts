import { defineStore } from 'pinia'

export interface Pizza {
  id:    number
  name:  string
  desc:  string
  base:  number
  badge: string | null
  img:   string
}

export interface Salad {
  id:    number
  name:  string
  desc:  string
  price: number
  badge: string | null
  img:   string
}

export type DrinkCat = 'soft' | 'alco' | 'hot'

export interface Drink {
  id:       number
  name:     string
  desc:     string
  price:    number
  vol:      string
  cat:      DrinkCat
  catLabel: string
  img:      string
}

export type TabKey = 'pizza' | 'salad' | 'drink'

const PIZZAS: Pizza[] = [
  {
    id: 1001, name: 'Margherita',
    desc:  'Tomatensoße, Mozzarella di Bufala, frisches Basilikum',
    base:  8.90, badge: 'Klassiker',
    img:   'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80&fit=crop',
  },
  {
    id: 1002, name: 'Salami Piccante',
    desc:  'Tomatensoße, Mozzarella, scharfe Salami, Chili, Parmesan',
    base:  10.50, badge: 'Beliebt',
    img:   'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80&fit=crop',
  },
  {
    id: 1003, name: 'Funghi',
    desc:  'Tomatensoße, Mozzarella, frische Champignons, Thymian',
    base:  10.90, badge: null,
    img:   'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80&fit=crop',
  },
  {
    id: 1004, name: 'Quattro Formaggi',
    desc:  'Mozzarella, Gorgonzola, Parmesan, Provolone, frischer Oregano',
    base:  12.90, badge: 'Chef-Empfehlung',
    img:   'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&fit=crop',
  },
  {
    id: 1005, name: 'Hawaii',
    desc:  'Tomatensoße, Mozzarella, gekochter Schinken, frische Ananas',
    base:  11.50, badge: null,
    img:   'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80&fit=crop',
  },
  {
    id: 1006, name: 'Vegetariana',
    desc:  'Tomatensoße, Mozzarella, Paprika, Zucchini, Oliven, Rucola',
    base:  11.90, badge: 'Vegan möglich',
    img:   'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&fit=crop',
  },
]

const SALADS: Salad[] = [
  {
    id: 2001, name: 'Caesar Salat',
    desc:  'Römersalat, Parmesan, Croutons, Caesar-Dressing',
    price: 8.90, badge: 'Klassiker',
    img:   'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80&fit=crop',
  },
  {
    id: 2002, name: 'Griechischer Salat',
    desc:  'Tomaten, Gurke, Oliven, Feta, rote Zwiebeln, Oregano',
    price: 9.50, badge: null,
    img:   'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&fit=crop',
  },
  {
    id: 2003, name: 'Caprese',
    desc:  'Tomaten, Büffelmozzarella, Basilikum, Olivenöl extra vergine',
    price: 9.90, badge: 'Beliebt',
    img:   'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80&fit=crop',
  },
  {
    id: 2004, name: 'Rucola Salat',
    desc:  'Rucola, Kirschtomaten, Parmesan, Pinienkerne, Balsamico',
    price: 8.50, badge: null,
    img:   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop',
  },
]

const DRINKS: Drink[] = [
  {
    id: 3001, name: 'Cola / Fanta / Sprite',
    desc: '0,5 l Flasche, eiskalt', price: 2.90, vol: '0,5 l',
    cat: 'soft', catLabel: 'Alkoholfrei',
    img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80&fit=crop',
  },
  {
    id: 3002, name: 'Mineralwasser',
    desc: 'Still oder sprudelnd, 0,5 l', price: 2.50, vol: '0,5 l',
    cat: 'soft', catLabel: 'Alkoholfrei',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80&fit=crop',
  },
  {
    id: 3003, name: 'Orangensaft',
    desc: 'Frisch gepresst, 0,3 l', price: 3.50, vol: '0,3 l',
    cat: 'soft', catLabel: 'Alkoholfrei',
    img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80&fit=crop',
  },
  {
    id: 3004, name: 'Cappuccino',
    desc: 'Espresso mit aufgeschäumter Milch', price: 3.20, vol: '200 ml',
    cat: 'hot', catLabel: 'Heiß',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&fit=crop',
  },
  {
    id: 3005, name: 'Espresso',
    desc: 'Doppelter Espresso, stark & aromatisch', price: 2.50, vol: '60 ml',
    cat: 'hot', catLabel: 'Heiß',
    img: 'https://images.unsplash.com/photo-1597284237773-0ac491099f28?w=400&q=80&fit=crop',
  },
  {
    id: 3006, name: 'Bier vom Fass',
    desc: 'Frisches Lagerbier, 0,5 l', price: 3.90, vol: '0,5 l',
    cat: 'alco', catLabel: 'Alkoholisch',
    img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80&fit=crop',
  },
  {
    id: 3007, name: 'Rotwein',
    desc: "Montepulciano d'Abruzzo, 0,2 l", price: 5.90, vol: '0,2 l',
    cat: 'alco', catLabel: 'Alkoholisch',
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80&fit=crop',
  },
  {
    id: 3008, name: 'Weißwein',
    desc: 'Pinot Grigio, frisch & trocken, 0,2 l', price: 5.90, vol: '0,2 l',
    cat: 'alco', catLabel: 'Alkoholisch',
    img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80&fit=crop',
  },
]

export const useMenuStore = defineStore('menu', {
  state: () => ({
    activeTab:         'pizza' as TabKey,
    activeDrinkFilter: 'all'   as string,
    pizzas:  PIZZAS,
    salads:  SALADS,
    drinks:  DRINKS,
  }),
  getters: {
    filteredDrinks: (state): Drink[] =>
      state.activeDrinkFilter === 'all'
        ? state.drinks
        : state.drinks.filter((d) => d.cat === state.activeDrinkFilter),
  },
  actions: {
    setTab(tab: TabKey) {
      this.activeTab = tab
    },
    setDrinkFilter(filter: string) {
      this.activeDrinkFilter = filter
    },
  },
})
