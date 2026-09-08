/* ==========================================================================
   KAIZO — app.js
   All state is kept in memory for the browsing session (no localStorage/
   sessionStorage is used). If you deploy this site on your own server,
   you can safely add localStorage persistence to the cart — see the
   NOTE near `state.cart` below.
   ========================================================================== */

/* ---------------- Product catalogue ---------------- */
const PRODUCTS = [
  { id: 'p1', name: 'Momentum Hoodie', category: 'Hoodies', price: 2499,
    colors: ['#000000', '#d4ff3f', '#efefec'], sizes: ['S','M','L','XL'],
    desc: 'Heavyweight brushed fleece hoodie with a dropped shoulder seam for a cleaner range of motion.' },
  { id: 'p2', name: 'Flux Tee', category: 'Tees', price: 899,
    colors: ['#000000', '#efefec', '#3a3a3a'], sizes: ['S','M','L','XL'],
    desc: 'Lightweight performance tee in a mid-weight cotton blend, cut for layering.' },
  { id: 'p3', name: 'Drift Joggers', category: 'Joggers', price: 1799,
    colors: ['#000000', '#6b6b6b'], sizes: ['S','M','L','XL'],
    desc: 'Tapered joggers with a brushed interior and zip-secured side pockets.' },
  { id: 'p4', name: 'Pulse Jacket', category: 'Jackets', price: 3499,
    colors: ['#000000', '#d4ff3f'], sizes: ['S','M','L','XL'],
    desc: 'Windproof shell jacket with taped seams, built for changeable weather.' },
  { id: 'p5', name: 'Change Tee', category: 'Tees', price: 949,
    colors: ['#d4ff3f', '#000000'], sizes: ['S','M','L','XL'],
    desc: 'Graphic tee carrying the Kaizo wordmark across the chest in a raised print.' },
  { id: 'p6', name: 'Kinetic Shorts', category: 'Shorts', price: 1199,
    colors: ['#000000', '#efefec'], sizes: ['S','M','L','XL'],
    desc: 'Four-way stretch training shorts with a zip-secure back pocket.' },
  { id: 'p7', name: 'Reform Cap', category: 'Caps', price: 599,
    colors: ['#000000', '#d4ff3f'], sizes: ['One Size'],
    desc: 'Structured six-panel cap with an embroidered Kaizo mark and adjustable strap.' },
  { id: 'p8', name: 'Surge Hoodie', category: 'Hoodies', price: 2699,
    colors: ['#6b6b6b', '#000000'], sizes: ['S','M','L','XL'],
    desc: 'Oversized fit hoodie in a heavier 400gsm fleece with a kangaroo pocket.' },
  { id: 'p9', name: 'Evolve Joggers', category: 'Joggers', price: 1899,
    colors: ['#efefec', '#000000'], sizes: ['S','M','L','XL'],
    desc: 'Relaxed-fit joggers with an elasticated, drawcord waistband and ribbed cuffs.' },
];

const GARMENT_CLASS = {
  Hoodies: 'garment-hoodie', Tees: 'garment-tee', Joggers: 'garment-jogger',
  Jackets: 'garment-jacket', Shorts: 'garment-shorts', Caps: 'garment-cap'
};

/* ---------------- In-memory state ---------------- */
// NOTE: `cart` intentionally lives only in memory for this preview.
// For a real deployment, you can persist it with localStorage, e.g.:
//   localStorage.setItem('kaizo_cart', JSON.stringify(state.cart))
const state = {
  cart: [],           // { productId, size, color, qty }
  activeFilter: 'All',
  quickViewProduct: null,
  quickViewSize: null,
  quickViewColor: null,
};

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

function garmentEl(category, color){
  const div = document.createElement('div');
  div.className = 'garment ' + (GARMENT_CLASS[category] || 'garment-tee');
  div.style.background = color;
  return div;
}

/* ---------------- Rendering: product grid ---------------- */
function renderGrid(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  const list = state.activeFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === state.activeFilter);

  if(list.length === 0){
    grid.innerHTML = '<p style="color:#6b6b6b">No products in this category yet.</p>';
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const media = document.createElement('div');
    media.className = 'product-media';
    media.style.background = '#f7f7f5';
    media.appendChild(garmentEl(p.category, p.colors[0]));

    const quickAdd = document.createElement('button');
    quickAdd.className = 'quick-add';
    quickAdd.textContent = 'Quick View';
    quickAdd.addEventListener('click', (e) => { e.stopPropagation(); openQuickView(p.id); });
    media.appendChild(quickAdd);

    const info = document.createElement('div');
    info.className = 'product-info';
    info.innerHTML = `
      <span class="product-cat">${p.category}</span>
      <span class="product-name">${p.name}</span>
      <span class="product-price">${fmt(p.price)}</span>
    `;
    const dots = document.createElement('div');
    dots.className = 'color-dots';
    p.colors.forEach(c => {
      const d = document.createElement('span');
      d.className = 'color-dot';
      d.style.background = c;
      dots.appendChild(d);
    });
    info.appendChild(dots);

    card.appendChild(media);
    card.appendChild(info);
    card.addEventListener('click', () => openQuickView(p.id));
    grid.appendChild(card);
  });
}

/* ---------------- Filters ---------------- */
document.getElementById('filterBar').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if(!btn) return;
  setFilter(btn.dataset.filter);
});

function setFilter(filter){
  state.activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === filter);
  });
  renderGrid();
}

/* ---------------- Nav routing (single page, smooth-scroll) ---------------- */
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.dataset.nav;
    if(el.dataset.filter) setFilter(el.dataset.filter);
    document.getElementById(target)?.scrollIntoView({ behavior:'smooth' });
    document.getElementById('mainNav').classList.remove('open');
  });
});

document.querySelectorAll('[data-static]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('This page is a placeholder — wire it up when you deploy.');
  });
});

/* Mobile menu */
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

/* ---------------- Quick View modal ---------------- */
function openQuickView(productId){
  const p = PRODUCTS.find(x => x.id === productId);
  if(!p) return;
  state.quickViewProduct = p;
  state.quickViewSize = p.sizes[0];
  state.quickViewColor = p.colors[0];
  renderQuickView();
  document.getElementById('quickViewOverlay').classList.add('open');
}

function renderQuickView(){
  const p = state.quickViewProduct;
  const qv = document.getElementById('quickView');
  qv.innerHTML = `
    <button class="modal-close" id="qvClose" aria-label="Close">&times;</button>
    <div class="qv-media"></div>
    <div class="qv-info">
      <span class="product-cat">${p.category}</span>
      <h3>${p.name}</h3>
      <span class="qv-price">${fmt(p.price)}</span>
      <p class="qv-desc">${p.desc}</p>
      <div class="qv-block">
        <span class="qv-label">Colour</span>
        <div class="qv-colors" id="qvColors"></div>
      </div>
      <div class="qv-block">
        <span class="qv-label">Size</span>
        <div class="size-options" id="qvSizes"></div>
      </div>
      <button class="btn btn-primary btn-full" id="qvAddBtn">Add to Bag</button>
    </div>
  `;
  qv.querySelector('.qv-media').appendChild(garmentEl(p.category, state.quickViewColor));

  const colorsWrap = qv.querySelector('#qvColors');
  p.colors.forEach(c => {
    const dot = document.createElement('button');
    dot.className = 'qv-color' + (c === state.quickViewColor ? ' selected' : '');
    dot.style.background = c;
    dot.setAttribute('aria-label', 'Select colour');
    dot.addEventListener('click', () => {
      state.quickViewColor = c;
      renderQuickView();
    });
    colorsWrap.appendChild(dot);
  });

  const sizesWrap = qv.querySelector('#qvSizes');
  p.sizes.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'size-opt' + (s === state.quickViewSize ? ' selected' : '');
    btn.textContent = s;
    btn.addEventListener('click', () => {
      state.quickViewSize = s;
      renderQuickView();
    });
    sizesWrap.appendChild(btn);
  });

  qv.querySelector('#qvClose').addEventListener('click', closeQuickView);
  qv.querySelector('#qvAddBtn').addEventListener('click', () => {
    addToCart(p.id, state.quickViewSize, state.quickViewColor);
    closeQuickView();
    openCart();
  });
}

function closeQuickView(){
  document.getElementById('quickViewOverlay').classList.remove('open');
}
document.getElementById('quickViewOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'quickViewOverlay') closeQuickView();
});

/* ---------------- Cart ---------------- */
function addToCart(productId, size, color){
  const existing = state.cart.find(i => i.productId === productId && i.size === size && i.color === color);
  if(existing){ existing.qty += 1; }
  else{ state.cart.push({ productId, size, color, qty: 1 }); }
  renderCart();
  showToast('Added to your bag.');
}

function changeQty(index, delta){
  const item = state.cart[index];
  item.qty += delta;
  if(item.qty <= 0) state.cart.splice(index, 1);
  renderCart();
}

function removeItem(index){
  state.cart.splice(index, 1);
  renderCart();
}

function cartTotal(){
  return state.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.productId);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderCart(){
  const wrap = document.getElementById('cartItems');
  const count = state.cart.reduce((n, i) => n + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  if(state.cart.length === 0){
    wrap.innerHTML = '<p class="cart-empty">Your bag is empty. Go find something worth changing into.</p>';
  } else {
    wrap.innerHTML = '';
    state.cart.forEach((item, index) => {
      const p = PRODUCTS.find(x => x.id === item.productId);
      if(!p) return;
      const row = document.createElement('div');
      row.className = 'cart-item';
      const media = document.createElement('div');
      media.className = 'cart-item-media';
      media.appendChild(garmentEl(p.category, item.color));
      const info = document.createElement('div');
      info.className = 'cart-item-info';
      info.innerHTML = `
        <span class="cart-item-name">${p.name}</span>
        <span class="cart-item-meta">Size ${item.size} · ${fmt(p.price)}</span>
        <div class="cart-item-row">
          <div class="qty-control">
            <button data-action="dec">−</button>
            <span>${item.qty}</span>
            <button data-action="inc">+</button>
          </div>
          <button class="remove-btn" data-action="remove">Remove</button>
        </div>
      `;
      info.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(index, -1));
      info.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(index, 1));
      info.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(index));
      row.appendChild(media);
      row.appendChild(info);
      wrap.appendChild(row);
    });
  }
  document.getElementById('cartSubtotal').textContent = fmt(cartTotal());
}

function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('drawerOverlay').addEventListener('click', closeCart);

/* ---------------- Checkout ---------------- */
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if(state.cart.length === 0){ showToast('Your bag is empty.'); return; }
  document.getElementById('checkoutTotal').textContent = fmt(cartTotal());
  document.getElementById('checkoutForm').classList.remove('hidden');
  document.getElementById('checkoutSuccess').classList.add('hidden');
  document.getElementById('checkoutOverlay').classList.add('open');
});
document.getElementById('checkoutClose').addEventListener('click', () => {
  document.getElementById('checkoutOverlay').classList.remove('open');
});
document.getElementById('checkoutOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'checkoutOverlay') document.getElementById('checkoutOverlay').classList.remove('open');
});
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Demo only — replace with a real payment/order API call before going live.
  document.getElementById('checkoutForm').classList.add('hidden');
  document.getElementById('checkoutSuccess').classList.remove('hidden');
  state.cart = [];
  renderCart();
});
document.getElementById('checkoutDone').addEventListener('click', () => {
  document.getElementById('checkoutOverlay').classList.remove('open');
  closeCart();
});

/* ---------------- Search ---------------- */
document.getElementById('searchBtn').addEventListener('click', () => {
  document.getElementById('searchOverlay').classList.add('open');
  document.getElementById('searchInput').focus();
});
document.getElementById('searchClose').addEventListener('click', () => {
  document.getElementById('searchOverlay').classList.remove('open');
});
document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const results = document.getElementById('searchResults');
  results.innerHTML = '';
  if(!q) return;
  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  if(matches.length === 0){
    results.innerHTML = '<p style="color:#6b6b6b">No matches. Try "hoodie", "tee", "jogger"...</p>';
    return;
  }
  matches.forEach(p => {
    const row = document.createElement('div');
    row.className = 'search-result-item';
    row.innerHTML = `<span>${p.name}</span><span>${fmt(p.price)}</span>`;
    row.addEventListener('click', () => {
      document.getElementById('searchOverlay').classList.remove('open');
      openQuickView(p.id);
    });
    results.appendChild(row);
  });
});

/* ---------------- Newsletter ---------------- */
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  document.getElementById('newsletterMsg').textContent = `Thanks — we'll email ${email} when new drops go live.`;
  e.target.reset();
});

/* ---------------- Toast ---------------- */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------------- Theme toggle (light/dark, in-memory only) ---------------- */
// NOTE: theme choice is kept in memory for this session only (no
// localStorage), same reasoning as the cart above. To remember the
// visitor's choice across visits on your own server, persist it with:
//   localStorage.setItem('kaizo_theme', theme)
let currentTheme = 'light';
document.getElementById('themeToggle').addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : 'light');
  document.getElementById('themeToggle').setAttribute('aria-label',
    currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
});

/* ---------------- Custom cursor (desktop only) ---------------- */
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let ringX = 0, ringY = 0;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ringX = e.clientX; ringY = e.clientY;
  });
  (function loop(){
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ---------------- Init ---------------- */
document.getElementById('year').textContent = new Date().getFullYear();
renderGrid();
renderCart();
