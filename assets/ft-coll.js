// ft-coll.js
// Scroll progress bar — syncs when scrolling AND when tabs switch

(function () {
    function initProgressBar(bar) {
        const carouselId = bar.getAttribute('aria-controls');
        const carousel = carouselId ? document.getElementById(carouselId) : null;
        if (!carousel) return;

        // Build inner markup once
        if (!bar.querySelector('.ft-scroll-bar__track')) {
            bar.innerHTML =
                '<span class="ft-scroll-bar__track"><span class="ft-scroll-bar__thumb"></span></span>';
        }
        const thumb = bar.querySelector('.ft-scroll-bar__thumb');
        const track = bar.querySelector('.ft-scroll-bar__track');

        function updateThumb() {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            const scrollable = scrollWidth - clientWidth;
            const trackWidth = track.offsetWidth;

            if (scrollable <= 0 || trackWidth === 0) {
                thumb.style.width = '100%';
                thumb.style.transform = 'translateX(0)';
                return;
            }

            const ratio = clientWidth / scrollWidth;
            const progress = scrollLeft / scrollable;
            const thumbWidth = Math.max(trackWidth * ratio, 40);
            const maxOffset = trackWidth - thumbWidth;

            thumb.style.width = thumbWidth + 'px';
            thumb.style.transform = 'translateX(' + progress * maxOffset + 'px)';
        }

        // Scroll listener
        carousel.addEventListener('scroll', updateThumb, { passive: true });
        window.addEventListener('resize', updateThumb, { passive: true });

        // Expose so MutationObserver can call it
        bar._updateThumb = updateThumb;

        // Initial call
        requestAnimationFrame(updateThumb);
    }

    // Initialise all existing bars
    document.querySelectorAll('.ft-scroll-bar').forEach(initProgressBar);

    // Watch each carousel item for becoming active, then refresh bar
    document.querySelectorAll('.featured-collections-carousel__item').forEach((item) => {
        const observer = new MutationObserver(() => {
            if (item.classList.contains('is-selected')) {
                const bar = item.querySelector('.ft-scroll-bar');
                if (!bar) return;

                // Re-init in case it was not visible before
                initProgressBar(bar);

                // Give the browser time to paint / lay out the now-visible carousel
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (bar._updateThumb) bar._updateThumb();
                    });
                });
            }
        });

        observer.observe(item, { attributes: true, attributeFilter: ['class'] });
    });
})();

// ── Blog Posts Slider arrows ────────────────────────────────────────────────
(function () {
    function initBlogSlider(wrapper) {
        const list = wrapper.querySelector('.blog-post-list--slider');
        const prevBtn = wrapper.querySelector('.blog-posts-slider-btn--prev');
        const nextBtn = wrapper.querySelector('.blog-posts-slider-btn--next');
        if (!list || !prevBtn || !nextBtn) return;

        function getCardWidth() {
            const firstCard = list.querySelector('.blog-post-card');
            if (!firstCard) return list.clientWidth * 0.48;
            const gap = parseFloat(getComputedStyle(list).gap) || 12;
            return firstCard.offsetWidth + gap;
        }

        function updateButtons() {
            const { scrollLeft, scrollWidth, clientWidth } = list;
            prevBtn.disabled = scrollLeft <= 1;
            nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
        }

        prevBtn.addEventListener('click', () => {
            list.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            list.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        list.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons, { passive: true });

        // Initial state
        requestAnimationFrame(updateButtons);
    }

    document.querySelectorAll('.blog-posts-slider-wrapper').forEach(initBlogSlider);
})();
