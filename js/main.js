// State
const AppState = {
    products: products, // load from data.js
    filteredProducts: [],
    currentPage: 1,
    itemsPerPage: 20,
    currentCategory: 'all',
    searchQuery: '',
};

document.addEventListener('DOMContentLoaded', () => {
    // Init Cart
    Cart.init();

    // Initial Filter (All)
    filterProducts();
    
    // Setup UI Listeners
    setupNavigation();
    setupSearch();
    setupCheckout();
    setupScrollTop();
    setupProductDetails();
});

let currentDetailProduct = null;

function setupProductDetails() {
    // Create Detail Modal HTML if not exists
    if (!document.getElementById('product-detail-modal')) {
        const modal = document.createElement('div');
        modal.id = 'product-detail-modal';
        modal.className = 'modal details-modal';
        modal.innerHTML = `
            <div class="modal-content details-content">
                <button class="close-details-modal"><i class="fa-solid fa-xmark"></i></button>
                <div class="details-grid">
                    <div class="details-gallery">
                        <div class="main-image-container">
                            <img id="detail-main-img" src="" alt="">
                        </div>
                        <div id="detail-thumbnails" class="thumbnails-row">
                            <!-- Thumbnails -->
                        </div>
                    </div>
                    <div class="details-info">
                        <span id="detail-category" class="product-category"></span>
                        <h2 id="detail-title"></h2>
                        <div id="detail-price" class="product-price"></div>
                        <p id="detail-desc"></p>
                        
                        <div id="detail-variants-container" class="variants-group">
                            <label>Variante:</label>
                            <select id="detail-variant-select" class="variant-selector w-full"></select>
                        </div>

                        <button id="detail-add-btn" class="btn btn-primary btn-block">
                            Ajouter au panier <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close Logic
        const closeBtn = modal.querySelector('.close-details-modal');
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('open');
        });

        // Add to Cart Logic from Detail
        const addBtn = document.getElementById('detail-add-btn');
        addBtn.addEventListener('click', () => {
            if (currentDetailProduct) {
                const variantSelect = document.getElementById('detail-variant-select');
                const variant = variantSelect.value || null;
                Cart.addItem(currentDetailProduct, variant, 1);
                modal.classList.remove('open'); // Optional: close on add
            }
        });
    }
}

// Global open function
window.openProductDetail = (id) => {
    const product = AppState.products.find(p => p.id === id);
    if (!product) return;
    
    currentDetailProduct = product;
    
    const modal = document.getElementById('product-detail-modal');
    const mainImg = document.getElementById('detail-main-img');
    const thumbsContainer = document.getElementById('detail-thumbnails');
    const title = document.getElementById('detail-title');
    const price = document.getElementById('detail-price');
    const desc = document.getElementById('detail-desc');
    const cat = document.getElementById('detail-category');
    const variantSelect = document.getElementById('detail-variant-select');
    const variantContainer = document.getElementById('detail-variants-container');

    // Populate Info
    mainImg.src = product.image;
    title.textContent = product.name;
    price.textContent = formatCurrency(product.price);
    desc.textContent = product.description;
    cat.textContent = product.category;

    // Gallery Logic
    thumbsContainer.innerHTML = '';
    const images = product.images || [product.image];
    // Always include main image if not in array? usually data.js should have it. 
    // If only .image exists, use it. If .images exists, use it.
    
    images.forEach(imgSrc => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.className = 'thumbnail';
        thumb.onclick = () => mainImg.src = imgSrc;
        thumbsContainer.appendChild(thumb);
    });

    // Variants
    if (product.variants && product.variants.length > 0) {
        variantContainer.style.display = 'block';
        variantSelect.innerHTML = product.variants.map(v => `<option value="${v}">${v}</option>`).join('');
    } else {
        variantContainer.style.display = 'none';
        variantSelect.innerHTML = '';
    }

    modal.classList.add('open');
};

function setupScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupNavigation() {
    // Dropdown Logic
    const toggle = document.getElementById('category-toggle');
    const menu = document.getElementById('category-menu');
    
    if (toggle && menu) {
        // Toggle menu
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // Close on click outside
        document.addEventListener('click', () => {
             menu.classList.remove('show');
        });

        // 1. Get Categories
        const categories = ['all', ...new Set(products.map(p => p.category))];
        
        // 2. Build HTML
        menu.innerHTML = categories.map(cat => {
            const displayName = cat === 'all' ? 'Tous les articles' : cat.charAt(0).toUpperCase() + cat.slice(1);
            return `
            <a href="#" data-category="${cat}" class="${cat === 'all' ? 'active' : ''}">
                ${displayName}
            </a>
            `;
        }).join('');

        // Filter Click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Update active state
                menu.querySelectorAll('a').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update State
                AppState.currentCategory = e.target.dataset.category;
                AppState.currentOccasion = 'all'; // Reset sub-filter
                AppState.currentPage = 1; // Reset to page 1
                
                filterProducts();

                // Scroll to catalog
                document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

function setupSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('search-clear');

    const handleSearch = () => {
        AppState.searchQuery = input.value.trim().toLowerCase();
        AppState.currentPage = 1;
        filterProducts();
        
        // Scroll to catalog
        document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
    };

    const toggleClearBtn = () => {
        if (input.value.trim().length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
    };

    if (btn) btn.addEventListener('click', handleSearch);
    
    if (input) {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleSearch();
            toggleClearBtn();
        });
        
        // Also check on standard input event for pasting etc
        input.addEventListener('input', toggleClearBtn);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            AppState.searchQuery = '';
            AppState.currentPage = 1;
            filterProducts(); // Reset filter
            toggleClearBtn();
            input.focus();
        });
    }
}

function filterProducts() {
    // 1. Filter by Category & Search
    AppState.filteredProducts = AppState.products.filter(p => {
        const matchCat = AppState.currentCategory === 'all' || p.category === AppState.currentCategory;
        const matchSearch = p.name.toLowerCase().includes(AppState.searchQuery) || 
                          p.description.toLowerCase().includes(AppState.searchQuery);
        return matchCat && matchSearch;
    });

    // 2. Render
    renderProducts();
    renderPagination();
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Slice for Pagination
    const start = (AppState.currentPage - 1) * AppState.itemsPerPage;
    const end = start + AppState.itemsPerPage;
    const paginatedItems = AppState.filteredProducts.slice(start, end);

    if (paginatedItems.length === 0) {
        grid.innerHTML = `<div class="loading-state"><p>Aucun produit trouvé.</p></div>`;
        return;
    }

    grid.innerHTML = paginatedItems.map(product => {
        // Variant Selector
        let variantHtml = '';
        if (product.variants && product.variants.length > 0) {
            variantHtml = `
                <select class="variant-selector" id="variant-${product.id}">
                    ${product.variants.map(v => `<option value="${v}">${v}</option>`).join('')}
                </select>
            `;
        }

        return `
            <div class="product-card">
                <div class="product-image" onclick="openProductDetail(${product.id})" style="cursor: pointer;">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <div class="product-title" onclick="openProductDetail(${product.id})" style="cursor: pointer;">${product.name}</div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    
                    <div class="product-actions">
                        ${variantHtml}
                        <button class="btn btn-primary btn-block" onclick="addToCartHandler(${product.id})">
                            Ajouter <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(AppState.filteredProducts.length / AppState.itemsPerPage);
    
    // Hide if 1 page or less
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    
    // Prev
    html += `<button class="page-btn" ${AppState.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${AppState.currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;

    // Pages
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === AppState.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    // Next
    html += `<button class="page-btn" ${AppState.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${AppState.currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;

    container.innerHTML = html;
}

// Global for pagination onclick
window.changePage = (page) => {
    AppState.currentPage = page;
    renderProducts(); // Re-render current slice
    renderPagination(); // Update buttons styling
    
    // Scroll to top of catalog
    document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
};

function addToCartHandler(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let variant = null;
    const variantSelect = document.getElementById(`variant-${productId}`);
    if (variantSelect) {
        variant = variantSelect.value;
    } else if (product.variants && product.variants.length > 0) {
         variant = product.variants[0]; // fallback
    }

    Cart.addItem(product, variant, 1);
}

function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('checkout-form');

    // Open Modal
    checkoutBtn.addEventListener('click', () => {
        if (Cart.items.length === 0) {
            showToast('Votre panier est vide', 'error');
            return;
        }
        // Force cart close
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('open');
        
        modal.classList.add('open');
        Cart.renderInvoice(); // Refresh preview
    });

    // Close Modal
    const closeModal = () => modal.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const comments = document.getElementById('comments').value;

        // Construct Message
        let message = `*COMMANDE DEPUIS SITE WEB*\n\n`;
        message += `👤 *Client:* ${name}\n`;
        message += `📞 *Tel:* ${phone}\n`;
        message += `📍 *Adresse:* ${address}\n`;
        if (comments) message += `📝 *Note:* ${comments}\n`;
        message += `\n🛒 *PRODUITS COMMANDÉS*:\n`;

        Cart.items.forEach(item => {
            message += `- ${item.qty}x ${item.name} (${item.variant !== 'default' ? item.variant : 'Standard'}) : ${formatCurrency(item.price * item.qty)}\n`;
        });

        message += `\n💰 *TOTAL À PAYER: ${formatCurrency(Cart.getTotal())}*`;

        // Encode and Redirect
        const ownerNumber = "22607142862";
        
        const whatsappUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
        
        // Open
        window.open(whatsappUrl, '_blank');
    });
}
