/* ==========================================================================
   Jasim Jewellers - Fully Dynamic Real-Time Gold Pricing (1-Hour Auto Update)
   ========================================================================== */

const GRAMS_PER_VORI = 11.664;
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 Hour in milliseconds

// Default initial rates (BAJUS standard BDT per Vori)
let DYNAMIC_GOLD_RATES = JSON.parse(localStorage.getItem('jasim_live_rates')) || {
  22: { vori: 142200, gram: 12191.36, ana: 8887.5 },
  21: { vori: 135700, gram: 11634.09, ana: 8481.25 },
  18: { vori: 116300, gram: 9970.85, ana: 7268.75 },
  silver: { vori: 2100, gram: 180.04 },
  lastUpdatedTimestamp: Date.now(),
  lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
  source: 'BAJUS নির্দেশিত বাজার দর'
};

function calculateVori(vori = 0, ana = 0, ratti = 0) {
  return parseFloat(vori || 0) + (parseFloat(ana || 0) / 16) + (parseFloat(ratti || 0) / 96);
}

function formatBDT(amount) {
  return '৳' + Math.round(amount).toLocaleString('bn-BD');
}

// --- FETCH REAL-TIME LIVE SPOT GOLD PRICE FROM API ---
async function fetchLiveGoldPriceFromAPI() {
  const liveBadge = document.getElementById('liveRateSourceBadge');
  if (liveBadge) liveBadge.textContent = '🔄 গ্লোবাল গোল্ড এপিআই থেকে ১ ঘণ্টার আপডেট নেওয়া হচ্ছে...';

  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU').catch(() => null),
      fetch('https://api.exchangerate-api.com/v4/latest/USD').catch(() => null)
    ]);

    if (goldRes && goldRes.ok && fxRes && fxRes.ok) {
      const goldData = await goldRes.json();
      const fxData = await fxRes.json();

      const pricePerOunceUSD = goldData.price; // e.g. $2400/oz
      const bdtFxRate = fxData.rates.BDT || 118; // USD to BDT

      // 1 Troy Ounce = 31.1034768 Grams
      const pricePerGram24K_BDT = (pricePerOunceUSD * bdtFxRate) / 31.1034768;
      
      const vori22K = Math.round(pricePerGram24K_BDT * 0.916 * GRAMS_PER_VORI);
      const vori21K = Math.round(pricePerGram24K_BDT * 0.875 * GRAMS_PER_VORI);
      const vori18K = Math.round(pricePerGram24K_BDT * 0.750 * GRAMS_PER_VORI);

      updateRates({
        22: vori22K,
        21: vori21K,
        18: vori18K,
        source: 'গ্লোবাল লাইভ গোল্ড এপিআই (প্রতি ১ ঘণ্টায় স্বয়ংক্রিয় হালনাগাদ)'
      });
      return;
    }
  } catch (err) {
    console.log('Live API fetch error, fallback to current stored rate:', err);
  }

  refreshUIWithCurrentRates();
}

function updateRates(newRates) {
  if (newRates[22]) {
    const v22 = newRates[22];
    DYNAMIC_GOLD_RATES[22] = {
      vori: v22,
      gram: v22 / GRAMS_PER_VORI,
      ana: v22 / 16
    };
  }
  if (newRates[21]) {
    const v21 = newRates[21];
    DYNAMIC_GOLD_RATES[21] = {
      vori: v21,
      gram: v21 / GRAMS_PER_VORI,
      ana: v21 / 16
    };
  }
  if (newRates[18]) {
    const v18 = newRates[18];
    DYNAMIC_GOLD_RATES[18] = {
      vori: v18,
      gram: v18 / GRAMS_PER_VORI,
      ana: v18 / 16
    };
  }

  DYNAMIC_GOLD_RATES.lastUpdatedTimestamp = Date.now();
  DYNAMIC_GOLD_RATES.lastUpdated = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  if (newRates.source) DYNAMIC_GOLD_RATES.source = newRates.source;

  localStorage.setItem('jasim_live_rates', JSON.stringify(DYNAMIC_GOLD_RATES));
  refreshUIWithCurrentRates();
}

function checkAndAutoUpdatePriceEveryHour() {
  const lastFetch = DYNAMIC_GOLD_RATES.lastUpdatedTimestamp || 0;
  const timeElapsed = Date.now() - lastFetch;

  // Auto-fetch if 1 hour has passed since last update
  if (timeElapsed >= ONE_HOUR_MS) {
    fetchLiveGoldPriceFromAPI();
  } else {
    refreshUIWithCurrentRates();
  }

  // Set recurring 1-hour interval timer (3600000 ms)
  setInterval(() => {
    fetchLiveGoldPriceFromAPI();
  }, ONE_HOUR_MS);
}

function refreshUIWithCurrentRates() {
  // Update Ticker
  const top22 = document.getElementById('top-22k-rate');
  const top21 = document.getElementById('top-21k-rate');
  if (top22) top22.textContent = formatBDT(DYNAMIC_GOLD_RATES[22].vori);
  if (top21) top21.textContent = formatBDT(DYNAMIC_GOLD_RATES[21].vori);

  // Update Rate Cards
  const r22v = document.getElementById('rate-22k-vori');
  const r22g = document.getElementById('rate-22k-gram');
  const r21v = document.getElementById('rate-21k-vori');
  const r21g = document.getElementById('rate-21k-gram');

  if (r22v) r22v.textContent = formatBDT(DYNAMIC_GOLD_RATES[22].vori);
  if (r22g) r22g.textContent = formatBDT(DYNAMIC_GOLD_RATES[22].gram);
  if (r21v) r21v.textContent = formatBDT(DYNAMIC_GOLD_RATES[21].vori);
  if (r21g) r21g.textContent = formatBDT(DYNAMIC_GOLD_RATES[21].gram);

  const liveBadge = document.getElementById('liveRateSourceBadge');
  if (liveBadge) {
    liveBadge.innerHTML = `🟢 ${DYNAMIC_GOLD_RATES.source} <br><small style="color: var(--gold-light);">সর্বশেষ আপডেট: ${DYNAMIC_GOLD_RATES.lastUpdated} | ⏱️ প্রতি ১ ঘণ্টায় স্বয়ংক্রিয় রিফ্রেশ সচল</small>`;
  }

  // Re-render Catalog with new dynamic rates
  renderProducts(currentCategory);

  // Recalculate calculator & cart
  if (typeof setupCalculator === 'function') {
    const voriInp = document.getElementById('calcVori');
    if (voriInp) voriInp.dispatchEvent(new Event('input'));
  }
  updateCartUI();
}

// --- PRODUCTS DATA ---
const PRODUCTS = [
  {
    id: 'jj-01',
    nameBn: '২২ ক্যারেট রাজকীয় সীতা হার সেট',
    nameEn: 'Royal Bridal Sitahar Set 22K',
    category: 'necklace',
    karat: 22,
    vori: 3.5,
    ana: 0,
    ratti: 0,
    makingPerVori: 5000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'সুনিপুণ হাতে গড়া ২২ ক্যারেট খাঁটি সোনার ঐতিহ্যবাহী সীতা হার সেট। সাথে ম্যাচিং কানপাশা ও টিকলি।'
  },
  {
    id: 'jj-02',
    nameBn: '২১ ক্যারেট নকশা করা সোনার বালা জোড়া',
    nameEn: 'Handcrafted Kangkan Bangles Pair 21K',
    category: 'bangles',
    karat: 21,
    vori: 2.0,
    ana: 0,
    ratti: 0,
    makingPerVori: 4000,
    image: 'https://images.unsplash.com/photo-1611591475140-be3a7c647b01?auto=format&fit=crop&w=800&q=80',
    description: '২১ ক্যারেট সোনার গর্জিয়াস নকশার ট্র্যাডিশনাল কঙ্কন বালা জোড়া। কনে বা উৎসবে ব্যবহারের জন্য অনন্য।'
  },
  {
    id: 'jj-03',
    nameBn: '২২ ক্যারেট ডায়মন্ড কাট ক্রাউন আংটি',
    nameEn: 'Diamond Cut Crown Gold Ring 22K',
    category: 'ring',
    karat: 22,
    vori: 0,
    ana: 8,
    ratti: 0,
    makingPerVori: 7000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'আধুনিক ডায়মন্ড কাট ফিনিশিংয়ে তৈরি ৮ আনার ২২ ক্যারেট সলিড সোনার এক্সক্লুসিভ লেডিস আংটি।'
  },
  {
    id: 'jj-04',
    nameBn: '২২ ক্যারেট রাজকীয় ঝুমকা কানপাশা',
    nameEn: 'Royal Bridal Jhumka Earrings 22K',
    category: 'earring',
    karat: 22,
    vori: 1,
    ana: 4,
    ratti: 0,
    makingPerVori: 4800,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: '২২ ক্যারেট সোনার ঐতিহ্যবাহী ঝুমকা কানপাশা। নিখুঁত কারুকার্য ও শতভাগ হলমার্ক নিশ্চয়তা।'
  },
  {
    id: 'jj-05',
    nameBn: '২২ ক্যারেট এক্সক্লুসিভ মেনস সোনার চেইন',
    nameEn: 'Mens Heavy Executive Gold Chain 22K',
    category: 'chain',
    karat: 22,
    vori: 1,
    ana: 8,
    ratti: 0,
    makingPerVori: 4000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'পুরুষদের পছন্দসই ১ ভরি ৮ আনার শক্তিশালী লকিং সিস্টেমসহ ২২ ক্যারেট রাজকীয় সোনার চেইন।'
  },
  {
    id: 'jj-06',
    nameBn: '২১ ক্যারেট ব্রাইডাল চূড় (পিস)',
    nameEn: 'Traditional Handcrafted Gold Chur 21K',
    category: 'bangles',
    karat: 21,
    vori: 1,
    ana: 8,
    ratti: 0,
    makingPerVori: 4500,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    description: '২১ ক্যারেট সোনায় নকশা করা ঐতিহ্যবাহী চূড়। বিয়ের কনের হাতের সৌন্দর্যে রাজকীয় রূপ।'
  },
  {
    id: 'jj-07',
    nameBn: '২২ ক্যারেট সোনার নোলক ও টিকলি সেট',
    nameEn: 'Bridal Gold Noth & Maang Tikka Set 22K',
    category: 'necklace',
    karat: 22,
    vori: 1,
    ana: 0,
    ratti: 0,
    makingPerVori: 5500,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
    description: 'বিয়ের কনের সাজ পরিপূর্ণ করতে ২২ ক্যারেট সোনার গর্জিয়াস নোলক (নথ) এবং টিকলি সেট।'
  },
  {
    id: 'jj-08',
    nameBn: '২২ ক্যারেট খাঁটি সোনার বার (১ ভরি)',
    nameEn: 'Pure 22K Gold Mint Bar (1 Vori / 11.66g)',
    category: 'bar',
    karat: 22,
    vori: 1,
    ana: 0,
    ratti: 0,
    makingPerVori: 1000,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    description: 'নিরাপদ বিনিয়োগ বা ভবিষ্যতের জন্য ১ ভরি (১১.৬৬৪ গ্রাম) ২২ ক্যারেট সার্টিফাইড সলিড গোল্ড বার।'
  }
];

let cart = JSON.parse(localStorage.getItem('jasim_cart')) || [];
let currentCategory = 'all';

function getProductPricing(product) {
  const totalVori = calculateVori(product.vori, product.ana, product.ratti);
  const grams = totalVori * GRAMS_PER_VORI;
  const voriRate = DYNAMIC_GOLD_RATES[product.karat] ? DYNAMIC_GOLD_RATES[product.karat].vori : 142200;
  const baseGoldPrice = totalVori * voriRate;
  const makingCharge = totalVori * (product.makingPerVori || 4000);
  const totalPrice = baseGoldPrice + makingCharge;

  return {
    totalVori,
    grams,
    baseGoldPrice,
    makingCharge,
    totalPrice
  };
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  checkAndAutoUpdatePriceEveryHour();
  renderProducts('all');
  updateCartUI();
  setupCalculator();
  setupNavigation();
  setupModals();
  setupChatBot();
  setupLiveRateControls();
});

function setupLiveRateControls() {
  const openRateModalBtn = document.getElementById('openRateControlModal');
  const rateModal = document.getElementById('rateControlModal');
  const closeRateModalBtn = document.getElementById('closeRateControlModal');
  const rateForm = document.getElementById('liveRateForm');

  if (openRateModalBtn && rateModal) {
    openRateModalBtn.addEventListener('click', () => {
      document.getElementById('input22k').value = DYNAMIC_GOLD_RATES[22].vori;
      document.getElementById('input21k').value = DYNAMIC_GOLD_RATES[21].vori;
      document.getElementById('input18k').value = DYNAMIC_GOLD_RATES[18].vori;
      rateModal.classList.add('active');
    });
    closeRateModalBtn.addEventListener('click', () => rateModal.classList.remove('active'));
  }

  if (rateForm) {
    rateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const v22 = parseInt(document.getElementById('input22k').value) || 142200;
      const v21 = parseInt(document.getElementById('input21k').value) || 135700;
      const v18 = parseInt(document.getElementById('input18k').value) || 116300;

      updateRates({
        22: v22,
        21: v21,
        18: v18,
        source: 'ম্যানুয়াল ইনপুট (BAJUS / দোকানদার)'
      });

      rateModal.classList.remove('active');
      alert('✅ সোনার দর সফলভাবে আপডেট করা হয়েছে!');
    });
  }

  const fetchLiveBtn = document.getElementById('fetchApiRateBtn');
  if (fetchLiveBtn) {
    fetchLiveBtn.addEventListener('click', async () => {
      await fetchLiveGoldPriceFromAPI();
      alert('✨ ১ ঘণ্টার নতুন লাইভ সোনার দর গ্লোবাল মার্কেট থেকে আপডেট করা হয়েছে!');
      if (rateModal) rateModal.classList.remove('active');
    });
  }
}

function renderProducts(category = 'all') {
  currentCategory = category;
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => {
    const pricing = getProductPricing(p);
    return `
      <div class="product-card luxury-card">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.nameBn}" class="product-img" loading="lazy">
          <span class="p-karat-badge">${p.karat} ক্যারেট</span>
          <span class="p-weight-tag">${p.vori > 0 ? p.vori + ' ভরি ' : ''}${p.ana > 0 ? p.ana + ' আনা' : ''} (${pricing.grams.toFixed(2)}g)</span>
        </div>
        <div class="product-info">
          <h3 class="product-title-bn">${p.nameBn}</h3>
          <span class="product-title-en">${p.nameEn}</span>
          
          <div class="price-breakdown-box">
            <div class="p-price-row">
              <span>সোনার মূল দাম:</span>
              <strong>${formatBDT(pricing.baseGoldPrice)}</strong>
            </div>
            <div class="p-price-row">
              <span>অলংকার মজুরী:</span>
              <strong>${formatBDT(pricing.makingCharge)}</strong>
            </div>
            <div class="p-total-price flex-between">
              <span>লাইভ দর অনুযায়ী মোট:</span>
              <strong class="gold-color">${formatBDT(pricing.totalPrice)}</strong>
            </div>
          </div>

          <div class="product-card-actions">
            <button class="btn btn-outline" onclick="openProductModal('${p.id}')">
              <i class="fa-solid fa-eye"></i> বিস্তারিত
            </button>
            <button class="btn btn-primary" onclick="addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> কার্ট
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupCalculator() {
  const voriInput = document.getElementById('calcVori');
  const anaInput = document.getElementById('calcAna');
  const rattiInput = document.getElementById('calcRatti');
  const makingInput = document.getElementById('calcMakingCharge');
  const karatRadios = document.getElementsByName('calcKarat');

  function calculate() {
    let karat = 22;
    karatRadios.forEach(r => { if (r.checked) karat = parseInt(r.value); });

    const vori = parseFloat(voriInput.value) || 0;
    const ana = parseFloat(anaInput.value) || 0;
    const ratti = parseFloat(rattiInput.value) || 0;
    const makingPerVori = parseFloat(makingInput.value) || 0;

    const totalVori = calculateVori(vori, ana, ratti);
    const totalGrams = totalVori * GRAMS_PER_VORI;

    const currentRateForKarat = DYNAMIC_GOLD_RATES[karat] ? DYNAMIC_GOLD_RATES[karat].vori : 142200;

    const baseGoldPrice = totalVori * currentRateForKarat;
    const makingCharge = totalVori * makingPerVori;
    const vat = (baseGoldPrice + makingCharge) * 0.05;
    const grandTotal = baseGoldPrice + makingCharge + vat;

    const resTotalWeight = document.getElementById('resTotalWeight');
    const resBaseGoldPrice = document.getElementById('resBaseGoldPrice');
    const resMakingCharge = document.getElementById('resMakingCharge');
    const resVatAmount = document.getElementById('resVatAmount');
    const resGrandTotal = document.getElementById('resGrandTotal');

    if (resTotalWeight) resTotalWeight.textContent = `${totalVori.toFixed(3)} ভরি (${totalGrams.toFixed(2)} গ্রাম)`;
    if (resBaseGoldPrice) resBaseGoldPrice.textContent = formatBDT(baseGoldPrice);
    if (resMakingCharge) resMakingCharge.textContent = formatBDT(makingCharge);
    if (resVatAmount) resVatAmount.textContent = formatBDT(vat);
    if (resGrandTotal) resGrandTotal.textContent = formatBDT(grandTotal);
  }

  [voriInput, anaInput, rattiInput, makingInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculate);
  });
  karatRadios.forEach(r => r.addEventListener('change', calculate));

  const orderFromCalcBtn = document.getElementById('orderFromCalcBtn');
  if (orderFromCalcBtn) {
    orderFromCalcBtn.addEventListener('click', () => {
      let karat = 22;
      karatRadios.forEach(r => { if (r.checked) karat = parseInt(r.value); });
      const vori = parseFloat(voriInput.value) || 0;
      const ana = parseFloat(anaInput.value) || 0;
      const ratti = parseFloat(rattiInput.value) || 0;
      const making = parseFloat(makingInput.value) || 4000;

      const customItem = {
        id: 'custom-' + Date.now(),
        nameBn: `কাস্টম অর্ডার (${karat}K সোনা - ${vori} ভরি ${ana} আনা)`,
        nameEn: `Custom Order ${karat}K`,
        karat: karat,
        vori: vori,
        ana: ana,
        ratti: ratti,
        makingPerVori: making,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      };

      cart.push({ product: customItem, qty: 1 });
      saveCart();
      updateCartUI();
      openCartDrawer();
    });
  }
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('jasim_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const drawerCountEl = document.getElementById('drawerCartCount');
  const cartList = document.getElementById('cartItemsList');
  
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countEl) countEl.textContent = totalItems;
  if (drawerCountEl) drawerCountEl.textContent = totalItems;

  let goldTotalSum = 0;
  let makingTotalSum = 0;

  if (cartList) {
    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="text-center" style="padding: 40px 0; color: var(--text-muted);">
          <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 15px;"></i>
          <p>আপনার শপিং কার্ট খালি রয়েছে</p>
        </div>
      `;
    } else {
      cartList.innerHTML = cart.map(item => {
        const pricing = getProductPricing(item.product);
        const itemGoldTotal = pricing.baseGoldPrice * item.qty;
        const itemMakingTotal = pricing.makingCharge * item.qty;
        const itemGrandTotal = pricing.totalPrice * item.qty;

        goldTotalSum += itemGoldTotal;
        makingTotalSum += itemMakingTotal;

        return `
          <div class="cart-item">
            <img src="${item.product.image}" alt="${item.product.nameBn}" class="cart-item-img">
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.product.nameBn}</h4>
              <div class="cart-item-specs">
                <span>${item.product.karat}K সোনা | পরিমাণ: ${item.qty} টি</span>
              </div>
              <div class="cart-item-price">${formatBDT(itemGrandTotal)}</div>
            </div>
            <button class="remove-cart-item" onclick="removeFromCart('${item.product.id}')" title="মুছে ফেলুন">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }

  const cartGoldTotalEl = document.getElementById('cartGoldTotal');
  const cartMakingTotalEl = document.getElementById('cartMakingTotal');
  const cartGrandTotalEl = document.getElementById('cartGrandTotal');

  if (cartGoldTotalEl) cartGoldTotalEl.textContent = formatBDT(goldTotalSum);
  if (cartMakingTotalEl) cartMakingTotalEl.textContent = formatBDT(makingTotalSum);
  if (cartGrandTotalEl) cartGrandTotalEl.textContent = formatBDT(goldTotalSum + makingTotalSum);
}

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
}

function setupNavigation() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderProducts(e.target.dataset.category);
    });
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

function setupModals() {
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  const openCardModal = document.getElementById('openCardModal');
  const cardModal = document.getElementById('cardModal');
  const closeCardModal = document.getElementById('closeCardModal');

  if (openCardModal && cardModal) {
    openCardModal.addEventListener('click', () => cardModal.classList.add('active'));
    closeCardModal.addEventListener('click', () => cardModal.classList.remove('active'));
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeCheckoutModal = document.getElementById('closeCheckoutModal');

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('আপনার কার্ট খালি! অনুগ্রহ করে প্রথমে অলংকার নির্বাচন করুন।');
        return;
      }
      closeCartDrawer();
      populateCheckoutSummary();
      checkoutModal.classList.add('active');
    });

    closeCheckoutModal.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
    });
  }

  const orderCheckoutForm = document.getElementById('orderCheckoutForm');
  if (orderCheckoutForm) {
    orderCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      generateInvoice();
    });
  }

  const resetOrderBtn = document.getElementById('resetOrderBtn');
  if (resetOrderBtn) {
    resetOrderBtn.addEventListener('click', () => {
      cart = [];
      saveCart();
      updateCartUI();
      document.getElementById('checkoutFormStep').style.display = 'block';
      document.getElementById('invoiceStep').style.display = 'none';
      document.getElementById('checkoutModal').classList.remove('active');
    });
  }

  // QR Modal
  const openQRModal = document.getElementById('openQRModal');
  const qrModal = document.getElementById('qrModal');
  const closeQRModal = document.getElementById('closeQRModal');
  const tabSiteQR = document.getElementById('tabSiteQR');
  const tabPayQR = document.getElementById('tabPayQR');
  const siteQRBox = document.getElementById('siteQRBox');
  const payQRBox = document.getElementById('payQRBox');

  if (openQRModal && qrModal) {
    openQRModal.addEventListener('click', () => qrModal.classList.add('active'));
    closeQRModal.addEventListener('click', () => qrModal.classList.remove('active'));
  }

  if (tabSiteQR && tabPayQR) {
    tabSiteQR.addEventListener('click', () => {
      tabSiteQR.classList.add('active');
      tabPayQR.classList.remove('active');
      siteQRBox.style.display = 'inline-block';
      payQRBox.style.display = 'none';
    });
    tabPayQR.addEventListener('click', () => {
      tabPayQR.classList.add('active');
      tabSiteQR.classList.remove('active');
      payQRBox.style.display = 'inline-block';
      siteQRBox.style.display = 'none';
    });
  }

  // Product quick view close
  const closeProductModalBtn = document.getElementById('closeProductModal');
  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', () => {
      document.getElementById('productModal').classList.remove('active');
    });
  }
}

function openProductModal(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (!p) return;

  const pricing = getProductPricing(p);
  const modalBody = document.getElementById('productModalBody');

  modalBody.innerHTML = `
    <div>
      <img src="${p.image}" alt="${p.nameBn}" class="quick-view-img">
    </div>
    <div>
      <span class="sub-heading">${p.karat} ক্যারেট খাঁটি সোনা</span>
      <h2 style="color: #fff; margin-bottom: 8px;">${p.nameBn}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">${p.nameEn}</p>
      
      <p style="color: var(--text-main); margin-bottom: 20px;">${p.description}</p>
      
      <div class="price-breakdown-box" style="margin-bottom: 24px;">
        <div class="p-price-row">
          <span>মোট ওজন:</span>
          <strong>${pricing.totalVori.toFixed(2)} ভরি (${pricing.grams.toFixed(2)} গ্রাম)</strong>
        </div>
        <div class="p-price-row">
          <span>সোনার মূল দাম (লাইভ):</span>
          <strong>${formatBDT(pricing.baseGoldPrice)}</strong>
        </div>
        <div class="p-price-row">
          <span>অলংকার তৈরির মজুরী:</span>
          <strong>${formatBDT(pricing.makingCharge)}</strong>
        </div>
        <div class="p-total-price flex-between">
          <span>সর্বমোট মূল্য:</span>
          <strong class="gold-color">${formatBDT(pricing.totalPrice)}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 15px;">
        <button class="btn btn-primary w-100" onclick="addToCart('${p.id}'); document.getElementById('productModal').classList.remove('active');">
          <i class="fa-solid fa-cart-plus"></i> শপিং কার্টে যোগ করুন
        </button>
      </div>
    </div>
  `;

  document.getElementById('productModal').classList.add('active');
}

function populateCheckoutSummary() {
  const chkItemCount = document.getElementById('chkItemCount');
  const chkTotalBDT = document.getElementById('chkTotalBDT');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cart.reduce((sum, item) => {
    const pricing = getProductPricing(item.product);
    return sum + (pricing.totalPrice * item.qty);
  }, 0);

  if (chkItemCount) chkItemCount.textContent = `${totalQty} টি`;
  if (chkTotalBDT) chkTotalBDT.textContent = formatBDT(grandTotal);
}

function generateInvoice() {
  const custName = document.getElementById('custName').value;
  const custPhone = document.getElementById('custPhone').value;
  const custDelivery = document.getElementById('custDeliveryType').value;
  const payMethod = document.querySelector('input[name="payMethod"]:checked').value;

  const invDate = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  const invId = '#JJ-' + Math.floor(1000 + Math.random() * 9000);

  document.getElementById('invCustName').textContent = custName;
  document.getElementById('invCustPhone').textContent = custPhone;
  document.getElementById('invDelivery').textContent = custDelivery;
  document.getElementById('invPayment').textContent = payMethod;
  document.getElementById('invDate').textContent = invDate;
  document.getElementById('invId').textContent = invId;

  const tbody = document.getElementById('invItemsBody');
  let grandTotal = 0;

  tbody.innerHTML = cart.map(item => {
    const pricing = getProductPricing(item.product);
    const itemTotal = pricing.totalPrice * item.qty;
    grandTotal += itemTotal;

    return `
      <tr>
        <td>${item.product.nameBn} (${item.qty}টি)</td>
        <td>${item.product.karat}K</td>
        <td>${pricing.totalVori.toFixed(2)} ভরি</td>
        <td>${formatBDT(pricing.baseGoldPrice * item.qty)}</td>
        <td>${formatBDT(pricing.makingCharge * item.qty)}</td>
        <td><strong>${formatBDT(itemTotal)}</strong></td>
      </tr>
    `;
  }).join('');

  document.getElementById('invGrandTotal').textContent = formatBDT(grandTotal);

  document.getElementById('checkoutFormStep').style.display = 'none';
  document.getElementById('invoiceStep').style.display = 'block';
}

function setupChatBot() {
  const toggleBtn = document.getElementById('chatToggleBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
    closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));
  }

  document.querySelectorAll('.quick-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const queryType = e.target.dataset.query;
      handleUserQuery(getQuickText(queryType), queryType);
    });
  });

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      handleUserQuery(text);
      chatInput.value = '';
    });
  }
}

function getQuickText(type) {
  switch (type) {
    case 'rate': return 'আজকের লাইভ স্বর্ণের দাম কত?';
    case 'location': return 'দোকানের ঠিকানা কোথায়?';
    case 'mortgage': return 'স্বর্ণ বন্ধক রাখার নিয়ম কি?';
    case 'making': return 'মজুরি বা মেকিং চার্জ কেমন?';
    case 'owner': return 'জসিম ভাইয়ের সাথে কথা বলতে চাই';
    default: return type;
  }
}

function handleUserQuery(userText, directType = null) {
  const chatMessages = document.getElementById('chatMessages');

  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user-msg';
  userBubble.textContent = userText;
  chatMessages.appendChild(userBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    const botReply = generateBotResponse(userText, directType);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot-msg';
    botBubble.innerHTML = botReply;
    chatMessages.appendChild(botBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);
}

function generateBotResponse(text, type = null) {
  const lower = text.toLowerCase();

  if (type === 'rate' || lower.includes('দাম') || lower.includes('রেট') || lower.includes('সোনা') || lower.includes('ভরি')) {
    return `
      <strong>আজকের ১ ঘণ্টার অটো-আপডেটেড সোনার দর (BDT):</strong><br>
      🏆 <strong>২২ ক্যারেট:</strong> ${formatBDT(DYNAMIC_GOLD_RATES[22].vori)} / ভরি (${formatBDT(DYNAMIC_GOLD_RATES[22].gram)} / গ্রাম)<br>
      ⭐ <strong>২১ ক্যারেট:</strong> ${formatBDT(DYNAMIC_GOLD_RATES[21].vori)} / ভরি (${formatBDT(DYNAMIC_GOLD_RATES[21].gram)} / গ্রাম)<br>
      ✨ <strong>১৮ ক্যারেট:</strong> ${formatBDT(DYNAMIC_GOLD_RATES[18].vori)} / ভরি<br>
      ⚪ <strong>২২K রুপা:</strong> ${formatBDT(DYNAMIC_GOLD_RATES.silver.vori)} / ভরি<br><br>
      <em>(উৎস: ${DYNAMIC_GOLD_RATES.source} - সময়: ${DYNAMIC_GOLD_RATES.lastUpdated})</em>
    `;
  }

  if (type === 'location' || lower.includes('ঠিকানা') || lower.includes('কোথায়') || lower.includes('দোকান') || lower.includes('লোকেশন')) {
    return `
      📍 <strong>জসিম জুয়েলার্স শোরুম ঠিকানা:</strong><br>
      ফেরদৌস মার্কেট, খিলক্ষেত বাজার, খিলক্ষেত, ঢাকা-১২২৯।<br><br>
      ⏰ <strong>সময়সূচী:</strong> প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:৩০ টা পর্যন্ত খোলা।<br>
      📞 <strong>মোবাইল:</strong> 01819-119014 / 01928-706691
    `;
  }

  if (type === 'mortgage' || lower.includes('বন্ধক') || lower.includes('বন্ধকী') || lower.includes('টাকা') || lower.includes('ঋণ')) {
    return `
      🏦 <strong>স্বর্ণালংকার বন্ধক সুবিধা:</strong><br>
      আপনার যেকোনো জরুরী প্রয়োজনে আমরা সম্পূর্ণ নিরাপদ লকারে স্বর্ণালংকার বন্ধক রেখে নগদ অর্থ প্রদান করি।<br>
      ✅ শতভাগ সিকিউর লকার ও রসিদ<br>
      ✅ সর্বনিম্ন সার্ভিস চার্জ<br>
      ✅ নমনীয় মেয়াদে পরিশোধের সুযোগ<br><br>
      সরাসরি কথা বলতে কল করুন: <strong>01819-119014</strong>
    `;
  }

  if (type === 'making' || lower.includes('মজুরি') || lower.includes('মজুরী') || lower.includes('মেকিং')) {
    return `
      🛠️ <strong>অলংকার মজুরী সংক্রান্ত তথ্য:</strong><br>
      গহনার ডিজাইন ও ফিনিশিং ভেদে অলংকার তৈরির মজুরী প্রতি ভরিতে <strong>৳৩,০০০ থেকে ৳৮,০০০ টাকা</strong> পর্যন্ত হয়ে থাকে।<br>
      কাস্টম ডিজাইনের জন্য সরাসরি দোকানে আসুন অথবা ছবি পাঠাতে হোয়াটসঅ্যাপ করুন।
    `;
  }

  if (type === 'owner' || lower.includes('মালিক') || lower.includes('জসিম') || lower.includes('কথা') || lower.includes('কল')) {
    return `
      👤 <strong>স্বত্বাধিকারী: মোঃ জসিম উদ্দিন ভূঁইয়া</strong><br>
      আপনি সরাসরি মালিক সাহেবের সাথে কথা বলতে কল বা হোয়াটসঅ্যাপ চ্যাট করতে পারেন:<br>
      📱 <strong>01819-119014</strong> (Call / WhatsApp)<br>
      📱 <strong>01928-706691</strong> (Shop Line)
    `;
  }

  return `
    ধন্যবাদ <strong>জসিম জুয়েলার্সে</strong> মেসেজ পাঠানোর জন্য! 🌟<br><br>
    বর্তমানে আমাদের অনলাইন শপ প্রতিনিধি ও প্রোপ্রাইটর <strong>মোঃ জসিম উদ্দিন ভূঁইয়া</strong> অফলাইনে আছেন। আপনার মেসেজটি সফলভাবে পাওয়া গেছে।<br><br>
    জরুরী অনুসন্ধানের জন্য সরাসরি কল অথবা হোয়াটসঅ্যাপ করুন:<br>
    📱 <strong>01819-119014</strong><br>
    📱 <strong>01928-706691</strong><br><br>
    📍 <em>ফেরদৌস মার্কেট, খিলক্ষেত বাজার, ঢাকা-১২২৯।</em>
  `;
}
