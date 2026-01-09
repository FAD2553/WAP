/**
 * Format number to currency (FCFA)
 * @param {number} amount 
 * @returns {string} Formatted string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
}

/**
 * Truncate text with ellipsis
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
function truncate(text, length = 50) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Show toast notification (simple implementation)
 * @param {string} message 
 * @param {string} type 'success' | 'error'
 */
function showToast(message, type = 'success') {
    // Create toast container if needed
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 5000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeInSlide 0.3s ease;
        font-size: 0.9rem;
    `;
    
    // animation keyframes added via JS or assumed in CSS
    // For simplicity, we just append
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
