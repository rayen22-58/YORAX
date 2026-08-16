/**
 * ============================================================================
 * YORAX STREETWEAR - CORE ENGINE & DATA STORE (INDEX.JS)
 * Brand: YORAX (The Black Wolf)
 * Visual Identity: Minimalist Black & White
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION GLOBALE & REGLAGES FACILES
// ============================================================================
const STORE_CONFIG = {
  brandName: "YORAX",
  brandSubtitle: "THE BLACK WOLF",
  currency: "TND",
  shippingFee: 7.00, // Frais de livraison en TND
  whatsappNumber: "42463318", // NUMERO WHATSAPP (Format: 216XXXXXXXX)
  instagramHandle: "@yorax.brand",
  instagramUrl: "https://instagram.com/yorax.brand",
  supportEmail: "rayengamdou7@.com"
};

// ============================================================================
// BASE DE DONNÉES CATALOGUE (6 ARTICLES EXCLUSIFS - TAILLES: S, M, L)
// ============================================================================
const PRODUCTS_DATA = [
  {
    id: "yorax-001",
    sku: "YRX-TEE-BLK-01",
    name: "Oversized Heavyweight Tee",
    category: "t-shirts",
    price: 45.00,
    originalPrice: 55.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Noir Pure"],
    mainImage: "ChaseRBack.jpg",
    gallery: ["ChaseRBack.jpg", "ChaseRFace.jpg"],
    shortDescription: "T-shirt noir coupe oversized d'inspiration streetwear minimaliste.",
    fullDescription: "T-shirt noir coupe oversized fabriqué en coton ultra-lourd 240 GSM. Conçu pour résister au temps et offrir une tenue parfaite sans déformation.",
    features: [
      "100% Coton peigné haut de gamme",
      "Grammage lourd : 240 GSM",
      "Impression DTF haute définition",
      "Épaules tombantes (Drop Shoulders)"
    ]
  },
  {
    id: "yorax-002",
    sku: "YRX-HOOD-BLK-02",
    name: "Minimalist Heavy Hoodie",
    category: "hoodies",
    price: 85.00,
    originalPrice: 100.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Noir Mat"],
    mainImage: "DarkAngle.jpg",
    gallery: ["DarkAngle.jpg"],
    shortDescription: "Sweat à capuche molletonné coupe boxy 400 GSM.",
    fullDescription: "Sweat à capuche molletonné coupe boxy. Épaisseur idéale de 400 GSM pour un style épuré, lourd et structuré.",
    features: [
      "Coton molleton épais 400 GSM",
      "Capuche double épaisseur sans cordon",
      "Poche kangourou renforcée"
    ]
  },
  {
    id: "yorax-003",
    sku: "YRX-SWEAT-WHT-03",
    name: "Signature White Crewneck",
    category: "sweatshirts",
    price: 75.00,
    originalPrice: 75.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Blanc Cassé"],
    mainImage: "DeadInternetBack.jpg",
    gallery: ["DeadInternetBack.jpg","DeadInternetFace"],
    shortDescription: "Crewneck blanc cassé avec logo YORAX brodé en micro-format.",
    fullDescription: "Crewneck blanc cassé avec logo YORAX brodé en micro-format sur la poitrine. Un design intemporel et épuré.",
    features: [
      "100% Coton Fleece 350 GSM",
      "Broderie haute densité sur la poitrine",
      "Bords-côtes renforcés aux poignets"
    ]
  },
  {
    id: "yorax-004",
    sku: "YRX-CAP-BLK-04",
    name: "YORAX Black Cap",
    category: "accessories",
    price: 30.00,
    originalPrice: 35.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Noir"],
    mainImage: "Discplin.jpg",
    gallery: ["Discpline.jpg"],
    shortDescription: "Casquette noire brodée avec lanière ajustable en métal.",
    fullDescription: "Casquette noire brodée avec lanière ajustable en métal à l'arrière. Accessoire minimaliste indispensable.",
    features: [
      "100% Coton sergé résistant",
      "Fermeture métallique ajustable",
      "Broderie 3D YORAX frontale"
    ]
  },
  {
    id: "yorax-005",
    sku: "YRX-TEE-WHT-05",
    name: "Oversized White Tee",
    category: "t-shirts",
    price: 45.00,
    originalPrice: 55.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Blanc Pure"],
    mainImage: "EnjoyTheSilence.jpg",
    gallery: ["EnjoyTheSilence.jpg"],
    shortDescription: "T-shirt blanc pure coupe oversized 240 GSM.",
    fullDescription: "T-shirt blanc pure coupe oversized 240 GSM. Le minimalisme absolu pour la saison estivale.",
    features: [
      "100% Coton peigné 240 GSM",
      "Coupe décontractée oversized",
      "Col rond à bord-côte solide"
    ]
  },
  {
    id: "yorax-006",
    sku: "YRX-ZIP-BLK-06",
    name: "Minimalist Zip Hoodie",
    category: "hoodies",
    price: 90.00,
    originalPrice: 110.00,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: ["Noir Mat"],
    mainImage: "StormNight.jpg",
    gallery: ["StormNight.jpg"],
    shortDescription: "Sweat zippé à capuche noir en coton lourd.",
    fullDescription: "Sweat zippé à capuche noir en coton lourd avec fermeture métallique robuste. Style polyvalent et confort moderne.",
    features: [
      "Coton molleton 380 GSM",
      "Zip métallique argenté haute résistance",
      "Double couture de finition"
    ]
  }
];

// ============================================================================
// GESTIONNAIRE DE PANIER AVANCÉ (CART SYSTEM & WHATSAPP)
// ============================================================================
class YoraxCartManager {
  constructor() {
    this.storageKey = "yorax_cart_session_v4";
    this.cart = this.loadFromStorage();
  }

  // Charger le panier depuis LocalStorage
  loadFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("[YORAX STORAGE ERROR] Impossible de charger le panier:", error);
      return [];
    }
  }

  // Sauvegarder le panier dans LocalStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateCartBadge();
    } catch (error) {
      console.error("[YORAX STORAGE ERROR] Impossible de sauvegarder le panier:", error);
    }
  }

  // Ajouter un produit au panier
  addItem(productId, selectedSize = "M", quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) {
      console.error(`[YORAX ERROR] Produit ID ${productId} introuvable.`);
      return false;
    }

    const existingIndex = this.cart.findIndex(
      item => item.id === productId && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        selectedSize: selectedSize,
        quantity: quantity
      });
    }

    this.saveToStorage();
    
    // Déclencher la Thank You Card Popup
    if (typeof showThankYouCard === "function") {
      showThankYouCard(
        "ARTICLE AJOUTÉ !",
        `${product.name} (Taille: ${selectedSize}) a été ajouté à votre panier.`
      );
    }

    return true;
  }

  // Supprimer un article du panier
  removeItem(productId, selectedSize) {
    this.cart = this.cart.filter(
      item => !(item.id === productId && item.selectedSize === selectedSize)
    );
    this.saveToStorage();
  }

  // Calcul du Sous-Total
  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Calcul du Total avec Livraison
  getTotalPrice() {
    const subtotal = this.getSubtotal();
    return subtotal > 0 ? subtotal + STORE_CONFIG.shippingFee : 0;
  }

  // Nombre total d'articles
  getTotalItemsCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Mettre à jour le badge du panier dans le header
  updateCartBadge() {
    const badgeElement = document.getElementById("cart-count-badge");
    if (badgeElement) {
      badgeElement.textContent = this.getTotalItemsCount();
    }
  }

  // Transmettre la commande vers WhatsApp
  checkoutToWhatsApp() {
    if (this.cart.length === 0) {
      alert("Votre panier est vide pour le moment.");
      return;
    }

    let message = `*NOUVELLE COMMANDE - ${STORE_CONFIG.brandName}*\n`;
    message += `-----------------------------------\n`;

    this.cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Taille: ${item.selectedSize}\n`;
      message += `   • Quantité: ${item.quantity}\n`;
      message += `   • Prix: ${item.price.toFixed(2)} ${STORE_CONFIG.currency}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `Sous-total: ${this.getSubtotal().toFixed(2)} ${STORE_CONFIG.currency}\n`;
    message += `Livraison: ${STORE_CONFIG.shippingFee.toFixed(2)} ${STORE_CONFIG.currency}\n`;
    message += `*TOTAL À PAYER: ${this.getTotalPrice().toFixed(2)} ${STORE_CONFIG.currency}*\n`;
    message += `-----------------------------------\n`;
    message += `Merci de me confirmer la disponibilité et les modalités de livraison.`;

    if (typeof showThankYouCard === "function") {
      showThankYouCard(
        "THANK YOU FOR YOUR ORDER!",
        "Votre commande a été préparée. Redirection vers WhatsApp en cours..."
      );
    }

    setTimeout(() => {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");
    }, 1500);
  }
}

// Global Cart Instance
const globalCart = new YoraxCartManager();

document.addEventListener("DOMContentLoaded", () => {
  globalCart.updateCartBadge();
});