const Cart = {
    items: [],
    
    init() {
        this.load();
        this.updateUI();
        this.setupEventListeners();
    },

    load() {
        const stored = localStorage.getItem('whatsapp_cart');
        if (stored) {
            try {
                this.items = JSON.parse(stored);
            } catch (e) {
                console.error("Cart load error", e);
                this.items = [];
            }
        }
    },

    save() {
        localStorage.setItem('whatsapp_cart', JSON.stringify(this.items));
        this.updateUI();
    },

    addItem(product, variant = null, qty = 1) {
        // Create unique ID for item based on product ID and variant
        // If variant is null or empty, use 'default'
        const variantKey = variant || 'default';
        const existingItemIndex = this.items.findIndex(
            item => item.id === product.id && item.variant === variantKey
        );

        if (existingItemIndex > -1) {
            this.items[existingItemIndex].qty += qty;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                variant: variantKey,
                qty: qty
            });
        }

        this.save();
        showToast(`Ajouté au panier : ${product.name}`);
        
        // Open cart to show feedback? Or just update badge?
        // Let's just update badge and show toast for better UX flow
    },

    removeItem(id, variant) {
        this.items = this.items.filter(item => !(item.id === id && item.variant === variant));
        this.save();
    },

    updateQty(id, variant, delta) {
        const index = this.items.findIndex(
            item => item.id === id && item.variant === variant
        );

        if (index > -1) {
            const newQty = this.items[index].qty + delta;
            if (newQty > 0) {
                this.items[index].qty = newQty;
            } else {
                // If qty goes to 0, ask to remove or just remove?
                // Usually remove
                this.removeItem(id, variant);
                return; // save called in removeItem
            }
            this.save();
        }
    },

    clear() {
        this.items = [];
        this.save();
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.qty), 0);
    },

    getCount() {
        return this.items.reduce((count, item) => count + item.qty, 0);
    },

    updateUI() {
        // Update Badge
        const countEl = document.getElementById('cart-count');
        const count = this.getCount();
        if (countEl) {
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none'; // Hide if 0? Or show 0
            if (count > 0) {
                countEl.classList.add('bump'); // Animation class
                setTimeout(() => countEl.classList.remove('bump'), 300);
            }
        }

        // Update Total
        const totalEl = document.getElementById('cart-total-price');
        if (totalEl) {
            totalEl.textContent = formatCurrency(this.getTotal());
        }

        // Render Items
        const itemsContainer = document.getElementById('cart-items');
        if (itemsContainer) {
            if (this.items.length === 0) {
                itemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <p>Votre panier est vide</p>
                        <button class="btn btn-outline close-cart-trigger">Continuer mes achats</button>
                    </div>
                `;
                // Re-bind close trigger in empty state
                const closeBtn = itemsContainer.querySelector('.close-cart-trigger');
                if(closeBtn) closeBtn.onclick = () => document.getElementById('cart-sidebar').classList.remove('open');
            } else {
                itemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-variant">${item.variant !== 'default' ? item.variant : ''}</div>
                            <div class="cart-item-price">${formatCurrency(item.price)}</div>
                            <div class="cart-item-controls">
                                <div class="qty-control">
                                    <button class="qty-btn" onclick="Cart.updateQty(${item.id}, '${item.variant}', -1)">-</button>
                                    <div class="qty-val">${item.qty}</div>
                                    <button class="qty-btn" onclick="Cart.updateQty(${item.id}, '${item.variant}', 1)">+</button>
                                </div>
                                <button class="remove-btn" onclick="Cart.removeItem(${item.id}, '${item.variant}')">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Update Invoice Preview if visible
        this.renderInvoice();
    },

    renderInvoice() {
        const preview = document.getElementById('invoice-preview');
        if (!preview) return;

        if (this.items.length === 0) {
            preview.innerHTML = '<p class="text-muted">Aucun article.</p>';
            return;
        }

        let html = '';
        this.items.forEach(item => {
            html += `
                <div class="invoice-line">
                    <span>${item.qty}x ${item.name} ${item.variant !== 'default' ? '('+item.variant+')' : ''}</span>
                    <span>${formatCurrency(item.price * item.qty)}</span>
                </div>
            `;
        });

        html += `
            <div class="invoice-total">
                <span>Total à payer</span>
                <span>${formatCurrency(this.getTotal())}</span>
            </div>
        `;

        preview.innerHTML = html;
    },

    setupEventListeners() {
        // Open Cart
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                document.getElementById('cart-sidebar').classList.add('open');
                document.getElementById('cart-overlay').classList.add('open');
            });
        }

        // Close Cart
        const closeCart = () => {
             document.getElementById('cart-sidebar').classList.remove('open');
             document.getElementById('cart-overlay').classList.remove('open');
        };

        document.getElementById('close-cart')?.addEventListener('click', closeCart);
        document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    }
};
