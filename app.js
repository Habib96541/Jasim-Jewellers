/* ==========================================================================
   Jasim Jewellers - Complete Application Logic & Automated Chat Bot
   ========================================================================== */

// --- GOLD RATES & CONSTANTS ---
const GOLD_RATES = {
  22: { vori: 142200, gram: 12191.36, ana: 8887.5 },
  21: { vori: 135700, gram: 11634.09, ana: 8481.25 },
  18: { vori: 116300, gram: 9970.85, ana: 7268.75 }
};

// 1 Vori = 16 Ana = 96 Ratti = 11.664 Grams
function calculateVori(vori = 0, ana = 0, ratti = 0) {
  return parseFloat(vori) + (parseFloat(ana) / 16) + (parseFloat(ratti) / 96);
}

function formatBDT(amount) {
  return '৳' + Math.round(amount).toLocaleString('bn-BD');
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

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem('jasim_cart')) || [];

// Calculate product prices based on live rate
function getProductPricing(product) {
  const totalVori = calculateVori(product.vori, product.ana, product.ratti);
  const grams = totalVori * 11.664;
  const voriRate = GOLD_RATES[product.karat].vori;
  const baseGoldPrice = totalVori * voriRate;
  const makingCharge = totalVori * product.makingPerVori;
  const totalPrice = baseGoldPrice + makingCharge;

  return {
    totalVori,
    grams,
    baseGoldPrice,
    makingCharge,
    totalPrice
  };
}

// --- INITIALIZATION & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  updateCartUI();
  setupCalculator();
  setupNavigation();
  setupModals();
  setupChatBot();
});

// --- RENDER PRODUCTS GRID ---
function renderProducts(category = 'all') {
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
              <span>সর্বমোট:</span>
              <strong>${formatBDT(pricing.totalPrice)}</strong>
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

// --- CALCULATOR ENGINE ---
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
    const totalGrams = totalVori * 11.664;
    const baseGoldPrice = totalVori * GOLD_RATES[karat].vori;
    const makingCharge = totalVori * makingPerVori;
    const vat = (baseGoldPrice + makingCharge) * 0.05;
    const grandTotal = baseGoldPrice + makingCharge + vat;

    document.getElementById('resTotalWeight').textContent = `${totalVori.toFixed(3)} ভরি (${totalGrams.toFixed(2)} গ্রাম)`;
    document.getElementById('resBaseGoldPrice').textContent = formatBDT(baseGoldPrice);
    document.getElementById('resMakingCharge').textContent = formatBDT(makingCharge);
    document.getElementById('resVatAmount').textContent = formatBDT(vat);
    document.getElementById('resGrandTotal').textContent = formatBDT(grandTotal);
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

// --- CART FUNCTIONS ---
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

// --- MODALS & NAVIGATION ---
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

  // Visiting card modal
  const openCardModal = document.getElementById('openCardModal');
  const cardModal = document.getElementById('cardModal');
  const closeCardModal = document.getElementById('closeCardModal');

  if (openCardModal && cardModal) {
    openCardModal.addEventListener('click', () => cardModal.classList.add('active'));
    closeCardModal.addEventListener('click', () => cardModal.classList.remove('active'));
  }

  // Checkout modal
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

  // Handle Checkout Submit
  const orderCheckoutForm = document.getElementById('orderCheckoutForm');
  if (orderCheckoutForm) {
    orderCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      generateInvoice();
    });
  }

  // Reset Order
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
          <span>সোনার মূল দাম:</span>
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

// --- CHECKOUT & INVOICE GENERATOR ---
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

// --- AUTOMATED MESSAGING & CHAT BOT SYSTEM ---
function setupChatBot() {
  const toggleBtn = document.getElementById('chatToggleBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
    closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));
  }

  // Quick pill clicks
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
    case 'rate': return 'আজকের স্বর্ণের দাম কত?';
    case 'location': return 'দোকানের ঠিকানা কোথায়?';
    case 'mortgage': return 'স্বর্ণ বন্ধক রাখার নিয়ম কি?';
    case 'making': return 'মজুরি বা মেকিং চার্জ কেমন?';
    case 'owner': return 'জসিম ভাইয়ের সাথে কথা বলতে চাই';
    default: return type;
  }
}

function handleUserQuery(userText, directType = null) {
  const chatMessages = document.getElementById('chatMessages');

  // Append user message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user-msg';
  userBubble.textContent = userText;
  chatMessages.appendChild(userBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Bot thinking simulation
  setTimeout(() => {
    const botReply = generateBotResponse(userText, directType);
    const botBubble = document.createElement('div');
    botBubble.className = 'chat-bubble bot-msg';
    botBubble.innerHTML = botReply;
    chatMessages.appendChild(botBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 600);
}

function generateBotResponse(text, type = null) {
  const lower = text.toLowerCase();

  if (type === 'rate' || lower.includes('দাম') || lower.includes('রেট') || lower.includes('সোনা') || lower.includes('ভরি')) {
    return `
      <strong>আজকের বাংলাদেশ বাজুস (BAJUS) নির্দেশিত সোনার দাম:</strong><br>
      🏆 <strong>২২ ক্যারেট:</strong> ৳১,৪২,২০০ / ভরি (৳১২,১৯৩ / গ্রাম)<br>
      ⭐ <strong>২১ ক্যারেট:</strong> ৳১,৩৫,৭০০ / ভরি (৳১১,৬৩৪ / গ্রাম)<br>
      ✨ <strong>১৮ ক্যারেট:</strong> ৳১,১৬,৩০০ / ভরি<br>
      ⚪ <strong>২২K রুপা:</strong> ৳২,১০০ / ভরি<br><br>
      <em>প্রাইস ক্যালকুলেটরে সরাসরি সোনার ও অলংকারের মূল্য হিসেব করে নিন!</em>
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

  // General automated offline reply if no active representative is present
  return `
    ধন্যবাদ <strong>জসিম জুয়েলার্সে</strong> মেসেজ পাঠানোর জন্য! 🌟<br><br>
    বর্তমানে আমাদের শপ এজেন্ট ও প্রোপ্রাইটর <strong>মোঃ জসিম উদ্দিন ভূঁইয়া</strong> অফলাইনে আছেন। আপনার মেসেজটি সফলভাবে পাওয়া গেছে।<br><br>
    জরুরী অনুসন্ধানের জন্য সরাসরি কল অথবা হোয়াটসঅ্যাপ করুন:<br>
    📱 <strong>01819-119014</strong><br>
    📱 <strong>01928-706691</strong><br><br>
    📍 <em>ফেরদৌস মার্কেট, খিলক্ষেত বাজার, ঢাকা-১২২৯।</em>
  `;
}
