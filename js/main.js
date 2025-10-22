// Main JavaScript file for Haodong's Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHorizontalScroll();
    initSmoothScrolling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');

    // Toggle menu
    function toggleMenu() {
        navToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
    }

    // Close menu
    function closeMenu() {
        navToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    navToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', closeMenu);

    // Close menu when clicking on menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Horizontal scroll functionality
function initHorizontalScroll() {
    const workSection = document.querySelector('.work-section');
    const workScrollContainer = document.getElementById('work-scroll-container');
    const workItems = document.querySelector('.work-items');

    if (!workSection || !workScrollContainer || !workItems) return;

    let ticking = false;

    function updateHorizontalScroll() {
        const rect = workSection.getBoundingClientRect();
        const sectionHeight = workSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate scroll progress within the work section
        const scrollStart = -rect.top;
        const scrollEnd = sectionHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd));
        
        // Only apply horizontal scroll when the section is in view
        if (rect.top <= 0 && rect.bottom >= windowHeight) {
            const maxTranslateX = workItems.scrollWidth - workScrollContainer.offsetWidth;
            const translateX = scrollProgress * maxTranslateX;
            
            workItems.style.transform = `translateX(-${translateX}px)`;
        }
        
        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHorizontalScroll);
            ticking = true;
        }
    }

    // Throttled scroll event listener
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Initial call
    updateHorizontalScroll();

    // Recalculate on resize
    window.addEventListener('resize', function() {
        requestScrollUpdate();
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-content, .contact-content, .work-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Utility function to debounce events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate horizontal scroll on resize
    const event = new Event('scroll');
    window.dispatchEvent(event);
}, 250));

// Preload images for better performance
function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const imageLoader = new Image();
        imageLoader.src = img.src;
    });
}

// Call preload function
preloadImages();

// Add loading class removal after page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Performance optimization: Passive event listeners where possible
const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove'];
passiveEvents.forEach(eventType => {
    document.addEventListener(eventType, function() {}, { passive: true });
});

// Add smooth reveal animation for hero content
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Add parallax effect to hero section (subtle)
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, { passive: true });
}

// Initialize parallax effect
initParallax();

// Add custom cursor effect (optional enhancement)
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}

// Uncomment the line below if you want to enable custom cursor
// initCustomCursor();

// Console message for developers
console.log('🚀 Haodong\'s Portfolio Website loaded successfully!');
console.log('Built with modern web technologies and attention to detail.');

// Export functions for potential external use
window.PortfolioApp = {
    initNavigation,
    initHorizontalScroll,
    initSmoothScrolling,
    initAnimations
};

