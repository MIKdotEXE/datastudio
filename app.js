// JavaScript semplificato - FAQ toggle e form handling

// FAQ Toggle Function
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.classList.remove('active');
            if (otherIcon) otherIcon.textContent = '+';
        }
    });
    
    // Toggle current FAQ
    if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
        answer.classList.remove('active');
        icon.textContent = '+';
    } else {
        faqItem.classList.add('active');
        answer.classList.add('active');
        icon.textContent = '−';
    }
}

// Smooth scroll function
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const headerHeight = 80;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Show form message
function showFormMessage(message, type) {
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message status status--${type}`;
    msgDiv.textContent = message;
    msgDiv.style.marginTop = '1rem';
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(msgDiv, form.nextSibling);
    
    if (type === 'success') {
        setTimeout(() => msgDiv.remove(), 4000);
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', function() {
    
    // Navigation click handlers
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            smoothScrollTo(targetId);
        });
    });
    
    // CTA button handlers
    document.querySelectorAll('.cta-btn, .secondary-cta .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('contatti');
        });
    });
    
    // Contact form - Formspree integration
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const privacyConsent = document.getElementById('privacyConsent').checked;
            
            // Validazione
            if (!nome || !email) {
                showFormMessage('Compila tutti i campi obbligatori', 'error');
                return;
            }
            
            if (!/\S+@\S+\.\S+/.test(email)) {
                showFormMessage('Inserisci un email valido', 'error');
                return;
            }
            
            if (!privacyConsent) {
                showFormMessage('Devi accettare l\'informativa privacy', 'error');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Invio...';
            submitBtn.disabled = true;
            
            try {
                // Formspree gestisce automaticamente l'invio
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormMessage('Richiesta inviata con successo! Ti contatteremo presto.', 'success');
                    form.reset();
                } else {
                    throw new Error('Errore nell\'invio');
                }
            } catch (error) {
                showFormMessage('Errore nell\'invio del modulo. Riprova più tardi.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Active nav on scroll
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});

// Make toggleFAQ available globally for inline onclick
window.toggleFAQ = toggleFAQ;
