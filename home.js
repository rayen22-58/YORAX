/**
 * ============================================================================
 * YORAX STREETWEAR - HOMEPAGE CONTROLLER (HOME.JS)
 * ============================================================================
 */

let currentSelectedProduct = null;
let currentSelectedSize = "S";
let activeCategoryFilter = "all";

// ============================================================================
// 1. RENDER DES ARTICLES DANS LA GRILLE
// ============================================================================
function renderProductGrid(products) {
  const gridContainer = document.getElementById("products-grid");
  if (!gridContainer) return;

  gridContainer.innerHTML = "";

  if (!products || products.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-results">
        <p>Aucun article ne correspond à votre recherche.</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image" onclick="openProductModal('${product.id}')">
        <img src="${product.mainImage}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="category">${product.category}</span>
        <h3 class="title" onclick="openProductModal('${product.id}')">${product.name}</h3>
        
        <div class="price-box">
          <span class="price">${product.price.toFixed(2)} ${STORE_CONFIG.currency}</span>
          ${product.originalPrice > product.price ? `<span class="old-price">${product.originalPrice.toFixed(2)} ${STORE_CONFIG.currency}</span>` : ''}
        </div>

        <button class="btn-view" onclick="openProductModal('${product.id}')">
          VOIR ARTICLE
        </button>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}

// ============================================================================
// 2. FILTRES & BARRE DE RECHERCHE
// ============================================================================
function filterProducts() {
  const searchInput = document.getElementById("search-input");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = PRODUCTS_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(query) || 
                          product.category.toLowerCase().includes(query);
    const matchesCategory = (activeCategoryFilter === "all") || (product.category === activeCategoryFilter);

    return matchesSearch && matchesCategory;
  });

  renderProductGrid(filtered);
}

function filterByCategory(category) {
  activeCategoryFilter = category;
  
  // Mettre à jour l'état visuel des boutons de filtres
  document.querySelectorAll(".tag-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
  filterProducts();
}

// ============================================================================
// 3. MODAL VUE ARTICLE EN GRAND (PREVIEW MODAL)
// ============================================================================
function openProductModal(productId) {
  currentSelectedProduct = PRODUCTS_DATA.find(p => p.id === productId);
  if (!currentSelectedProduct) return;

  // Réinitialiser la taille sélectionnée par défaut
  currentSelectedSize = currentSelectedProduct.sizes[0] || "S";

  // Remplir les données dans le Modal
  document.getElementById("modal-img").src = currentSelectedProduct.mainImage;
  document.getElementById("modal-title").textContent = currentSelectedProduct.name;
  document.getElementById("modal-category").textContent = currentSelectedProduct.category.toUpperCase();
  document.getElementById("modal-price").textContent = `${currentSelectedProduct.price.toFixed(2)} ${STORE_CONFIG.currency}`;
  document.getElementById("modal-old-price").textContent = 
    currentSelectedProduct.originalPrice > currentSelectedProduct.price 
      ? `${currentSelectedProduct.originalPrice.toFixed(2)} ${STORE_CONFIG.currency}` 
      : "";
  
  document.getElementById("modal-desc").textContent = currentSelectedProduct.fullDescription;

  // Afficher les Tailles Exclusives (S, M, L)
  const sizeContainer = document.getElementById("modal-sizes");
  sizeContainer.innerHTML = "";
  currentSelectedProduct.sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.className = `size-btn ${size === currentSelectedSize ? 'active' : ''}`;
    btn.textContent = size;
    btn.onclick = () => {
      currentSelectedSize = size;
      document.querySelectorAll('#modal-sizes .size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    sizeContainer.appendChild(btn);
  });

  // Afficher les caractéristiques techniques
  const featuresList = document.getElementById("modal-features-list");
  featuresList.innerHTML = "";
  currentSelectedProduct.features.forEach(feat => {
    const li = document.createElement("li");
    li.textContent = feat;
    featuresList.appendChild(li);
  });

  // Afficher l'overlay du Modal
  document.getElementById("product-modal-overlay").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("product-modal-overlay").classList.add("hidden");
}

function addModalItemToCart() {
  if (!currentSelectedProduct) return;
  globalCart.addItem(currentSelectedProduct.id, currentSelectedSize, 1);
  closeProductModal();
}

function directWhatsAppFromModal() {
  if (!currentSelectedProduct) return;
  globalCart.addItem(currentSelectedProduct.id, currentSelectedSize, 1);
  closeProductModal();
  globalCart.checkoutToWhatsApp();
}

// ============================================================================
// 4. OVERLAYS & POPUPS (WELCOME, THANK YOU, EXIT INTENT)
// ============================================================================
function closeWelcomeCard() {
  document.getElementById("welcome-card-overlay").classList.add("hidden");
}

function showThankYouCard(title, message) {
  document.getElementById("thank-you-title").textContent = title;
  document.getElementById("thank-you-msg").textContent = message;
  document.getElementById("thank-you-overlay").classList.remove("hidden");
}

function closeThankYouCard() {
  document.getElementById("thank-you-overlay").classList.add("hidden");
}

// Exit Intent System (Détecter le mouvement de la souris vers le haut pour quitter)
let isExitCardTriggered = false;
document.addEventListener("mouseleave", (event) => {
  if (event.clientY < 0 && !isExitCardTriggered) {
    isExitCardTriggered = true;
    document.getElementById("exit-card-overlay").classList.remove("hidden");
  }
});

function closeExitCard() {
  document.getElementById("exit-card-overlay").classList.add("hidden");
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  renderProductGrid(PRODUCTS_DATA);
});