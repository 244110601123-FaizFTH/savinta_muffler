document.addEventListener('DOMContentLoaded', () => {
    // Shared helper for safe text insertion
    const escapeHtml = function(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };
    window.escapeHtml = escapeHtml;

    // 1. Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('site-theme');

    const setTheme = (theme) => {
        document.body.classList.toggle('light-mode', theme === 'light');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
        }
        localStorage.setItem('site-theme', theme);
    };

    if (currentTheme === 'light' || currentTheme === 'dark') {
        setTheme(currentTheme);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(prefersLight ? 'light' : 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(nextTheme);
    });

    // 2. Navbar Scroll Effect (change background opacity on scroll)
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Intersection Observer for Scroll Animations
    // The user requested smooth scroll animations for a premium feel
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Options for the observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the element is visible
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger animation
                entry.target.classList.add('is-visible');
                // Stop observing once animated to prevent repeating
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with the animate-on-scroll class
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links (fallback for CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Accounting for fixed navbar height
                const navHeight = document.querySelector('.navbar').offsetHeight + 10;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auto-generate product cards on static index/catalog pages when PRODUCTS is available
    if (window.PRODUCTS) {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid && productsGrid.querySelectorAll('.product-card').length === 0) {
            // create up to 8 product cards (featured)
            const keys = Object.keys(PRODUCTS).slice(0, 8);
            keys.forEach((slug, idx) => {
                const p = PRODUCTS[slug];
                const card = document.createElement('div');
                card.className = 'product-card animate-on-scroll fade-up';
                card.dataset.productSlug = slug;

                card.innerHTML = `
                    <div class="product-image">
                        <img src="${p.image}" alt="${escapeHtml(p.title)}">
                    </div>
                    <div class="product-info">
                        <span class="product-category">${escapeHtml(p.category)}</span>
                        <h3>${escapeHtml(p.title)}</h3>
                        <a class="btn btn-whatsapp btn-full" target="_blank" href="https://api.whatsapp.com/send?phone=62895360918709&text=${encodeURIComponent(p.whatsapp)}">Pesan via WhatsApp</a>
                        <a class="btn btn-shopee btn-full" data-shopee-for="${slug}" target="_blank">Pesan via Shopee</a>
                    </div>`;

                productsGrid.appendChild(card);
            });
        }
    }

    // small helper to escape text inserted into HTML (global for all pages to use)
    window.escapeHtml = function(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // Product description modal for catalog page
    const productModal = document.getElementById('product-modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalCategory = document.querySelector('.modal-category');
    const modalDescription = document.querySelector('.modal-description');
    const modalWhatsapp = document.querySelector('.modal-whatsapp');
    const modalClose = document.querySelector('.modal-close');

    const descriptionMap = {
        'Motor KLX WR CRF DTRACKER Full Stainless': 'Knalpot motor full stainless untuk mesin KLX/WR/CRF/DTRACKER, dirancang untuk tahan korosi dan memberikan respon gas lebih baik.',
        'Motor T77 Vario Beat Full Black': 'Knalpot T77 dengan finishing hitam full, cocok untuk tampilan racing dan menjaga tampilan tetap elegan.',
        'Motor T77 Vario Beat': 'Knalpot T77 standar untuk Vario Beat, memberikan suara lebih bertenaga dan performa stabil.',
        'Samlong Stainless COATING Vario Beat': 'Knalpot samlong stainless dengan lapisan coating untuk tampilan tahan panas dan perlindungan ekstra.',
        'Canter Dyna Dutro Isuzu Nmr': 'Knalpot truk Canter Dyna Dutro Isuzu Nmr, pilihan kuat untuk kendaraan niaga dengan daya tahan tinggi.',
        'Canter PNP Full Stainless': 'Knalpot Canter plug-n-play full stainless, mudah dipasang dan cocok untuk penggunaan berat.',
        'Ngir PNP Canter Full Stainless Rainbow': 'Knalpot Canter penuh stainless dengan efek rainbow, menambah penampilan premium dan tahan lama.',
        'Non Turbo Full Stainless': 'Knalpot non-turbo full stainless untuk truk atau kendaraan berat yang butuh ketahanan ekstra.',
        'Pendek Full Stainless': 'Knalpot pendek full stainless, cocok untuk tampilan compact dan suara tegas untuk modifikasi truk.',
        'Baut Bensin Solar Sav-SBT': 'Aksesoris khusus bahan bakar untuk pengaturan injeksi lebih presisi pada kendaraan solar dan bensin.',
        'Mobil Bensin Solar Avanza L300': 'Knalpot custom untuk Avanza dan L300, dirancang agar aliran gas mesin lebih lancar untuk performa menengah.',
        'Mobil Solar Bensin': 'Knalpot custom serbaguna untuk mesin solar/bensin, dibangun dari stainless agar tahan lama.',
        'Truk Canter Hino Dutro': 'Knalpot custom untuk truk Canter Hino Dutro, fokus pada daya tahan dan performa gas pada kendaraan berat.',
        'Truk Turbo STBv1': 'Knalpot turbo STBv1 untuk truk dan kendaraan hauling, mendukung aliran gas lebih cepat untuk performa maksimal.'
    };

    const productCards = document.querySelectorAll('.product-card');

    const catalogSearchInput = document.getElementById('catalog-search-input');
    const catalogCategorySelect = document.getElementById('catalog-category-select');

    function updateProductFilter() {
        const searchValue = catalogSearchInput?.value.toLowerCase().trim() || '';
        const categoryValue = catalogCategorySelect?.value || 'all';

        productCards.forEach(card => {
            const title = card.querySelector('.product-info h3')?.textContent.toLowerCase() || '';
            const category = card.querySelector('.product-category')?.textContent || '';
            const matchesSearch = searchValue === '' || title.includes(searchValue) || category.toLowerCase().includes(searchValue);
            const matchesCategory = categoryValue === 'all' || category === categoryValue;

            card.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
        });
    }

    if (catalogSearchInput) {
        catalogSearchInput.addEventListener('input', updateProductFilter);
    }

    if (catalogCategorySelect) {
        catalogCategorySelect.addEventListener('change', updateProductFilter);
    }

    if (productCards.length) {
        productCards.forEach(card => {
            const slug = card.dataset.productSlug;
            const infoBox = card.querySelector('.product-info');
            const alreadyHasDetailLink = infoBox?.querySelector('a[href*="product.html?id="]');

            if (slug && infoBox && !alreadyHasDetailLink) {
                const detailLink = document.createElement('a');
                detailLink.href = `product.html?id=${encodeURIComponent(slug)}`;
                detailLink.className = 'btn btn-secondary btn-full';
                detailLink.textContent = 'Lihat Detail';
                infoBox.appendChild(detailLink);
            }

            // Populate Shopee / WhatsApp links from PRODUCTS if available
            if (window.PRODUCTS && slug && infoBox) {
                const shopeeAnchor = infoBox.querySelector('.btn-shopee[data-shopee-for="' + slug + '"]') || infoBox.querySelector('.btn-shopee');
                if (shopeeAnchor && PRODUCTS[slug] && PRODUCTS[slug].shopee) {
                    shopeeAnchor.href = PRODUCTS[slug].shopee;
                }
                const whatsappAnchor = infoBox.querySelector('.btn-whatsapp');
                if (whatsappAnchor && PRODUCTS[slug] && PRODUCTS[slug].whatsapp) {
                    // Only override if href is empty or '#'
                    if (!whatsappAnchor.href || whatsappAnchor.href === '#' ) {
                        whatsappAnchor.href = `https://api.whatsapp.com/send?phone=62895360918709&text=${encodeURIComponent(PRODUCTS[slug].whatsapp)}`;
                    }
                }
            }

            card.addEventListener('click', function (event) {
                if (event.target.closest('a')) return;
                if (slug) {
                    window.location.href = `product.html?id=${encodeURIComponent(slug)}`;
                }
            });
        });
    }

    const carousel = document.querySelector('.media-carousel');
    if (carousel) {
        const slidesContainer = carousel.querySelector('.media-slides');
        const slides = Array.from(carousel.querySelectorAll('.media-slide'));
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const nextButton = carousel.querySelector('.carousel-button.next');
        const dotsWrapper = carousel.querySelector('.carousel-dots');
        let currentSlide = 0;
        let carouselTimer = null;
        const autoplayDelay = 4500;

        function updateCarousel() {
            if (!slidesContainer) return;
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            slides.forEach((slide, index) => {
                const video = slide.querySelector('video');
                const isActive = index === currentSlide;
                slide.classList.toggle('active', isActive);

                if (video) {
                    if (isActive) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            });

            if (dotsWrapper) {
                const dots = Array.from(dotsWrapper.children);
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
        }

        function goToSlide(index) {
            if (index < 0) {
                currentSlide = slides.length - 1;
            } else if (index >= slides.length) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }
            updateCarousel();
            resetCarouselTimer();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startCarousel() {
            stopCarousel();
            carouselTimer = setInterval(nextSlide, autoplayDelay);
        }

        function stopCarousel() {
            if (carouselTimer) {
                clearInterval(carouselTimer);
                carouselTimer = null;
            }
        }

        function resetCarouselTimer() {
            stopCarousel();
            startCarousel();
        }

        if (dotsWrapper) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.addEventListener('click', () => goToSlide(index));
                dotsWrapper.appendChild(dot);
            });
        }

        prevButton?.addEventListener('click', prevSlide);
        nextButton?.addEventListener('click', nextSlide);

        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);

        updateCarousel();
        startCarousel();
    }
});
