document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or use system preference (default dark)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.replace('dark-theme', 'light-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const words = ["CS Student", "Backend Developer", "Java Developer", "AWS Enthusiast", "Fast Learner"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // faster deletion
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Wait before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Wait before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter
    if (typewriterElement) {
        setTimeout(type, 1000);
    }


    // Intersection Observer for Scroll Animations (Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    const progressBars = document.querySelectorAll('.progress');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the skills section, animate progress bars
                if (entry.target.id === 'skills') {
                    progressBars.forEach(bar => {
                        bar.classList.add('animate');
                    });
                }
                
                // Optional: Unobserve after revealing to only load once
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Initialize tsParticles for heartbeat lighting background
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            fullScreen: { enable: false },
            particles: {
                number: { value: 50, density: { enable: true, area: 800 } },
                color: { value: ["#ff2a2a", "#ff4d4d", "#ff1a1a"] },
                shape: { type: "circle" },
                opacity: {
                    value: { min: 0.2, max: 0.9 },
                    animation: { enable: true, speed: 3, minimumValue: 0.2, sync: false }
                },
                size: {
                    value: { min: 2, max: 6 },
                    animation: { enable: true, speed: 15, minimumValue: 2, sync: false } /* Fast pulse like a beat */
                },
                links: {
                    enable: true,
                    distance: 120,
                    color: "#ff2a2a",
                    opacity: 0.5,
                    width: 1.5,
                    triangles: {
                        enable: true,
                        color: "#ff2a2a",
                        opacity: 0.05
                    }
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "none",
                    outModes: "out"
                }
            },
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, links: { opacity: 0.8 } },
                    push: { quantity: 5 }
                }
            },
            detectRetina: true
        });
    }
});
