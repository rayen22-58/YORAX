/* ==========================================================================
   YORAX STREETWEAR - UI CONTROLLER & MODALS (2026)
   ========================================================================== */

let selectedPreviewProduct = null;
let currentSelectedSize = "M";

document.addEventListener('DOMContentLoaded', () => {
    initProductGrid(PRODUCTS_DATABASE);
    updateCartUI();
    initModalEvents();
    initSearchAndFilters();
    initExitIntent();
    showWelcomeModalOnce();
});

// 1. Render Products
function initProductGrid(products) {
    const grid = document.getElementById('productGrid');
    const countLabel = document.getElementById('productResultsCount');
    grid.innerHTML = '';

    countLabel.textContent = `${products.length} Produit(s)`;

    if (products.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">Aucun produit ne correspond à votre recherche.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-wrap" onclick="openProductPreview('${product.id}')">
                <span class="sku-tag">${product.sku}</span>
                <img src="${product.mainImage}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x500/141414/ffffff?text=YORAX'">
            </div>
            <div class="card-info">
                <span class="product-cat">${product.category}</span>
                <h3 class="product-title" onclick="openProductPreview('${product.id}')">${product.name}</h3>
                <div class="price-row">
                    <span class="price">${product.price.toFixed(2)} TND</span>
                    ${product.originalPrice ? `<span class="orig-price">${product.originalPrice.toFixed(2)} TND</span>` : ''}
                </div>
                <div class="card-buttons">
                    <button class="btn-quick-view" onclick="openProductPreview('${product.id}')">VOIR LE PRODUIT</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 2. Search & Category Filter Logic
function initSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const categoryBtns = document.querySelectorAll('.category-pill');

    let activeCategory = "Tous";

    function filterProducts() {
        const query = searchInput.value.toLowerCase().trim();
        
        const filtered = PRODUCTS_DATABASE.filter(p => {
            const matchesCat = (activeCategory === "Tous") || (p.category === activeCategory);
            const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query);
            return matchesCat && matchesQuery;
        });

        initProductGrid(filtered);

        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterProducts);
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterProducts();
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            filterProducts();
        });
    });
}

// 3. Modals & Overlay Logic
function initModalEvents() {
    // Welcome Modal
    document.getElementById('closeWelcomeBtn').addEventListener('click', () => closeModal('welcomeModal'));
    document.getElementById('exploreCollectionBtn').addEventListener('click', () => closeModal('welcomeModal'));

    // Exit Intent Modal
    document.getElementById('closeExitBtn').addEventListener('click', () => closeModal('exitIntentModal'));
    document.getElementById('continueShoppingBtn').addEventListener('click', () => closeModal('exitIntentModal'));

    // Thank You Modal
    document.getElementById('closeThankYouBtn').addEventListener('click', () => closeModal('thankYouModal'));

    // Preview Modal
    document.getElementById('closePreviewBtn').addEventListener('click', () => closeModal('productPreviewModal'));

    // Size Selector Buttons inside Preview Modal
    const sizeBtns = document.querySelectorAll('.size-options .size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSelectedSize = btn.dataset.size;
            document.getElementById('selectedSizeLabel').textContent = currentSelectedSize;
        });
    });

    // Add to Cart inside Preview
    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
        if (selectedPreviewProduct) {
            addToCart(selectedPreviewProduct.id, currentSelectedSize, 1);
            closeModal('productPreviewModal');
            showThankYouModal(`"<b>${selectedPreviewProduct.name}</b>" (Taille ${currentSelectedSize}) a été ajouté au panier.`);
        }
    });

    // Direct WhatsApp inside Preview
  // 1. تثبيت رقم الهاتف بصيغة تونس الصحيحة (بدون + وبدون مسافات)
const brandPhone = "42463318"; // بدّل 99000000 برقمك التونسي المتكون من 8 أرقام

// 2. الكود الخاص بزر الـ WhatsApp المباشر داخل الـ Preview Modal
document.getElementById('modalDirectWhatsAppBtn').addEventListener('click', () => {
    // جلب اسم المنتج والمقاس المختار من الـ Modal
    const title = document.getElementById('modalTitle').innerText;
    const price = document.getElementById('modalPrice').innerText;
    const size = document.getElementById('selectedSizeLabel').innerText;

    // صياغة الرسالة الموجهة للبراند
    const message = `Bonjour YORAX, je souhaite commander directement :
- Produit : ${title}
- Taille : ${size}
- Prix : ${price}`;

    // تكوين الرابط المتوافق تماماً مع التليفونات والتطبيقات
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${brandPhone}&text=${encodeURIComponent(message)}`;

    // فتح تطبيق الواتساب
    window.open(whatsappUrl, '_blank');
});

    // Cart Drawer Toggle
    document.getElementById('cartToggleBtn').addEventListener('click', toggleCartDrawer);
    document.getElementById('closeCartBtn').addEventListener('click', toggleCartDrawer);
    document.getElementById('cartDrawerOverlay').addEventListener('click', toggleCartDrawer);

    // WhatsApp Checkout Button
    document.getElementById('whatsappCheckoutBtn').addEventListener('click', () => {
        const msg = generateWhatsAppMessage();
        if (msg) {
            window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`, '_blank');
        } else {
            alert('Votre panier est vide.');
        }
    });
}

// Show Welcome Modal Once Per Session
function showWelcomeModalOnce() {
    if (!sessionStorage.getItem('YORAX_WELCOME_SHOWN')) {
        setTimeout(() => {
            openModal('welcomeModal');
            sessionStorage.setItem('YORAX_WELCOME_SHOWN', 'true');
        }, 800);
    }
}

// Exit Intent Detector
function initExitIntent() {
    let exitShown = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitShown && !sessionStorage.getItem('YORAX_EXIT_SHOWN')) {
            openModal('exitIntentModal');
            exitShown = true;
            sessionStorage.setItem('YORAX_EXIT_SHOWN', 'true');
        }
    });
}

// Open Large Preview Modal
function openProductPreview(productId) {
    const product = PRODUCTS_DATABASE.find(p => p.id === productId);
    if (!product) return;

    selectedPreviewProduct = product;
    currentSelectedSize = "M"; // Reset to default

    document.getElementById('modalSku').textContent = product.sku;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `${product.price.toFixed(2)} TND`;
    document.getElementById('modalOriginalPrice').textContent = product.originalPrice ? `${product.originalPrice.toFixed(2)} TND` : '';
    document.getElementById('modalMainImg').src = product.mainImage;
    document.getElementById('selectedSizeLabel').textContent = currentSelectedSize;

    // Reset Active Size UI
    const sizeBtns = document.querySelectorAll('.size-options .size-btn');
    sizeBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.size === "M");
    });

    // Populate Tech Specs
    const specsList = document.getElementById('modalSpecsList');
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });

    // Gallery Thumbnails
    const thumbsContainer = document.getElementById('modalGalleryThumbs');
    thumbsContainer.innerHTML = '';
    product.gallery.forEach((imgUrl, idx) => {
        const thumb = document.createElement('img');
        thumb.src = imgUrl;
        if (idx === 0) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            document.getElementById('modalMainImg').src = imgUrl;
            thumbsContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbsContainer.appendChild(thumb);
    });

    openModal('productPreviewModal');
}

// Modal Helpers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showThankYouModal(msg) {
    document.getElementById('thankYouMessage').innerHTML = msg;
    openModal('thankYouModal');
}

// Toggle Cart Drawer
function toggleCartDrawer() {
    document.getElementById('cartDrawer').classList.toggle('open');
    document.getElementById('cartDrawerOverlay').classList.toggle('active');
}

// Update Cart Drawer & Badges
function updateCartUI() {
    const totals = calculateCartTotals();
    
    document.getElementById('cartCountBadge').textContent = totals.itemCount;
    document.getElementById('cartDrawerCount').textContent = totals.itemCount;
    document.getElementById('cartSubtotalText').textContent = `${totals.subtotal} TND`;
    document.getElementById('cartShippingText').textContent = totals.subtotal > 150 ? "GRATUIT" : `${totals.shipping} TND`;
    document.getElementById('cartTotalText').textContent = `${totals.total} TND`;

    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';

    if (shoppingCart.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #666; margin-top: 40px;">Votre panier est actuellement vide.</p>`;
        return;
    }

    shoppingCart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-size">Taille: ${item.size}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} TND</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateItemQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}
