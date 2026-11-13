# Zebra Coffee — website

A multi-page website for **Zebra Coffee**, a specialty coffee shop on Mangilik El 38, Astana, open 24/7.
Visitors can browse the menu, build an order in a cart, book a table, read and write reviews, contact the café and apply for a job.

**Team:** Yasmina, Dana, Korkem (Astana IT University).

## Who made what

| Team member | Pages | Page CSS | Page JS |
|---|---|---|---|
| **Yasmina** | Home (`index.html`), About (`about.html`), Careers (`career.html`) | `css/homepage.css` | `js/home.js`, `js/about.js`, `js/career.js` |
| **Dana** | Menu (`menu.html`), Reviews (`reviews.html`), Cart (`cart.html`) | `css/menu.css` | `js/menu.js`, `js/reviews.js`, `js/cart-page.js` |
| **Korkem** | Booking (`booking.html`), Contacts (`contacts.html`) | `css/booking.css` | `js/booking.js`, `js/contacts.js` |
| **Shared** (all pages) | header, menu, footer, forms | `css/style.css` | `js/data.js`, `js/cart.js`, `js/main.js`, `js/forms.js` |

## Technologies

- HTML5 (semantic tags: `header`, `nav`, `main`, `section`, `aside`, `footer`, `fieldset`)
- CSS3: custom properties (`:root` colors), Flexbox/Grid, transitions, `@keyframes`, media queries
- [Bootstrap 5.3.3](https://getbootstrap.com/) (CDN): grid, navbar + collapse, Modal, Toast, Accordion, Progress, form validation classes
- [jQuery 3.7.1](https://jquery.com/) (CDN)
- Vanilla JavaScript (Careers page and the cart logic)
- `localStorage` for the cart. **No database, no backend.**

## How to run

1. Download or clone the repository.
2. Open `index.html` in a browser.
3. An internet connection is needed for Bootstrap, jQuery and the Google Fonts.

## Project structure

```
index.html  about.html  career.html      ← Yasmina
menu.html   reviews.html  cart.html      ← Dana
booking.html  contacts.html              ← Korkem

css/
  style.css      shared: colors, header, menu, buttons, cards, forms, success window, footer
  homepage.css   Yasmina: Home + About + Careers
  menu.css       Dana: Menu + Reviews + Cart
  booking.css    Korkem: Booking + Contacts

js/
  data.js        menu items, sizes, drink of the day, formatPrice(), findMenuItem()
  cart.js        cart in localStorage: getCart, saveCart, addToCart, changeQty, removeFromCart…
  main.js        cart number in the menu, "Back to top" button, showToast()
  forms.js       form checks + regular expressions, red errors, setupForm(), showSuccessModal()
  home.js  about.js  career.js           ← Yasmina
  menu.js  reviews.js  cart-page.js      ← Dana
  booking.js  contacts.js                ← Korkem

images/          photos of drinks, desserts, the café and the logo
```

Scripts are loaded in this order on every page:
jQuery → Bootstrap → `data.js` → `cart.js` → `main.js` → `forms.js` (pages with forms) → the page script.

## Pages and features

### Home — Yasmina
- Hero with a rotating italic word: *coffee for night owls → early birds → exam weeks…* (`setInterval` + CSS class)
- Running line (CSS `@keyframes`)
- "Hits right now" cards built from the menu data; the **+** button adds a drink to the cart
- Mood picker: choose a mood → two suggested drinks → "Add both to cart"
- Night Owls timer: minutes until 00:00 or until 06:00
- **Drink of the day** (changes with the day of the week) with a `ZEB-####` promo code

### About — Yasmina
- Story of the café, flip cards with numbers (2014, 24/7, <3 min, 60–65 °C, 7–21 days)
- "How a cup is born" in 4 steps
- Photo gallery: click a photo to open it in a window (Bootstrap Modal)
- "Good to know" FAQ (Bootstrap Accordion, the open question turns teal)

### Careers — Yasmina
- Vacancy cards from an array; closed roles are marked "Position filled"
- **Apply** selects the role in the form and scrolls to it
- Application form with full validation; the success window shows the estimated weekly pay (+15% for Shift Lead)

### Menu — Dana
- 21 items as cards, built from `data.js`
- Category buttons All / Hot / Cold / Desserts with counters, live search, "Nothing found" state
- Drink window: size, sugar, flavor, quantity — the price updates at once
- Add to cart → the cart number in the menu changes + a short notification

### Reviews — Dana
- Average rating, stars and 5★…1★ bars, calculated from the reviews
- Filter by rating, sort (newest / highest / lowest), first 6 reviews visible + "Show more"
- Review form with a star rating. A new review appears first **until the page is reloaded** (it is not saved)

### Cart — Dana
- Lines with − / + / delete, empty-cart state
- Progress bar to the 10% discount
- **Discounts:** the promo code gives −% on the drink of the day only; orders from 5 000 ₸ get another −10% on the rest
- Pickup form (name, phone, time from 15 minutes ahead, here / takeaway) → success window → receipt

### Booking — Korkem
- Three zones as photo cards: Main Hall, Window Side Table, Quiet Workspace Corner
- Booking form: name, email, phone, guests (1–10), date (up to 30 days ahead), time, visit type, Wi-Fi request, notes

### Contacts — Korkem
- Address (with a 2GIS link), phone and email cards
- 24/7 block with a live Astana clock (UTC+5)
- Enquiry form: topic, name, reply by email or phone, message

## Forms and validation

All 5 forms (Careers, Reviews, Booking, Contacts, Cart) work the same way through `setupForm()` in `js/forms.js`:

1. `novalidate` on the form + `event.preventDefault()` on submit — the page never reloads.
2. Every field is checked by its own rule. A wrong field gets a **red border and a red message** under it; a correct one gets a green border.
3. After the first click the form is checked again while the user types.
4. When there are no errors, a window shows a number: order `#Z-…`, application `ZC-…`, booking `ZB-…`, review `ZR-…`, message `ZM-…`.

Checks include: empty fields and fields with only spaces, letters only in names, email format, Kazakhstan phone format (`+7 7XX…` or `8 7XX…`), dates not in the past, number ranges, text length, file type and size.

## Responsive design and accessibility

- Works on phones: the menu collapses into a button, cards stack in one column.
- Real `<button>` and `<label>` elements, `aria-label` on icon buttons, `aria-live` for changing text.
- Animations turn off when the system setting "reduce motion" is on.