// ==========================================================================
// YORAX STREETWEAR - FULL FUNCTIONAL LOGIC (2026)
// ==========================================================================

// 1. رقم الواتساب الرسمي (216 متبوعة بـ 8 أرقام)
const BRAND_PHONE = "21699000000"; // بدّل 99000000 برقمك الشخصي

// 2. قائمة المنتجات
const productsData = [
    {
        id: "yrx-01",
        title: "HOODIE OVERSIZED BLACK WOLF",
        category: "Hoodies",
        price: 89.00,
        originalPrice: 110.00,
        image: "images/products/hoodie-1.jpg",
        images: ["images/products/hoodie-1.jpg"],
        specs: [
            "Coton 100% Ultra-Lourd Premium (400 GSM)",
            "Coupe Oversized Streetwear",
            "Impression DTF Haute Qualité YORAX",
            "Fabriqué en Tunisie"
        ]
    },
    {
        id: "yrx-02",
        title: "HOODIE MINIMALIST DARK EDITION",
        category: "Hoodies",
        price: 95.00,
        originalPrice: 120.00,
        image: "images/products/hoodie-2.jpg",
        images: ["images/products/hoodie-2.jpg"],
        specs: [
            "Coton Molletonné Épais",
            "Coupe Relaxed / Oversized",
            "Design Minimaliste Noir & Blanc"
        ]
    }
];

// App State
let cart = [];
let currentCategory = "Tous";
let currentSearchQuery = "";
let selectedSize = "M";

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    setupModals();
    setupAuthLogic();
});

// Render Products Grid
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const countElement = document.getElementById('productResultsCount');
    if (!grid) return;

    const filtered = productsData.filter(p => {
        const matchesCategory = (currentCategory === "Tous") || (p.category === currentCategory);
        const matchesSearch = p.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (countElement) countElement.textContent = `${filtered.length} Produit${filtered.length > 1 ? 's' : ''}`;

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

// Preview Modal Logic
window.openProductPreview = function(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productPreviewModal');
    document.getElementById('modalMainImg').src = product.image;
    document.getElementById('modalSku').textContent = product.id.toUpperCase();
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalPrice').textContent = `${product.price.toFixed(2)} TND`;
    
    const origPriceEl = document.getElementById('modalOriginalPrice');
    if (origPriceEl) origPriceEl.textContent = product.originalPrice ? `${product.originalPrice.toFixed(2)} TND` : '';

    const thumbsContainer = document.getElementById('modalGalleryThumbs');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = (product.images || [product.image]).map((imgSrc, idx) => `
            <img src="${imgSrc}" class="${idx === 0 ? 'active' : ''}" onclick="changePreviewImage('${imgSrc}', this)">
        `).join('');
    }

    const specsContainer = document.getElementById('modalSpecsList');
    if (specsContainer && product.specs) {
        specsContainer.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');
    }

    modal.setAttribute('data-active-id', product.id);
    modal.classList.add('active');
};

window.changePreviewImage = function(imgSrc, thumbElement) {
    document.getElementById('modalMainImg').src = imgSrc;
    document.querySelectorAll('.gallery-thumbs img').forEach(img => img.classList.remove('active'));
    thumbElement.classList.add('active');
};

// Event Listeners
function setupEventListeners() {
    // Search
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

    // Category Filter
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderProducts();
        });
    });

    // Size Selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
            const label = document.getElementById('selectedSizeLabel');
            if (label) label.textContent = selectedSize;
        });
    });

    // Direct WhatsApp inside Preview
    const directWhatsAppBtn = document.getElementById('modalDirectWhatsAppBtn');
    if (directWhatsAppBtn) {
        directWhatsAppBtn.addEventListener('click', () => {
            const title = document.getElementById('modalTitle').textContent.trim();
            const price = document.getElementById('modalPrice').textContent.trim();
            const size = document.getElementById('selectedSizeLabel') ? document.getElementById('selectedSizeLabel').textContent.trim() : 'M';

            const msg = `Bonjour YORAX, je souhaite commander directement :\n- Produit : ${title}\n- Taille : ${size}\n- Prix : ${price}`;
            window.location.href = `https://wa.me/${BRAND_PHONE}?text=${encodeURIComponent(msg)}`;
        });
    }

    // Add to Cart from Preview
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

    // Full Cart Checkout via WhatsApp (مع الاسم والعنوان والهاتف)
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Votre panier est vide!");
                return;
            }

            const name = document.getElementById('custName').value.trim();
            const address = document.getElementById('custAddress').value.trim();
            const phone = document.getElementById('custPhone').value.trim();

            if (!name || !address || !phone) {
                alert("Veuillez remplir votre Nom, Adresse et Téléphone avant de commander!");
                return;
            }

            let cartMessage = `Bonjour YORAX, nouvelle commande :\n\n`;
            cartMessage += `👤 Client : ${name}\n`;
            cartMessage += `📍 Adresse : ${address}\n`;
            cartMessage += `📞 Téléphone : ${phone}\n\n`;
            cartMessage += `📦 Articles :\n`;

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
            cartMessage += `\nTOTAL : ${grandTotal.toFixed(2)} TND`;

            window.location.href = `https://wa.me/${BRAND_PHONE}?text=${encodeURIComponent(cartMessage)}`;
        });
    }
}

// Cart Drawer Management
function addToCart(product, size) {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, size: size, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cartCountBadge').textContent = totalCount;
    document.getElementById('cartDrawerCount').textContent = totalCount;

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

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 7.00 : 0.00;
    const total = subtotal + shipping;

    if (document.getElementById('cartSubtotalText')) document.getElementById('cartSubtotalText').textContent = `${subtotal.toFixed(2)} TND`;
    if (document.getElementById('cartShippingText')) document.getElementById('cartShippingText').textContent = `${shipping.toFixed(2)} TND`;
    if (document.getElementById('cartTotalText')) document.getElementById('cartTotalText').textContent = `${total.toFixed(2)} TND`;
}

window.updateQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
};

// Modals Toggles
function setupModals() {
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

    const closePreviewBtn = document.getElementById('closePreviewBtn');
    const previewModal = document.getElementById('productPreviewModal');
    if (closePreviewBtn && previewModal) {
        closePreviewBtn.addEventListener('click', () => previewModal.classList.remove('active'));
    }

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

// Auth Modal Logic
function setupAuthLogic() {
    const loginBtn = document.getElementById('loginToggleBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = document.getElementById('closeLoginBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const loginModalTitle = document.getElementById('loginModalTitle');
    const switchAuthText = document.getElementById('switchAuthText');
    const loginForm = document.getElementById('loginForm');

    let isRegisterMode = false;

    if (loginBtn && loginModal) loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
    if (closeLoginBtn && loginModal) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('active'));

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;
            if (isRegisterMode) {
                loginModalTitle.textContent = "CRÉER UN COMPTE";
                switchAuthText.textContent = "Déjà un compte ?";
                toggleAuthMode.textContent = "Se connecter";
            } else {
                loginModalTitle.textContent = "CONNEXION";
                switchAuthText.textContent = "Vous n'avez pas de compte ?";
                toggleAuthMode.textContent = "S'inscrire";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            alert(isRegisterMode ? `Bienvenue chez YORAX ! Compte créé pour ${email}` : `Connecté avec succès : ${email}`);
            loginModal.classList.remove('active');
        });
    }
}
