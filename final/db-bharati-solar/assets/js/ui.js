/**
 * DB Bharati Solar - UI Components & Utilities
 */
const UI = {
    /**
     * Show a toast message
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.textContent = message;

        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    /**
     * Show/Hide loader (Skeleton or Spinner)
     */
    setLoading(elementId, isLoading) {
        const el = document.getElementById(elementId);
        if (!el) return;

        if (isLoading) {
            el.classList.add('loading-skeleton');
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.6';
        } else {
            el.classList.remove('loading-skeleton');
            el.style.pointerEvents = 'auto';
            el.style.opacity = '1';
        }
    },

    /**
     * Lightbox Modal for Images
     */
    openLightbox(imageUrl, title) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop fade-in';
        modal.innerHTML = `
            <div class="modal-content scale-in">
                <button class="modal-close">&times;</button>
                <img src="${imageUrl}" alt="${title}">
                <div class="modal-caption">${title}</div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.modal-close').onclick = () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        };
    },

    /**
     * Initialize Scroll Animations (Intersection Observer)
     */
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once active
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, .grid-4, .gallery-grid, .gallery-item').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * Initialize Mobile Menu Logic
     */
    initMobileMenu() {
        const toggle = document.createElement('div');
        toggle.className = 'mobile-nav-toggle';
        toggle.innerHTML = '☰';

        const nav = document.querySelector('.nav-links');
        const headerContainer = document.querySelector('.nav-container');

        if (headerContainer && nav) {
            headerContainer.insertBefore(toggle, nav);

            toggle.onclick = () => {
                nav.classList.toggle('active');
                toggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
            };

            // Close menu on link click
            nav.querySelectorAll('a').forEach(link => {
                link.onclick = () => {
                    nav.classList.remove('active');
                    toggle.innerHTML = '☰';
                };
            });
        }
    }
};

// Auto-init for modules
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-active');
    UI.initAnimations();
    UI.initMobileMenu();
});

window.UI = UI;
