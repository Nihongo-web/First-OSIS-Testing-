document.addEventListener('DOMContentLoaded', function() {

    // Preloader
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        initLazyLoad();
        initParallax();
        initLightbox();
        initCounterAnimation();
    });

    // Smooth Scroll + Active Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Section Highlight
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // Navbar Scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const navbar = document.getElementById('navbar');
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ✅ HAMBURGER MENU — DIPERBAIKI
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Tutup menu saat klik link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ✅ LIGHTBOX GALLERY
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const galleryItems = document.querySelectorAll('.galeri-item');

        let currentIndex = 0;
        let items = Array.from(galleryItems);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                lightboxImg.src = item.getAttribute('data-full');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                lightboxImg.src = items[currentIndex].getAttribute('data-full');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % items.length;
                lightboxImg.src = items[currentIndex].getAttribute('data-full');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ✅ STATS COUNTER ANIMATION
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetText = el.innerText;
                    const isPlus = targetText.includes('+');
                    const target = parseInt(targetText);
                    let current = 0;
                    const duration = 2000;
                    const step = Math.ceil(target / (duration / 16));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            el.innerText = target + (isPlus ? '+' : '');
                            clearInterval(timer);
                        } else {
                            el.innerText = current + (isPlus ? '+' : '');
                        }
                    }, 16);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(num => counterObserver.observe(num));
    }

    // Lazy Load Images
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img.lazy');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.style.opacity = "0";
                    img.style.transform = "scale(1.05)";
                    setTimeout(() => {
                        img.style.transition = "opacity 0.8s ease, transform 0.8s ease";
                        img.style.opacity = "1";
                        img.style.transform = "scale(1)";
                    }, 50);
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.1 });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Parallax Effect
    function initParallax() {
        const parallaxEls = document.querySelectorAll('[data-speed]');

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset;

            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed'));
                el.style.transform = `translateY(${scrollTop * speed}px)`;
            });
        });
    }

    // Character Animation Delay
    document.querySelectorAll('.hero-title .char').forEach((char, i) => {
        char.style.setProperty('--i', i);
    });

    // Hover Tilt Effect
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.transition = "none";
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
            card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        });
    });

    /*
     * 💡 KODE KONTAK MASIH ADA — TAPI DIKOMENTARI
     * Jika suatu saat dibutuhkan:
     * 1. Uncomment section kontak di index.html
     * 2. Uncomment form handler di bawah ini
     * 3. Uncomment styling .kontak-* di style.css
     *
     * // Form handler (dikomentari sesuai permintaan)
     * const contactForm = document.getElementById('contactForm');
     * contactForm.addEventListener('submit', function(e) {
     *     e.preventDefault();
     *     const btn = this.querySelector('button');
     *     const original = btn.innerHTML;
     *     btn.innerHTML = `<span style="opacity: 0.8">Mengirim...</span>`;
     *     btn.disabled = true;
     *
     *     setTimeout(() => {
     *         alert('✅ Permintaan Anda telah terkirim. Tim Eksklusif OSIS akan segera merespons.');
     *         this.reset();
     *         btn.innerHTML = original;
     *         btn.disabled = false;
     *     }, 1600);
     * });
     */

    console.log('✅ Website OSIS siap digunakan — semua bug diperbaiki.');
});