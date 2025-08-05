// Get modal elements
const modal = document.getElementById('contactModal');
const contactMenuLink = document.getElementById('contactMenuLink');
const closeBtn = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scrolling down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add animation on scroll for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Contact Form Modal
const modal = document.getElementById('contactModal');
const contactBtn = document.querySelector('nav .cta-button');
const closeBtn = document.getElementsByClassName('close')[0];
const contactForm = document.getElementById('contactForm');

// Function to show modal with smooth transition
function showModal() {
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    console.log('Showing modal');
    // Show the modal
    modal.style.display = 'flex';
    
    // Force reflow to ensure the display property is applied
    void modal.offsetWidth;
    
    // Add show class to trigger the animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
        console.log('Show class added');
    });
    
    // Prevent page scrolling
    document.body.style.overflow = 'hidden';
}

// Function to hide modal with smooth transition
function hideModal() {
    // Remove show class to trigger the fade out animation
    modal.classList.remove('show');
    // Wait for the transition to complete before hiding
    setTimeout(() => {
        if (!modal.classList.contains('show')) {
            modal.style.display = 'none';
        }
    }, 300);
    // Re-enable page scrolling
    document.body.style.overflow = 'auto';
}

// Open modal when clicking the 'Contacto' menu link
if (contactMenuLink) {
    contactMenuLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showModal();
        return false;
    }, false);
}

// Debug: Log modal state changes
if (modal) {
    modal.addEventListener('transitionend', function(e) {
        console.log('Modal transition ended:', e.propertyName);
    });
}

// Close modal when clicking the X
if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal();
    });
}

// Close modal when clicking outside the modal content
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
        hideModal();
    }
});

// Handle form submission
if (contactForm) {
    contactForm.onsubmit = async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            const formData = new FormData(this);
            const response = await fetch('https://formsubmit.co/ajax/asordo@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                this.reset();
                hideModal();
            } else {
                throw new Error(result.message || 'Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    };
}
