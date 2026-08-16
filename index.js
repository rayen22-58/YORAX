/* ==========================================================================
   YORAX STREETWEAR - STORE ENGINE & DATABASE (2026)
   ========================================================================== */

// 1. Store Configuration
const STORE_CONFIG = {
    brandName: "YORAX",
    brandSubtitle: "THE BLACK WOLF STREETWEAR",
    currency: "TND",
    shippingFee: 7.00,
    whatsappNumber: "42463318" // Remplacez par votre numéro tunisien (ex: 216XXXXXXXX)
};

// 2. Database of 6 Products
const PRODUCTS_DATABASE = [
    {
        id: "yrx-001",
        sku: "YRX-TS-01",
        name: "YORAX OVERSIZED BLACK TEE",
        category: "T-Shirts",
        price: 49.00,
        originalPrice: 65.00,
        mainImage: "assets/mockup/hoodie/ChaseRBack.jpg",
        gallery: [
            "assets/mockup/hoodie/ChaseRFace.jpg",
            
        ],
        specs: [
            "Grammage : 240 GSM Premium Heavyweight",
            "Matière : 100% Coton peigné tunisien",
            "Coupe : Oversized avec Drop Shoulders",
            "Sérigraphie : Impression high-density YORAX chest logo"
        ]
    },
    {
        id: "yrx-002",
        sku: "YRX-HD-01",
        name: "THE BLACK WOLF HEAVY HOODIE",
        category: "Hoodies",
        price: 99.00,
        originalPrice: 125.00,
        mainImage: "assets/mockup/hoodie/DarkAngle.jpg",
        gallery: [
            "images/hoodie-black-1.jpg",
            "images/hoodie-black-2.jpg"
        ],
        specs: [
            "Grammage : 400 GSM Ultra-dense Fleece",
            "Matière : 100% Coton Molletonné",
            "Coupe : Boxy Fit Oversized",
            "Capuche doublée sans cordon pour un look minimaliste"
        ]
    },
    {
        id: "yrx-003",
        sku: "YRX-SW-01",
        name: "DARK MINIMALIST SWEATSHIRT",
        category: "Sweatshirts",
        price: 79.00,
        originalPrice: 95.00,
        mainImage: "assets/mockup/hoodie/DeadInternetBack.jpg",
        gallery: [
            "assets/mockup/hoodie/DeadInternetFace.jpg"
        ],
        specs: [
            "Grammage : 350 GSM Coton Doux",
            "Matière : 100% Coton Premium",
            "Finition : Bords-côtes renforcés aux poignets",
            "Coupe : Streetwear Ample"
        ]
    },
    {
        id: "yrx-004",
        sku: "YRX-TS-02",
        name: "WHITE LOGO OVERSIZED TEE",
        category: "T-Shirts",
        price: 49.00,
        originalPrice: 60.00,
        mainImage: "assets/mockup/hoodie/Discipline.jpg",
        gallery: [
            "assets/mockup/hoodie/Discipline.jpg"
        ],
        specs: [
            "Grammage : 240 GSM Heavy Coton Blanc",
            "Matière : 100% Coton Pure",
            "Impression : Subtile broderie 'THE BLACK WOLF'"
        ]
    },
    {
        id: "yrx-005",
        sku: "YRX-HD-02",
        name: "ACID WASH OVERSIZED HOODIE",
        category: "Hoodies",
        price: 109.00,
        originalPrice: 135.00,
        mainImage: "assets/mockup/hoodie/EnjoyTheSilence.jpg",
        gallery: [
            "assets/mockup/hoodie/EnjoyTheSilence.jpg"
        ],
        specs: [
            "Grammage : 420 GSM Acid Wash Custom",
            "Effet délavé fait main - Pièce unique",
            "Coupe : Extreme Oversized"
        ]
    },
    {
        id: "yrx-006",
        sku: "YRX-AC-01",
        name: "YORAX MINIMALIST BEANIE",
        category: "Accessories",
        price: 29.00,
        originalPrice: 38.00,
        mainImage: "assets/mockup/hoodie/StormNight.jpg",
        gallery: [
            "assets/mockup/hoodie/StormNight.jpg"
        ],
        specs: [
            "Matière : Maille 100% Acrylique douce",
            "Logo YORAX tissé sur le devant",
            "Taille unique élastique"
        ]
    }
];

// 3. Cart State Engine (Persisted via LocalStorage)
let shoppingCart = JSON.parse(localStorage.getItem('YORAX_CART')) || [];

function saveCartToStorage() {
    localStorage.setItem('YORAX_CART', JSON.stringify(shoppingCart));
}

// Add item to cart
function addToCart(productId, size = "M", quantity = 1) {
    const product = PRODUCTS_DATABASE.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = shoppingCart.findIndex(item => item.id === productId && item.size === size);
    
    if (existingIndex > -1) {
        shoppingCart[existingIndex].quantity += quantity;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.mainImage,
            size: size,
            quantity: quantity
        });
    }

    saveCartToStorage();
    updateCartUI();
}

// Remove or update quantity
function updateItemQuantity(index, newQty) {
    if (newQty <= 0) {
        shoppingCart.splice(index, 1);
    } else {
        shoppingCart[index].quantity = newQty;
    }
    saveCartToStorage();
    updateCartUI();
}

// Calculate totals
function calculateCartTotals() {
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 150 || subtotal === 0 ? 0.00 : STORE_CONFIG.shippingFee;
    const total = subtotal + shipping;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        itemCount: shoppingCart.reduce((sum, item) => sum + item.quantity, 0)
    };
}

// Format WhatsApp Order Message
function generateWhatsAppMessage() {
    if (shoppingCart.length === 0) return null;

    const totals = calculateCartTotals();
    let message = `*NOUVELLE COMMANDES - YORAX (THE BLACK WOLF)*\n`;
    message += `----------------------------------------\n`;

    shoppingCart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   • Taille: *${item.size}*\n`;
        message += `   • Qté: ${item.quantity} x ${item.price.toFixed(2)} TND = *${(item.quantity * item.price).toFixed(2)} TND*\n\n`;
    });

    message += `----------------------------------------\n`;
    message += `Sous-total: ${totals.subtotal} TND\n`;
    message += `Frais de livraison: ${totals.shipping} TND\n`;
    message += `*TOTAL À PAYER: ${totals.total} TND*\n`;
    message += `----------------------------------------\n`;
    message += `Merci de me confirmer la disponibilité et les détails de livraison !`;

    return encodeURIComponent(message);
}