// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

// Open modal when clicking contact button
if (contactBtn) {
    contactBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Contact button clicked');
        showModal();
    });
} else {
    console.error('Contact button not found');
}

// Debug: Log modal state changes
if (modal) {
    modal.addEventListener('transitionend', function(e) {
        console.log('Modal transition ended:', e.propertyName);
    });
}

// Close modal when clicking the X
closeBtn.addEventListener('click', function() {
    hideModal();
});

// Close modal when clicking outside the modal content
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        hideModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        hideModal();
    }
});

// Handle form submission
contactForm.onsubmit = async function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        subject: formData.get('subject'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'No proporcionado',
        message: formData.get('message')
    };

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        // Using FormSubmit.co for form submission
        const response = await fetch('https://formsubmit.co/ajax/asordo@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            throw new Error(result.message || 'Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
};
