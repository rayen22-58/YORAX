// ==========================================================================
// YORAX STREETWEAR - HOME & PRODUCT INTERACTION ENGINE (2026)
// ==========================================================================

// 1. رقم الهاتف التونسي الخاص بـ YORAX (مكتوب بالصيغة الدولية المباشرة)
// بدّل الأرقام 99000000 برقمك الخاص المتكون من 8 أرقام (مثال: 21622111222)
const BRAND_PHONE = "42463318";

// 2. قائمة المنتجات (Products Data)
const productsData = [
    {
        id: "yrx-01",
        title: "HOODIE OVERSIZED BLACK WOLF",
        category: "Hoodies",
        price: 89.00,
        originalPrice: 110.00,
        image: "ChaseRBack.jpg",
        images: [
            "    ChaseRBack.jpg",
            "ChaseRFace.jpg"
        ],
        specs: [
            "Coton 100% Ultra-Lourd Premium (400 GSM)",
            "Coupe Oversized Streetwear",
            "Sérigraphie / DTF Haute Qualité YORAX",
            "Fabriqué en Tunisie avec soin"
        ]
    },
    {
        id: "yrx-02",
        title: "HOODIE MINIMALIST DARK EDITION",
        category: "Hoodies",
        price: 95.00,
        originalPrice: 120.00,
        image: "DarkAngle.jpg",
        images: [
            "DarkAngle.jpg"
        ],
        specs: [
            "Coton Molletonné Épais",
            "Coupe Relaxed / Oversized",
            "Finition Soignée & Capuche Doublée",
            "Design Minimaliste Noir & Blanc"
        ]
    }
];

// State Management
let cart = [];
let currentCategory = "Tous";
let currentSearchQuery = "";
let selectedSize = "M";

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    setupModals();
});

// ==========================================================================
// RENDER PRODUCTS GRID
// ==========================================================================
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const countElement = document.getElementById('productResultsCount');
    
    if (!grid) return;

    // Filter Logic
    const filtered = productsData.filter(product => {
        const matchesCategory = (currentCategory === "Tous") || (product.category === currentCategory);
        const matchesSearch = product.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              product.id.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (countElement) {
        countElement.textContent = `${filtered.length} Produit${filtered.length > 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-products"><p>Aucun produit trouvé.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="card-img-wrap" onclick="openProductPreview('${product.id}')">
                <span class="sku-tag">${product.id.toUpperCase()}</span>
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/400x500/141414/ffffff?text=YORAX'">
            </div>
            <div class="card-info">
                <span class="product-cat">${product.category}</span>
                <h3 class="product-title" onclick="openProductPreview('${product.id}')">${product.title}</h3>
                <div class="price-row">
                    <span class="price">${product.price.toFixed(2)} TND</span>
                    ${product.originalPrice ? `<span class="orig-price">${product.originalPrice.toFixed(2)} TND</span>` : ''}
                </div>
                <div class="card-buttons">
                    <button class="btn-quick-view" onclick="openProductPreview('${product.id}')">
                        <i class="fa-regular fa-eye"></i> VOIR DÉTAILS
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// PREVIEW MODAL LOGIC
// ==========================================================================
window.openProductPreview = function(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productPreviewModal');
    
    // Set Product Data
    document.getElementById('modalMainImg').src = product.image;
    document.getElementById('modalSku').textContent = product.id.toUpperCase();
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = `${product.price.toFixed(2)} TND`;
    
    const origPriceEl = document.getElementById('modalOriginalPrice');
    if (origPriceEl) {
        origPriceEl.textContent = product.originalPrice ? `${product.originalPrice.toFixed(2)} TND` : '';
    }

    // Load Thumbnails
    const thumbsContainer = document.getElementById('modalGalleryThumbs');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = (product.images || [product.image]).map((imgSrc, idx) => `
            <img src="${imgSrc}" class="${idx === 0 ? 'active' : ''}" onclick="changePreviewImage('${imgSrc}', this)">
        `).join('');
    }

    // Load Technical Specs
    const specsContainer = document.getElementById('modalSpecsList');
    if (specsContainer && product.specs) {
        specsContainer.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');
    }

    // Save active product reference to modal
    modal.setAttribute('data-active-id', product.id);
    modal.classList.add('active');
};

window.changePreviewImage = function(imgSrc, thumbElement) {
    document.getElementById('modalMainImg').src = imgSrc;
    document.querySelectorAll('.gallery-thumbs img').forEach(img => img.classList.remove('active'));
    thumbElement.classList.add('active');
};

// ==========================================================================
// EVENT LISTENERS & DIRECT WHATSAPP ORDER
// ==========================================================================
function setupEventListeners() {
    // 1. Search Bar Interaction
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            if (clearSearchBtn) clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
            renderProducts();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchQuery = '';
            clearSearchBtn.style.display = 'none';
            renderProducts();
        });
    }

    // 2. Category Filter Pills
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderProducts();
        });
    });

    // 3. Size Selector Buttons inside Preview Modal
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
            const label = document.getElementById('selectedSizeLabel');
            if (label) label.textContent = selectedSize;
        });
    });

    // 4. DIRECT WHATSAPP ORDER INSIDE PREVIEW MODAL (الحل النهائي المباشر للتليفون)
    const directWhatsAppBtn = document.getElementById('modalDirectWhatsAppBtn');
    if (directWhatsAppBtn) {
        directWhatsAppBtn.addEventListener('click', () => {
            const title = document.getElementById('modalTitle').textContent.trim();
            const price = document.getElementById('modalPrice').textContent.trim();
            const size = document.getElementById('selectedSizeLabel') ? document.getElementById('selectedSizeLabel').textContent.trim() : 'M';

            // نص الرسالة الموجهة للواتساب
            const msg = `Bonjour YORAX, je souhaite commander directement :\n- Produit : ${title}\n- Taille : ${size}\n- Prix : ${price}`;

            // تكوين الرابط المباشر دون رموز زائدة
            const whatsappUrl = `https://wa.me/${BRAND_PHONE}?text=${encodeURIComponent(msg)}`;

            // التوجيه المباشر المضمون للهواتف
            window.location.href = whatsappUrl;
        });
    }

    // 5. Add to Cart Button inside Preview
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            const modal = document.getElementById('productPreviewModal');
            const productId = modal.getAttribute('data-active-id');
            const product = productsData.find(p => p.id === productId);

            if (product) {
                addToCart(product, selectedSize);
                modal.classList.remove('active');
                openThankYouModal();
            }
        });
    }

    // 6. WhatsApp Checkout from Cart Drawer
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Votre panier est vide!");
                return;
            }

            let cartMessage = "Bonjour YORAX, je souhaite valider ma commande :\n\n";
            let subtotal = 0;

            cart.forEach((item, idx) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                cartMessage += `${idx + 1}. ${item.title} (Taille: ${item.size}) x${item.quantity} = ${itemTotal.toFixed(2)} TND\n`;
            });

            const shipping = 7.00;
            const grandTotal = subtotal + shipping;

            cartMessage += `\nSous-total : ${subtotal.toFixed(2)} TND`;
            cartMessage += `\nLivraison : ${shipping.toFixed(2)} TND`;
            cartMessage += `\nTOTAL : ${grandTotal.toFixed(2)} TND\n\nMerci de me contacter pour la livraison!`;

            const whatsappUrl = `https://wa.me/${BRAND_PHONE}?text=${encodeURIComponent(cartMessage)}`;
            window.location.href = whatsappUrl;
        });
    }
}

// ==========================================================================
// CART DRAWER LOGIC
// ==========================================================================
function addToCart(product, size) {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update Badges
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartDrawerCount = document.getElementById('cartDrawerCount');
    if (cartCountBadge) cartCountBadge.textContent = totalCount;
    if (cartDrawerCount) cartDrawerCount.textContent = totalCount;

    // Render Items
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#8c8c8c; margin-top:40px;">Votre panier est vide.</p>`;
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-size">Taille: ${item.size}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} TND</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 7.00 : 0.00;
    const total = subtotal + shipping;

    if (document.getElementById('cartSubtotalText')) document.getElementById('cartSubtotalText').textContent = `${subtotal.toFixed(2)} TND`;
    if (document.getElementById('cartShippingText')) document.getElementById('cartShippingText').textContent = `${shipping.toFixed(2)} TND`;
    if (document.getElementById('cartTotalText')) document.getElementById('cartTotalText').textContent = `${total.toFixed(2)} TND`;
}

window.updateQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
};

// ==========================================================================
// MODALS TOGGLES
// ==========================================================================
function setupModals() {
    // Cart Drawer Toggle
    const cartBtn = document.getElementById('cartToggleBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');

    if (cartBtn && drawer && overlay) {
        cartBtn.addEventListener('click', () => {
            drawer.classList.add('open');
            overlay.classList.add('active');
        });
    }

    const closeCart = () => {
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    };

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // Close Preview Modal
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const previewModal = document.getElementById('productPreviewModal');
    if (closePreviewBtn && previewModal) {
        closePreviewBtn.addEventListener('click', () => previewModal.classList.remove('active'));
    }

    // Close Thank You Modal
    const closeThankYouBtn = document.getElementById('closeThankYouBtn');
    const thankYouModal = document.getElementById('thankYouModal');
    if (closeThankYouBtn && thankYouModal) {
        closeThankYouBtn.addEventListener('click', () => thankYouModal.classList.remove('active'));
    }
}

function openThankYouModal() {
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) thankYouModal.classList.add('active');
}
