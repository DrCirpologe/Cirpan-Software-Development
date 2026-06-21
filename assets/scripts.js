(function () {
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetSelector = this.getAttribute('href');
                if (!targetSelector || targetSelector === '#') {
                    return;
                }

                var target = document.querySelector(targetSelector);
                if (!target) {
                    return;
                }

                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function setupCompactNavOnScroll() {
        var navShell = document.querySelector('header.fixed, nav.fixed');
        if (!navShell) {
            return;
        }

        function updateNavState() {
            document.body.classList.toggle('nav-is-compact', window.scrollY > 24);
        }

        updateNavState();
        window.addEventListener('scroll', updateNavState, { passive: true });
    }

    function setupNavDropdowns() {
        var dropdowns = document.querySelectorAll('.nav-dropdown');
        if (!dropdowns.length) {
            return;
        }

        function closeAllDropdowns() {
            dropdowns.forEach(function (dropdown) {
                dropdown.classList.remove('is-open');
                var trigger = dropdown.querySelector('.nav-dropdown-trigger');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        dropdowns.forEach(function (dropdown) {
            var trigger = dropdown.querySelector('.nav-dropdown-trigger');
            var closeTimer = null;
            if (!trigger) {
                return;
            }

            dropdown.addEventListener('mouseenter', function () {
                if (closeTimer) {
                    window.clearTimeout(closeTimer);
                    closeTimer = null;
                }
            });

            dropdown.addEventListener('mouseleave', function () {
                closeTimer = window.setTimeout(function () {
                    dropdown.classList.remove('is-open');
                    trigger.setAttribute('aria-expanded', 'false');
                }, 120);
            });

            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var shouldOpen = !dropdown.classList.contains('is-open');
                closeAllDropdowns();
                dropdown.classList.toggle('is-open', shouldOpen);
                trigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            });
        });

        document.addEventListener('click', function () {
            closeAllDropdowns();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });
    }

    function setupMobileMenu() {
        var toggle = document.querySelector('.mobile-menu-toggle');
        var panel = document.querySelector('.mobile-menu-panel');
        if (!toggle || !panel) {
            return;
        }

        function setOpen(open) {
            document.body.classList.toggle('mobile-menu-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
            panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        }

        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(!document.body.classList.contains('mobile-menu-open'));
        });

        panel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setOpen(false);
            });
        });

        document.addEventListener('click', function (event) {
            if (!document.body.classList.contains('mobile-menu-open')) {
                return;
            }
            if (panel.contains(event.target) || toggle.contains(event.target)) {
                return;
            }
            setOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) {
                setOpen(false);
            }
        });
    }

    function setupRevealAnimations() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        var fadeElements = document.querySelectorAll('.fade-up');
        if (!fadeElements.length) {
            return;
        }

        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');

                var counter = entry.target.querySelector('[data-target]');
                if (counter) {
                    animateCounter(counter);
                }
            });
        }, observerOptions);

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    function animateCounter(el) {
        if (el.dataset.animated) {
            return;
        }

        el.dataset.animated = 'true';
        var target = Number(el.getAttribute('data-target') || 0);
        var duration = 2000;
        var current = 0;
        var increment = target / (duration / 16);

        var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                el.innerText = target + (target === 24 ? '' : '+');
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current) + (target === 24 ? '' : '+');
            }
        }, 16);
    }

    function setupCardMouseTracking() {
        var cards = document.querySelectorAll('.glass-card');
        if (!cards.length) {
            return;
        }

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    function setupMainGlow() {
        var main = document.querySelector('main');
        if (!main) {
            return;
        }

        main.addEventListener('mousemove', function (e) {
            var rect = main.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            main.style.setProperty('--main-mouse-x', x + '%');
            main.style.setProperty('--main-mouse-y', y + '%');
        });
    }

    function setupFilterButtons() {
        var filterButtons = document.querySelectorAll('.filter-btn');
        if (!filterButtons.length) {
            return;
        }

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterButtons.forEach(function (b) {
                    b.classList.remove('active', 'text-white');
                    b.classList.add('text-text-muted');
                });

                this.classList.add('active', 'text-white');
                this.classList.remove('text-text-muted');
            });
        });
    }

    function setupContactForm() {
        var contactForm = document.getElementById('contact-form');
        var successMessage = document.getElementById('success-message');
        var errorMessage = document.getElementById('error-message');
        if (!contactForm || !successMessage) {
            return;
        }

        var projectTypeSelect = document.getElementById('project-type');
        if (projectTypeSelect) {
            var selectedPackage = new URLSearchParams(window.location.search).get('paket');
            if (selectedPackage && projectTypeSelect.querySelector('option[value="' + selectedPackage + '"]')) {
                projectTypeSelect.value = selectedPackage;
            }
        }

        if (window.emailjs) {
            window.emailjs.init({
                publicKey: 'y3DYAOkaoWSL6brCU'
            });
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = contactForm.querySelector('button[type="submit"]');
            if (!btn) {
                return;
            }

            if (!window.emailjs) {
                if (errorMessage) {
                    errorMessage.classList.remove('hidden');
                }
                return;
            }

            var originalText = btn.innerHTML;
            btn.innerHTML = 'Wird gesendet...';
            btn.classList.add('opacity-50');
            btn.disabled = true;
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }

            var emailInput = contactForm.querySelector('[name="from_email"]');
            var replyToInput = document.getElementById('reply-to');
            var projectTypeSelect = document.getElementById('project-type');
            var projectTypesInput = document.getElementById('project-types');
            if (emailInput && replyToInput) {
                replyToInput.value = emailInput.value;
            }
            if (projectTypeSelect && projectTypesInput) {
                var selectedOption = projectTypeSelect.options[projectTypeSelect.selectedIndex];
                projectTypesInput.value = selectedOption ? selectedOption.text : projectTypeSelect.value;
            }

            window.emailjs.sendForm('service_y2qfp0k', 'template_d1q49pp', contactForm)
                .then(function () {
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('animate-in', 'fade-in', 'duration-500');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error('EmailJS submission error:', error);
                    if (errorMessage) {
                        var detail = error && (error.text || error.message) ? ' Fehler: ' + (error.text || error.message) : '';
                        errorMessage.innerHTML = 'Beim Senden ist ein Fehler aufgetreten.' + detail + ' Bitte versuchen Sie es erneut oder schreiben Sie direkt an <a class="underline hover:text-white" href="mailto:info.cirpan@gmail.com">info.cirpan@gmail.com</a>.';
                        errorMessage.classList.remove('hidden');
                    }
                })
                .finally(function () {
                    btn.innerHTML = originalText;
                    btn.classList.remove('opacity-50');
                    btn.disabled = false;
                });
        });

        var inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(function (input) {
            input.addEventListener('focus', function () {
                var label = input.parentElement ? input.parentElement.querySelector('label') : null;
                if (label) {
                    label.style.color = '#ffb4ac';
                }
            });

            input.addEventListener('blur', function () {
                var label = input.parentElement ? input.parentElement.querySelector('label') : null;
                if (label) {
                    label.style.color = '';
                }
            });
        });

        window.resetForm = function () {
            contactForm.reset();
            var btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerHTML = 'Nachricht senden';
                btn.classList.remove('opacity-50');
                btn.disabled = false;
            }
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
            successMessage.classList.add('hidden');
        };
    }

    function setupFaqAccordions() {
        var accordions = document.querySelectorAll('.faq-accordion');
        if (!accordions.length) {
            return;
        }

        accordions.forEach(function (accordion) {
            accordion.addEventListener('toggle', function () {
                if (!accordion.open) {
                    return;
                }

                accordions.forEach(function (otherAccordion) {
                    if (otherAccordion !== accordion) {
                        otherAccordion.open = false;
                    }
                });
            });
        });
    }

    function setupHeroBalancedOffset() {
        var hero = document.getElementById('hero');
        var heroBlock = document.getElementById('hero-content-block');
        var heroLabel = document.getElementById('hero-label');
        var header = document.querySelector('header');

        if (!hero || !heroBlock || !heroLabel || !header) {
            return;
        }

        function updateOffset() {
            heroBlock.style.marginLeft = '0px';

            if (window.innerWidth < 1024) {
                return;
            }

            var headerBottom = header.getBoundingClientRect().bottom;
            var labelTop = heroLabel.getBoundingClientRect().top;
            var topGap = Math.max(0, Math.round(labelTop - headerBottom));

            var heroInner = heroBlock.parentElement;
            if (!heroInner) {
                return;
            }

            var parentWidth = heroInner.clientWidth;
            var blockWidth = heroBlock.getBoundingClientRect().width;
            var maxOffset = Math.max(0, Math.floor(parentWidth - blockWidth));
            var horizontalOffset = Math.min(topGap, maxOffset);

            heroBlock.style.marginLeft = horizontalOffset + 'px';
        }

        updateOffset();
        window.addEventListener('resize', updateOffset);
    }

    function setupPortfolioCarousel() {
        var carousel = document.querySelector('.portfolio-carousel');
        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.portfolio-slide'));
        if (!slides.length) {
            return;
        }

        var centerIndex = 0;
        var total = slides.length;
        var intervalId = null;

        function getRelativePosition(index) {
            var diff = index - centerIndex;
            var half = Math.floor(total / 2);
            if (diff > half) {
                diff -= total;
            }
            if (diff < -half) {
                diff += total;
            }
            return diff;
        }

        function getTransforms(rel) {
            var isMobile = window.innerWidth <= 640;
            var isTablet = window.innerWidth <= 1024;

            if (isMobile) {
                if (rel === 0) {
                    return { x: 0, y: 0, z: 220, ry: 0, scale: 1, opacity: 1, brightness: 1, blur: 0, contrast: 1, visible: true };
                }
                if (rel === -1) {
                    return { x: -125, y: 30, z: 40, ry: 20, scale: 0.78, opacity: 0.7, brightness: 0.72, blur: 1.2, contrast: 0.9, visible: true };
                }
                if (rel === 1) {
                    return { x: 125, y: 30, z: 40, ry: -20, scale: 0.78, opacity: 0.7, brightness: 0.72, blur: 1.2, contrast: 0.9, visible: true };
                }
                return { x: 0, y: 90, z: -260, ry: 0, scale: 0.55, opacity: 0, brightness: 0.6, blur: 2.5, contrast: 0.8, visible: false };
            }

            if (isTablet) {
                if (rel === 0) {
                    return { x: 0, y: 0, z: 250, ry: 0, scale: 1, opacity: 1, brightness: 1, blur: 0, contrast: 1, visible: true };
                }
                if (rel === -1) {
                    return { x: -210, y: 36, z: 130, ry: 20, scale: 0.84, opacity: 0.8, brightness: 0.72, blur: 1, contrast: 0.9, visible: true };
                }
                if (rel === 1) {
                    return { x: 210, y: 36, z: 130, ry: -20, scale: 0.84, opacity: 0.8, brightness: 0.72, blur: 1, contrast: 0.9, visible: true };
                }
                if (rel === -2) {
                    return { x: -390, y: 80, z: 20, ry: 35, scale: 0.68, opacity: 0.55, brightness: 0.66, blur: 2, contrast: 0.86, visible: true };
                }
                if (rel === 2) {
                    return { x: 390, y: 80, z: 20, ry: -35, scale: 0.68, opacity: 0.55, brightness: 0.66, blur: 2, contrast: 0.86, visible: true };
                }
                return { x: 0, y: 110, z: -180, ry: 0, scale: 0.58, opacity: 0, brightness: 0.58, blur: 3, contrast: 0.8, visible: false };
            }

            if (rel === 0) {
                return { x: 0, y: 0, z: 260, ry: 0, scale: 1, opacity: 1, brightness: 1, blur: 0, contrast: 1, visible: true };
            }
            if (rel === -1) {
                return { x: -250, y: 40, z: 140, ry: 20, scale: 0.85, opacity: 0.8, brightness: 0.7, blur: 1, contrast: 0.9, visible: true };
            }
            if (rel === -2) {
                return { x: -500, y: 90, z: 20, ry: 35, scale: 0.7, opacity: 0.55, brightness: 0.65, blur: 2, contrast: 0.86, visible: true };
            }
            if (rel === 1) {
                return { x: 250, y: 40, z: 140, ry: -20, scale: 0.85, opacity: 0.8, brightness: 0.7, blur: 1, contrast: 0.9, visible: true };
            }
            if (rel === 2) {
                return { x: 500, y: 90, z: 20, ry: -35, scale: 0.7, opacity: 0.55, brightness: 0.65, blur: 2, contrast: 0.86, visible: true };
            }
            return { x: 0, y: 130, z: -180, ry: 0, scale: 0.6, opacity: 0.4, brightness: 0.55, blur: 3, contrast: 0.82, visible: true };
        }

        function render() {
            slides.forEach(function (slide, index) {
                var rel = getRelativePosition(index);
                var t = getTransforms(rel);

                slide.style.setProperty('--x', t.x + 'px');
                slide.style.setProperty('--y', t.y + 'px');
                slide.style.setProperty('--z', t.z + 'px');
                slide.style.setProperty('--ry', t.ry + 'deg');
                slide.style.setProperty('--scale', String(t.scale));
                slide.style.setProperty('--opacity', String(t.opacity));
                slide.style.setProperty('--brightness', String(t.brightness));
                slide.style.setProperty('--blur', t.blur + 'px');
                slide.style.setProperty('--contrast', String(t.contrast));

                slide.style.zIndex = String(1000 + Math.round(t.z));
                slide.style.pointerEvents = t.visible ? 'auto' : 'none';
                slide.classList.toggle('is-center', rel === 0);
                slide.setAttribute('aria-hidden', rel === 0 ? 'false' : 'true');
                slide.style.cursor = t.visible ? 'pointer' : 'default';
            });
        }

        function rotateTo(targetIndex) {
            if (targetIndex === centerIndex) {
                return;
            }
            centerIndex = targetIndex;
            render();
            startAutoRotate();
        }

        function rotateClockwise() {
            centerIndex = (centerIndex + 1) % total;
            render();
        }

        function startAutoRotate() {
            if (intervalId) {
                window.clearInterval(intervalId);
            }
            intervalId = window.setInterval(rotateClockwise, 4000);
        }

        render();
        startAutoRotate();

        slides.forEach(function (slide, index) {
            slide.addEventListener('click', function () {
                rotateTo(index);
            });
        });

        carousel.addEventListener('mouseenter', function () {
            if (intervalId) {
                window.clearInterval(intervalId);
                intervalId = null;
            }
        });

        carousel.addEventListener('mouseleave', function () {
            startAutoRotate();
        });

        window.addEventListener('resize', render);
    }

    setupSmoothScroll();
    setupCompactNavOnScroll();
    setupNavDropdowns();
    setupMobileMenu();
    setupRevealAnimations();
    setupCardMouseTracking();
    setupMainGlow();
    setupFilterButtons();
    setupContactForm();
    setupFaqAccordions();
    setupHeroBalancedOffset();
    setupPortfolioCarousel();
})();
