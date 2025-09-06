// Seleciona elementos do DOM para interação com o site
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const backToTopButton = document.getElementById('backToTop');
const contactForm = document.getElementById('contact-form');
const whatsappDirectButton = document.getElementById('whatsapp-direct');
const customAlert = document.getElementById('custom-alert');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertClose = document.getElementById('custom-alert-close');
const showMoreFaqsButton = document.getElementById('show-more-faqs');
const collapseFaqsButton = document.getElementById('collapse-faqs');
const showMoreAboutButton = document.getElementById('show-more-about');
const collapseAboutButton = document.getElementById('collapse-about');

// Função para mostrar o alerta personalizado com uma mensagem
function showCustomAlert(message) {
    if (customAlert && customAlertMessage && customAlertClose) {
        customAlertMessage.textContent = message;
        customAlert.classList.remove('hidden');
        const timeout = setTimeout(() => {
            customAlert.classList.add('hidden');
            clearTimeout(timeout);
        }, 5000);
        customAlertClose.addEventListener('click', () => {
            customAlert.classList.add('hidden');
            clearTimeout(timeout);
        }, { once: true });
    }
}

// Manipula o botão de contato direto via WhatsApp
if (whatsappDirectButton) {
    whatsappDirectButton.addEventListener('click', () => {
        const whatsappMessage = 'Olá! Tudo bem? Tenho interesse em fechar uma parceria de publicidade com a Edi.';
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Manipula o envio do formulário de contato
if (contactForm) {
    // Função para exibir mensagens de erro em campos do formulário
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    };

    // Função para limpar todas as mensagens de erro
    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.add('hidden');
        });
    };

    // Função para formatar o número do WhatsApp no formato (DDD)XXXXX-XXXX
    const formatWhatsApp = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length === 11) {
            return `(${numericValue.substring(0, 2)})${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
        } else if (numericValue.length === 12) {
            return `(${numericValue.substring(0, 3)})${numericValue.substring(3, 8)}-${numericValue.substring(8, 12)}`;
        }
        return numericValue; // Retorna apenas os dígitos se não tiver 11 ou 12
    };

    // Validação em tempo real do campo WhatsApp com máscara
    const whatsappInput = document.getElementById('contact-whatsapp');
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        // Limita a entrada a 12 dígitos
        if (value.length > 12) {
            value = value.substring(0, 12);
        }
        e.target.value = formatWhatsApp(value);
        // Aplica a classe 'invalid' apenas se o número não tiver 11 ou 12 dígitos ao tentar enviar
        if (value.length !== 11 && value.length !== 12) {
            e.target.classList.add('invalid');
        } else {
            e.target.classList.remove('invalid');
        }
    });

    // Validação em tempo real do campo Nome da Marca
    const brandInput = document.getElementById('contact-brand');
    brandInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^A-Za-zÀ-ÿ0-9\s]/g, '');
        e.target.value = value;
    });

    // Validação em tempo real do campo Nome do Responsável
    const responsibleInput = document.getElementById('contact-responsible');
    responsibleInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s^´\`~Çç]/g, '');
        e.target.value = value;
    });

    // Função para validar os dados do formulário
    const validateForm = (formData) => {
        let isValid = true;

        const brand = formData.get('brand').trim();
        if (!/^[A-Za-zÀ-ÿ0-9\s]{2,}$/.test(brand)) {
            showError('contact-brand-error', 'O nome deve conter letras ou números e ter no mínimo 2 caracteres.');
            isValid = false;
        }

        const responsible = formData.get('responsible').trim();
        if (!/^[A-Za-zÀ-ÿ\s^´\`~Çç]{2,}$/.test(responsible)) {
            showError('contact-responsible-error', 'O nome deve conter apenas letras, espaços ou os caracteres çÇ^~`´ e ter no mínimo 2 caracteres.');
            isValid = false;
        }

        const whatsapp = formData.get('whatsapp').replace(/[^0-9]/g, '');
        if (!/^\d{11,12}$/.test(whatsapp)) {
            showError('contact-whatsapp-error', 'O WhatsApp deve conter 11 ou 12 dígitos numéricos (ex.: (84)98563-5108 ou (055)98563-5108).');
            whatsappInput.classList.add('invalid');
            isValid = false;
        } else {
            whatsappInput.classList.remove('invalid');
        }

        const email = formData.get('email').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('contact-email-error', 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        const instagram = formData.get('instagram').trim();
        if (!/^@[A-Za-z0-9._]{1,30}$/.test(instagram)) {
            showError('contact-instagram-error', 'O Instagram deve começar com @ e conter apenas letras, números, pontos ou sublinhados.');
            isValid = false;
        }

        const platform = formData.get('platform');
        if (!platform) {
            showError('platform-error', 'Por favor, selecione uma plataforma.');
            isValid = false;
        }

        const reels = formData.get('reels');
        if (!/^\d+$/.test(reels) || parseInt(reels) < 0) {
            showError('contact-reels-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            isValid = false;
        }

        const videoType = formData.get('video-type');
        if (!videoType) {
            showError('video-type-error', 'Por favor, selecione uma opção para os vídeos.');
            isValid = false;
        }

        const stories = formData.get('stories');
        if (!/^\d+$/.test(stories) || parseInt(stories) < 0) {
            showError('contact-stories-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            isValid = false;
        }

        if (parseInt(reels) === 0 && parseInt(stories) === 0) {
            showError('reels-stories-error', 'Pelo menos um dos campos (Reels ou Combos de Stories) deve ser maior que 0.');
            isValid = false;
        }

        const presence = formData.get('presence');
        if (!presence) {
            showError('presence-error', 'Por favor, selecione uma opção de presença física.');
            isValid = false;
        } else if (presence === 'Outra' && !formData.get('presence-other').trim()) {
            showError('presence-other-error', 'Por favor, descreva a outra opção.');
            isValid = false;
        }

        const vip = formData.get('vip');
        if (!vip) {
            showError('vip-error', 'Por favor, selecione uma opção para presença VIP.');
            isValid = false;
        }

        const observations = formData.get('observations').trim();
        if (observations.length > 500) {
            showError('contact-observations-error', 'O texto não pode exceder 500 caracteres.');
            isValid = false;
        }

        return isValid;
    };

    // Manipula a exibição do campo "Outra" para presença física
    const presenceOtherInput = document.getElementById('contact-presence-other');
    document.querySelectorAll('input[name="presence"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Outra') {
                presenceOtherInput.classList.remove('hidden');
                presenceOtherInput.required = true;
            } else {
                presenceOtherInput.classList.add('hidden');
                presenceOtherInput.required = false;
                presenceOtherInput.value = '';
                document.getElementById('presence-other-error').classList.add('hidden');
            }
        });
    });

    // Manipula o envio do formulário
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const formData = new FormData(contactForm);
        if (validateForm(formData)) {
            const brand = formData.get('brand').trim();
            const responsible = formData.get('responsible').trim();
            const whatsapp = formData.get('whatsapp').replace(/[^0-9]/g, '');
            const email = formData.get('email').trim();
            const instagram = formData.get('instagram').trim();
            const platform = formData.get('platform');
            const reels = formData.get('reels');
            const videoType = formData.get('video-type');
            const stories = formData.get('stories');
            const presence = formData.get('presence');
            const presenceOther = formData.get('presence-other').trim();
            const vip = formData.get('vip');
            const observations = formData.get('observations').trim();

            const formattedWhatsapp = formatWhatsApp(whatsapp);

            const videoTypeMessage = videoType === 'Mesmo'
                ? 'O mesmo para Instagram e TikTok'
                : 'Roteiros diferentes (um para cada plataforma)';

            let presenceMessage;
            if (presence === 'Loja') {
                presenceMessage = 'Presença da Edi em loja para gravação no local';
            } else if (presence === 'Casa') {
                presenceMessage = 'Gravação na casa da Edi';
            } else {
                presenceMessage = presenceOther;
            }

            const whatsappMessage = `Olá! Tudo bem? Tenho interesse em fechar uma parceria de publicidade com a Edi. Seguem as informações do briefing:\n` +
                `• Nome da Marca/Empresa: ${brand}\n` +
                `• Responsável: ${responsible}\n` +
                `• WhatsApp: ${formattedWhatsapp}\n` +
                `• E-mail: ${email}\n` +
                `• Instagram: ${instagram}\n` +
                `• Plataforma: ${platform}\n` +
                `• Reels: ${reels}\n` +
                `• Os vídeos serão: ${videoTypeMessage}\n` +
                `• Combos de Stories: ${stories}\n` +
                `• Presença física: ${presenceMessage}\n` +
                `• Presença VIP: ${vip}\n` +
                `• Observações: ${observations || 'Nenhuma'}`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${encodeURIComponent(whatsappMessage)}`;
            try {
                window.open(whatsappUrl, '_blank');
                showCustomAlert('Briefing enviado!');
            } catch (error) {
                console.error('Erro ao abrir o WhatsApp:', error);
                showCustomAlert('Erro ao enviar o briefing. Tente novamente.');
            }

            contactForm.reset();
            document.querySelectorAll('input[name="presence"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="platform"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="video-type"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="vip"]').forEach(radio => radio.checked = false);
            presenceOtherInput.classList.add('hidden');
            whatsappInput.classList.remove('invalid');
        }
    });
}

// Manipula o menu mobile
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = !mobileMenu.classList.contains('hidden');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// Configura o IntersectionObserver para o botão "Voltar ao Topo"
if (backToTopButton && document.querySelector('header')) {
    const header = document.querySelector('header');
    const backToTopObserver = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        },
        { threshold: 0 }
    );
    backToTopObserver.observe(header);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Configura rolagem suave para links de âncora e limpa a URL
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                    window.history.pushState("", document.title, window.location.pathname + window.location.search);
                }, 500);
            }

            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    if (window.location.hash) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
});

// Configura o IntersectionObserver para animações de fade-in
const animateElements = document.querySelectorAll('.animate-fadeIn');
if (animateElements.length > 0) {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -20% 0px' }
    );
    animateElements.forEach(element => animationObserver.observe(element));
}

// Função para alternar o accordion do FAQ (apenas um aberto por vez)
function toggleAccordion(element) {
    const answer = element.nextElementSibling;
    const toggleIcon = element.querySelector('.faq-toggle');
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('open');
        item.style.maxHeight = '0';
        item.parentElement.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        item.parentElement.querySelector('.faq-toggle').textContent = '+';
    });

    if (!isOpen) {
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggleIcon.textContent = '-';
        element.setAttribute('aria-expanded', 'true');
    }
}

// Adiciona eventos de clique e teclado aos itens do FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => toggleAccordion(question));
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion(question);
        }
    });
});

// Manipula o botão "Ver mais FAQs"
if (showMoreFaqsButton) {
    showMoreFaqsButton.addEventListener('click', () => {
        document.querySelectorAll('.faq-item').forEach(item => {
            const answer = item.querySelector('.faq-answer');
            const question = item.querySelector('.faq-question');
            const toggleIcon = question.querySelector('.faq-toggle');
            answer.classList.remove('open');
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
            toggleIcon.textContent = '+';
        });

        document.querySelectorAll('.faq-hidden').forEach(item => {
            item.classList.remove('hidden');
        });

        showMoreFaqsButton.classList.add('hidden');
        collapseFaqsButton.parentElement.classList.remove('hidden');
    });

    showMoreFaqsButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showMoreFaqsButton.click();
        }
    });
}

// Manipula o botão "Recolher FAQs"
if (collapseFaqsButton) {
    collapseFaqsButton.addEventListener('click', () => {
        document.querySelectorAll('.faq-item').forEach(item => {
            const answer = item.querySelector('.faq-answer');
            const question = item.querySelector('.faq-question');
            const toggleIcon = question.querySelector('.faq-toggle');
            answer.classList.remove('open');
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
            toggleIcon.textContent = '+';
            if (item.classList.contains('faq-hidden')) {
                item.classList.add('hidden');
            }
        });
        collapseFaqsButton.parentElement.classList.add('hidden');
        showMoreFaqsButton.classList.remove('hidden');

        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    collapseFaqsButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            collapseFaqsButton.click();
        }
    });
}

// Manipula o botão "Ver mais" da seção Sobre
if (showMoreAboutButton && collapseAboutButton) {
    showMoreAboutButton.addEventListener('click', () => {
        document.querySelector('.about-text-hidden').classList.remove('hidden');
        showMoreAboutButton.classList.add('hidden');
        collapseAboutButton.classList.remove('hidden');
    });

    showMoreAboutButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showMoreAboutButton.click();
        }
    });

    collapseAboutButton.addEventListener('click', () => {
        document.querySelector('.about-text-hidden').classList.add('hidden');
        collapseAboutButton.classList.add('hidden');
        showMoreAboutButton.classList.remove('hidden');

        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    collapseAboutButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            collapseAboutButton.click();
        }
    });
}