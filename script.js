// script.js

// Seleciona elementos do DOM para interação
const mobileMenuButton = document.getElementById('mobile-menu-button'); // Botão do menu mobile
const mobileMenu = document.getElementById('mobile-menu'); // Container do menu mobile
const backToTopButton = document.getElementById('backToTop'); // Botão "Voltar ao Topo"
const popup = document.getElementById('popup'); // Pop-up de coleta de informações
const popupClose = document.getElementById('popup-close'); // Botão de fechar pop-up
const popupForm = document.getElementById('popup-form'); // Formulário do pop-up
const contactForm = document.getElementById('contact-form'); // Formulário de contato

// Exibe o pop-up sempre que a página for carregada
if (popup) {
    window.addEventListener('load', () => {
        popup.classList.remove('hidden'); // Mostra o pop-up
    });

    // Fecha o pop-up ao clicar no botão de fechar
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.classList.add('hidden'); // Esconde o pop-up
        });
    }

    // Fecha o pop-up ao clicar fora do contêiner
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.classList.add('hidden'); // Esconde o pop-up
        }
    });

    // Manipula o envio do formulário do pop-up (simulação)
    if (popupForm) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o comportamento padrão
            const formData = new FormData(popupForm);
            console.log('Pop-up Form Data:', {
                name: formData.get('name'),
                email: formData.get('email'),
                whatsapp: formData.get('whatsapp')
            });
            popup.classList.add('hidden'); // Esconde o pop-up após envio
            alert('Informações enviadas com sucesso! Entraremos em contato em breve.');
        });
    }
}

// Manipula o envio do formulário de contato (envio para WhatsApp)
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o comportamento padrão
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (name && email && message) {
            // Formata a mensagem para o WhatsApp
            const whatsappMessage = `Novo briefing de contato:%0A%0ANome: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0AMensagem: ${encodeURIComponent(message)}`;
            const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${whatsappMessage}`;
            
            // Abre o WhatsApp em uma nova aba
            window.open(whatsappUrl, '_blank');
            
            // Loga os dados no console (para depuração)
            console.log('Contact Form Data:', { name, email, message });
            
            // Exibe alerta de sucesso
            alert('Mensagem enviada com sucesso! O briefing foi encaminhado para o WhatsApp da assessoria.');
            
            // Limpa o formulário
            contactForm.reset();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
}

// Alterna a visibilidade do menu mobile ao clicar no botão
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden'); // Alterna a classe hidden para mostrar/esconder o menu
        const isExpanded = !mobileMenu.classList.contains('hidden'); // Verifica se o menu está aberto
        mobileMenuButton.setAttribute('aria-expanded', isExpanded); // Atualiza o atributo ARIA para acessibilidade
    });

    // Fecha o menu mobile ao clicar em qualquer link dentro dele
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden'); // Esconde o menu
            mobileMenuButton.setAttribute('aria-expanded', 'false'); // Atualiza o atributo ARIA
        });
    });

    // Fecha o menu mobile ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden'); // Esconde o menu
            mobileMenuButton.setAttribute('aria-expanded', 'false'); // Atualiza o atributo ARIA
        }
    });

    // Fecha o menu mobile ao redimensionar a janela para desktop (≥1024px)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden'); // Esconde o menu
            mobileMenuButton.setAttribute('aria-expanded', 'false'); // Atualiza o atributo ARIA
        }
    });
}

// Configura o IntersectionObserver para o botão "Voltar ao Topo"
if (backToTopButton && document.querySelector('header')) {
    const header = document.querySelector('header'); // Seleciona o header
    const backToTopObserver = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                // Mostra o botão quando o header não está visível
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                // Esconde o botão quando o header está visível
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        },
        { threshold: 0 } // Dispara quando o header sai completamente da visão
    );
    backToTopObserver.observe(header); // Observa o header

    // Adiciona evento de clique para rolar suavemente ao topo
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rola suavemente para o topo
        });
    });
}

// Adiciona rolagem suave para todos os links de âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Impede o comportamento padrão do link
        const targetId = this.getAttribute('href'); // Obtém o ID do alvo
        const targetElement = document.querySelector(targetId); // Seleciona o elemento alvo
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Rola suavemente
                block: 'start' // Alinha o topo do elemento com o topo da janela
            });
            // Fecha o menu mobile, se estiver aberto
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Configura o IntersectionObserver para animações de fade-in
const animateElements = document.querySelectorAll('.animate-fadeIn'); // Seleciona elementos com animação
if (animateElements.length > 0) {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Adiciona a classe para animar
                    animationObserver.unobserve(entry.target); // Para de observar após a animação
                }
            });
        },
        { rootMargin: '0px 0px -20% 0px' } // Dispara quando 20% do elemento está visível
    );
    animateElements.forEach(element => animationObserver.observe(element)); // Observa cada elemento
}

// Função para alternar o accordion do FAQ
function toggleAccordion(element) {
    const answer = element.nextElementSibling; // Seleciona a resposta associada
    const toggleIcon = element.querySelector('.faq-toggle'); // Seleciona o ícone de toggle
    const isOpen = answer.classList.contains('open'); // Verifica se a resposta está aberta

    // Fecha todos os outros accordions
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('open'); // Remove a classe open
        item.style.maxHeight = '0'; // Colapsa a resposta
        item.parentElement.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); // Atualiza ARIA
        item.parentElement.querySelector('.faq-toggle').textContent = '+'; // Atualiza o ícone
    });

    // Alterna o accordion clicado
    if (!isOpen) {
        answer.classList.add('open'); // Abre a resposta
        answer.style.maxHeight = answer.scrollHeight + 'px'; // Expande para a altura do conteúdo
        toggleIcon.textContent = '-'; // Muda o ícone para indicar aberto
        element.setAttribute('aria-expanded', 'true'); // Atualiza ARIA
    } else {
        answer.classList.remove('open'); // Fecha a resposta
        answer.style.maxHeight = '0'; // Colapsa a resposta
        toggleIcon.textContent = '+'; // Muda o ícone para indicar fechado
        element.setAttribute('aria-expanded', 'false'); // Atualiza ARIA
    }
}

// Adiciona eventos de clique e teclado aos itens do FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => toggleAccordion(question)); // Evento de clique
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Impede o comportamento padrão do teclado
            toggleAccordion(question); // Alterna o accordion
        }
    });
});