// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar with background change on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const typedTextElement = document.getElementById('typed');
const phrases = [
    'Web Developer',
    'UI/UX Designer',
    'Full-Stack Engineer',
    'Frontend Specialist',
    'WordPress Expert',
    'React Developer'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect after a short delay
setTimeout(typeEffect, 1000);

// ============================================
// ANIMATED COUNTER
// ============================================
const counters = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCounter();
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger counters when hero stats are visible
            if (entry.target.closest('.hero-stats')) {
                animateCounters();
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// CONTACT FORM (Web3Forms integration)
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const subject = (formData.get('subject') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormStatus('Please enter a valid email address.', 'error');
        return;
    }

    // Check for Web3Forms key
    const accessKey = (formData.get('access_key') || '').toString();
    if (accessKey === 'YOUR_ACCESS_KEY_HERE' || !accessKey) {
        showFormStatus(
            'Form not yet configured. Please email anilsinghynr@gmail.com directly — the Web3Forms access key still needs to be added to index.html.',
            'error'
        );
        return;
    }

    // Submit to Web3Forms
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Convert FormData to plain object for JSON submission
        const payload = Object.fromEntries(formData.entries());
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showFormStatus(
                `Thanks ${name}! Your message has been sent. I'll get back to you within 24 hours at ${email}.`,
                'success'
            );
            contactForm.reset();

            // Hide success message after 8 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus(
            'Something went wrong. Please email anilsinghynr@gmail.com directly, or try again in a moment.',
            'error'
        );
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ============================================
// PARALLAX EFFECT FOR HERO VISUAL
// ============================================
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        heroVisual.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c👋 Hey there!', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cLooking at the source? I like your style.', 'color: #06b6d4; font-size: 14px;');
console.log('%cLet\'s build something amazing together.', 'color: #ec4899; font-size: 14px;');
console.log('%c📧 anilsinghynr@gmail.com', 'color: #fbbf24; font-size: 14px; font-weight: bold;');
