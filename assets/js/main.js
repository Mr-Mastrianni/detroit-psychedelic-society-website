// Detroit Psychedelic Society - Main JavaScript Module
// ====================================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        animationDuration: 300,
        scrollOffset: 100,
        mobileBreakpoint: 768,
        debounceDelay: 150
    };

    // State Management
    const state = {
        isMobileMenuOpen: false,
        isScrolled: false,
        activeSection: null,
        soundEnabled: false
    };

    // DOM Elements Cache
    const elements = {
        navbar: null,
        mobileMenuToggle: null,
        soundToggle: null,
        scrollIndicators: [],
        animatedElements: [],
        tabButtons: [],
        forms: []
    };

    // Utility Functions
    const utils = {
        // Debounce function for performance
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Smooth scroll to element
        smoothScroll(target, offset = CONFIG.scrollOffset) {
            const element = document.querySelector(target);
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },

        // Check if element is in viewport
        isInViewport(element, threshold = 0.1) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Add/remove loading state
        setLoading(element, isLoading) {
            if (isLoading) {
                element.classList.add('loading');
                element.setAttribute('aria-busy', 'true');
            } else {
                element.classList.remove('loading');
                element.setAttribute('aria-busy', 'false');
            }
        }
    };

    // Navigation Module
    const navigation = {
        init() {
            this.setupStickyNav();
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.updateActiveSection();
        },

        setupStickyNav() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            elements.navbar = navbar;

            window.addEventListener('scroll', utils.debounce(() => {
                const scrolled = window.scrollY > CONFIG.scrollOffset;
                
                if (scrolled !== state.isScrolled) {
                    state.isScrolled = scrolled;
                    navbar.classList.toggle('nav-shown', scrolled);
                }
            }, 50));
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = anchor.getAttribute('href');
                    utils.smoothScroll(target);
                    
                    // Close mobile menu if open
                    if (state.isMobileMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });
        },

        setupMobileMenu() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (!toggle) return;

            elements.mobileMenuToggle = toggle;

            toggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        },

        toggleMobileMenu() {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
            document.body.classList.toggle('mobile-menu-open', state.isMobileMenuOpen);
            
            // Update ARIA attributes
            elements.mobileMenuToggle.setAttribute('aria-expanded', state.isMobileMenuOpen);
        },

        updateActiveSection() {
            const sections = document.querySelectorAll('section[id]');
            
            window.addEventListener('scroll', utils.debounce(() => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop - CONFIG.scrollOffset) {
                        current = section.getAttribute('id');
                    }
                });

                if (current !== state.activeSection) {
                    state.activeSection = current;
                    this.updateNavLinks(current);
                }
            }, 100));
        },

        updateNavLinks(currentSection) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    // Animation Module
    const animations = {
        init() {
            this.setupScrollAnimations();
            this.setupParallax();
            this.setupHoverEffects();
        },

        setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('.reveal');
            elements.animatedElements = Array.from(animatedElements);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.animatedElements.forEach(el => observer.observe(el));
        },

        setupParallax() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            if (parallaxElements.length === 0) return;

            window.addEventListener('scroll', utils.debounce(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }, 10));
        },

        setupHoverEffects() {
            // Add magnetic hover effect to buttons
            document.querySelectorAll('.btn').forEach(button => {
                button.addEventListener('mousemove', (e) => {
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                });

                button.addEventListener('mouseleave', () => {
                    button.style.transform = '';
                });
            });
        }
    };

    // Forms Module
    const forms = {
        init() {
            this.setupNewsletterForm();
            this.setupContactForm();
            this.setupValidation();
        },

        setupNewsletterForm() {
            const newsletterForm = document.getElementById('newsletter-form');
            if (!newsletterForm) return;

            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(newsletterForm);
                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                
                utils.setLoading(submitButton, true);

                try {
                    // Simulate API call
                    await this.submitForm(formData);
                    this.showSuccess(newsletterForm, 'Thank you for subscribing!');
                    newsletterForm.reset();
                } catch (error) {
                    this.showError(newsletterForm, 'An error occurred. Please try again.');
                } finally {
                    utils.setLoading(submitButton, false);
                }
            });
        },

        setupContactForm() {
            const contactForm = document.getElementById('contact-form');
            if (!contactForm) return;

            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitButton = contactForm.querySelector('button[type="submit"]');
                
                utils.setLoading(submitButton, true);

                try {
                    await this.submitForm(formData);
                    this.showSuccess(contactForm, 'Message sent successfully!');
                    contactForm.reset();
                } catch (error) {
                    this.showError(contactForm, 'Failed to send message. Please try again.');
                } finally {
                    utils.setLoading(submitButton, false);
                }
            });
        },

        setupValidation() {
            document.querySelectorAll('form').forEach(form => {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });

                    input.addEventListener('input', () => {
                        if (input.classList.contains('error')) {
                            this.validateField(input);
                        }
                    });
                });
            });
        },

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            let errorMessage = '';

            if (!value && field.hasAttribute('required')) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            if (isValid) {
                field.classList.remove('error');
                this.removeError(field);
            } else {
                field.classList.add('error');
                this.showFieldError(field, errorMessage);
            }

            return isValid;
        },

        showFieldError(field, message) {
            let errorElement = field.nextElementSibling;
            
            if (!errorElement || !errorElement.classList.contains('field-error')) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            
            errorElement.textContent = message;
        },

        removeError(field) {
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.remove();
            }
        },

        showSuccess(form, message) {
            const alert = this.createAlert('success', message);
            form.parentNode.insertBefore(alert, form);
            setTimeout(() => alert.remove(), 5000);
        },

        showError(form, message) {
            const alert = this.createAlert('error', message);
            form.parentNode.insertBefore(alert, form);
            setTimeout(() => alert.remove(), 5000);
        },

        createAlert(type, message) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            alert.setAttribute('role', 'alert');
            return alert;
        },

        async submitForm(formData) {
            // Simulate API call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // For now, always resolve successfully
                    resolve({ success: true });
                }, 1500);
            });
        }
    };

    // Interactive Features Module
    const features = {
        init() {
            this.setupTabs();
            this.setupSoundToggle();
            this.setupScrollIndicator();
        },

        setupTabs() {
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    const tabGroup = button.closest('.tabs');
                    const targetId = button.dataset.tab;
                    
                    // Update buttons
                    tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    
                    button.classList.add('active');
                    button.setAttribute('aria-selected', 'true');
                    
                    // Update content
                    tabGroup.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                        content.setAttribute('aria-hidden', 'true');
                    });
                    
                    const targetContent = document.getElementById(targetId);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        targetContent.setAttribute('aria-hidden', 'false');
                    }
                });
            });
        },

        setupSoundToggle() {
            const soundToggle = document.getElementById('soundToggle');
            const ambientSound = document.getElementById('ambientSound');
            
            if (!soundToggle || !ambientSound) return;

            elements.soundToggle = soundToggle;

            soundToggle.addEventListener('click', () => {
                state.soundEnabled = !state.soundEnabled;
                
                if (state.soundEnabled) {
                    ambientSound.play();
                    soundToggle.querySelector('i').className = 'sound-icon fas fa-volume-up';
                } else {
                    ambientSound.pause();
                    soundToggle.querySelector('i').className = 'sound-icon fas fa-volume-mute';
                }
            });
        },

        setupScrollIndicator() {
            const indicators = document.querySelectorAll('.scroll-indicator');
            elements.scrollIndicators = Array.from(indicators);

            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    const target = indicator.dataset.target || '#content';
                    utils.smoothScroll(target);
                });
            });
        }
    };

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        navigation.init();
        animations.init();
        forms.init();
        features.init();
        
        // Remove loader
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1000);
        }
    });

    // Handle visibility change (pause animations when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations
            document.querySelectorAll('[data-animation]').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations
            document.querySelectorAll('[data-animation]').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });

    // Export for use in other modules
    window.DPS = {
        utils,
        navigation,
        animations,
        forms,
        features,
        state,
        CONFIG
    };

})();
