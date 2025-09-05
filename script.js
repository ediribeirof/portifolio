// script.js

// Seleciona elementos do DOM para interação
const mobileMenuButton = document.getElementById('mobile-menu-button'); // Botão do menu mobile
const mobileMenu = document.getElementById('mobile-menu'); // Container do menu mobile
const backToTopButton = document.getElementById('backToTop'); // Botão "Voltar ao Topo"
const popup = document.getElementById('popup'); // Pop-up de coleta de informações
const popupClose = document.getElementById('popup-close'); // Botão de fechar pop-up
const popupForm = document.getElementById('popup-form'); // Formulário do pop-up
const contactForm = document.getElementById('contact-form'); // Formulário de contato
const whatsappDirectButton = document.getElementById('whatsapp-direct'); // Botão WhatsApp direto
const customAlert = document.getElementById('custom-alert'); // Alert personalizado
const customAlertMessage = document.getElementById('custom-alert-message'); // Mensagem do alert
const customAlertClose = document.getElementById('custom-alert-close'); // Botão de fechar alert
const lgpdConsent = document.getElementById('lgpd-consent'); // Banner de consentimento LGPD
const lgpdAccept = document.getElementById('lgpd-accept'); // Botão Aceitar LGPD
const lgpdDecline = document.getElementById('lgpd-decline'); // Botão Recusar LGPD

// Função para mostrar o alert personalizado
function showCustomAlert(message) {
    customAlertMessage.textContent = message;
    customAlert.classList.remove('hidden');
    const timeout = setTimeout(() => {
        customAlert.classList.add('hidden');
    }, 5000); // Desaparece após 5 segundos
    customAlertClose.addEventListener('click', () => {
        customAlert.classList.add('hidden');
        clearTimeout(timeout); // Cancela o timeout se clicar em OK
    }, { once: true }); // Garante que o evento é removido após um clique
}

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

    // Manipula o formulário do pop-up
    if (popupForm) {
        // Filtra caracteres no campo Nome em tempo real
        const popupNameInput = document.getElementById('popup-name');
        popupNameInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s^´\`~Çç]/g, ''); // Remove tudo exceto letras, espaços e çÇ^~`´
            e.target.value = value;
        });

        // Formata o campo WhatsApp em tempo real
        const popupWhatsappInput = document.getElementById('popup-whatsapp');
        popupWhatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
            if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
            e.target.value = formatPhoneNumber(value); // Formata o número
            if (value.length !== 11) {
                e.target.classList.add('invalid');
            } else {
                e.target.classList.remove('invalid');
            }
        });

        // Função para formatar o número de telefone
        function formatPhoneNumber(value) {
            if (!value) return '';
            if (value.length <= 2) return `(${value}`;
            if (value.length <= 7) return `(${value.slice(0, 2)})${value.slice(2)}`;
            return `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }

        // Função para mostrar mensagem de erro no pop-up
        const showPopupError = (elementId, message) => {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.classList.add('active');
        };

        // Função para limpar mensagens de erro no pop-up
        const clearPopupErrors = () => {
            document.querySelectorAll('#popup-form .error-message').forEach(error => {
                error.classList.remove('active');
            });
        };

        // Manipula o envio do formulário do pop-up
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearPopupErrors();

            const formData = new FormData(popupForm);
            let isValid = true;

            // Valida Nome
            const name = formData.get('name').trim();
            if (!/^[A-Za-zÀ-ÿ\s^´\`~Çç]{2,}$/.test(name)) {
                showPopupError('popup-name-error', 'O nome deve conter apenas letras, espaços ou os caracteres çÇ^~`´ e ter no mínimo 2 caracteres.');
                isValid = false;
            }

            // Valida Email
            const email = formData.get('email').trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showPopupError('popup-email-error', 'Por favor, insira um e-mail válido.');
                isValid = false;
            }

            // Valida WhatsApp
            const whatsapp = formData.get('whatsapp').replace(/\D/g, ''); // Remove formatação
            if (!/^\d{11}$/.test(whatsapp)) {
                showPopupError('popup-whatsapp-error', 'O WhatsApp deve conter exatamente 11 dígitos numéricos (ex.: (85)99730-4019).');
                popupWhatsappInput.classList.add('invalid');
                isValid = false;
            } else {
                popupWhatsappInput.classList.remove('invalid');
            }

            // Valida Checkbox de Consentimento
            const consent = formData.get('consent');
            if (!consent) {
                showPopupError('popup-consent-error', 'Você deve concordar com a Política de Privacidade para enviar.');
                isValid = false;
            }

            if (isValid) {
                console.log('Pop-up Form Data:', { name, email, whatsapp });
                popup.classList.add('hidden');
                showCustomAlert('Informações enviadas com sucesso!');
                popupForm.reset();
                popupWhatsappInput.classList.remove('invalid');
            }
        });
    }
}

// Manipula o botão WhatsApp direto
if (whatsappDirectButton) {
    whatsappDirectButton.addEventListener('click', () => {
        const whatsappMessage = 'Olá! Tudo bem? Tenho interesse em fechar uma parceria de publicidade.';
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Manipula o envio do formulário de contato
if (contactForm) {
    // Função para mostrar mensagem de erro
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('active');
    };

    // Função para limpar mensagens de erro
    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('active');
        });
    };

    // Filtra apenas números no campo WhatsApp em tempo real
    const whatsappInput = document.getElementById('contact-whatsapp');
    whatsappInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove tudo que não é número
        e.target.value = value;
        if (value.length !== 11) {
            e.target.classList.add('invalid');
        } else {
            e.target.classList.remove('invalid');
        }
    });

    // Filtra caracteres no campo Nome da Marca/Empresa em tempo real
    const brandInput = document.getElementById('contact-brand');
    brandInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^A-Za-zÀ-ÿ0-9\s]/g, ''); // Remove tudo exceto letras, números e espaços
        e.target.value = value;
    });

    // Filtra caracteres no campo Nome do Responsável em tempo real
    const responsibleInput = document.getElementById('contact-responsible');
    responsibleInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s^´\`~Çç]/g, ''); // Remove tudo exceto letras, espaços e çÇ^~`´
        e.target.value = value;
    });

    // Função para validar o formulário
    const validateForm = (formData) => {
        let isValid = true;

        // Valida Nome da Marca/Empresa
        const brand = formData.get('brand').trim();
        if (!/^[A-Za-zÀ-ÿ0-9\s]{2,}$/.test(brand)) {
            showError('contact-brand-error', 'O nome deve conter letras ou números e ter no mínimo 2 caracteres.');
            isValid = false;
        }

        // Valida Nome do Responsável
        const responsible = formData.get('responsible').trim();
        if (!/^[A-Za-zÀ-ÿ\s^´\`~Çç]{2,}$/.test(responsible)) {
            showError('contact-responsible-error', 'O nome deve conter apenas letras, espaços ou os caracteres çÇ^~`´ e ter no mínimo 2 caracteres.');
            isValid = false;
        }

        // Valida WhatsApp
        const whatsapp = formData.get('whatsapp').trim();
        if (!/^\d{11}$/.test(whatsapp)) {
            showError('contact-whatsapp-error', 'O WhatsApp deve conter exatamente 11 dígitos numéricos (ex.: 85997304019).');
            whatsappInput.classList.add('invalid');
            isValid = false;
        } else {
            whatsappInput.classList.remove('invalid');
        }

        // Valida E-mail
        const email = formData.get('email').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('contact-email-error', 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        // Valida Instagram
        const instagram = formData.get('instagram').trim();
        if (!/^@[A-Za-z0-9._]{1,30}$/.test(instagram)) {
            showError('contact-instagram-error', 'O Instagram deve começar com @ e conter apenas letras, números, pontos ou sublinhados.');
            isValid = false;
        }

        // Valida Plataforma
        const platform = formData.get('platform');
        if (!platform) {
            showError('platform-error', 'Por favor, selecione uma plataforma.');
            isValid = false;
        }

        // Valida Reels
        const reels = formData.get('reels');
        if (!/^\d+$/.test(reels) || parseInt(reels) < 0) {
            showError('contact-reels-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            isValid = false;
        }

        // Valida Tipo de Vídeo
        const videoType = formData.get('video-type');
        if (!videoType) {
            showError('video-type-error', 'Por favor, selecione uma opção para os vídeos.');
            isValid = false;
        }

        // Valida Stories
        const stories = formData.get('stories');
        if (!/^\d+$/.test(stories) || parseInt(stories) < 0) {
            showError('contact-stories-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            isValid = false;
        }

        // Valida se pelo menos um serviço (Reels ou Stories) foi selecionado
        if (parseInt(reels) === 0 && parseInt(stories) === 0) {
            showError('contact-reels-error', 'Pelo menos um serviço (Reels ou Stories) deve ser maior que 0.');
            showError('contact-stories-error', 'Pelo menos um serviço (Reels ou Stories) deve ser maior que 0.');
            isValid = false;
        }

        // Valida Presença Física
        const presence = formData.get('presence');
        if (!presence) {
            showError('presence-error', 'Por favor, selecione uma opção de presença física.');
            isValid = false;
        } else if (presence === 'Outra' && !formData.get('presence-other').trim()) {
            showError('presence-other-error', 'Por favor, descreva a outra opção.');
            isValid = false;
        }

        // Valida Presença VIP
        const vip = formData.get('vip');
        if (!vip) {
            showError('vip-error', 'Por favor, selecione uma opção para presença VIP.');
            isValid = false;
        }

        // Valida Observações (opcional, mas com limite)
        const observations = formData.get('observations').trim();
        if (observations.length > 500) {
            showError('contact-observations-error', 'O texto não pode exceder 500 caracteres.');
            isValid = false;
        }

        return isValid;
    };

    // Manipula o campo "Outra opção" para presença física
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
                document.getElementById('presence-other-error').classList.remove('active');
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
            const whatsapp = formData.get('whatsapp').trim();
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

            // Formata a mensagem para o WhatsApp
            const whatsappMessage = `Novo briefing de contato:%0A%0A` +
                `Nome da Marca/Empresa: ${encodeURIComponent(brand)}%0A` +
                `Responsável: ${encodeURIComponent(responsible)}%0A` +
                `WhatsApp: ${encodeURIComponent(whatsapp)}%0A` +
                `E-mail: ${encodeURIComponent(email)}%0A` +
                `Instagram: ${encodeURIComponent(instagram)}%0A` +
                `Plataforma: ${encodeURIComponent(platform)}%0A` +
                `Reels: ${encodeURIComponent(reels)}%0A` +
                `Tipo de Vídeo: ${encodeURIComponent(videoType)}%0A` +
                `Combos de Stories: ${encodeURIComponent(stories)}%0A` +
                `Presença Física: ${encodeURIComponent(presence === 'Outra' ? presenceOther : presence)}%0A` +
                `Presença VIP: ${encodeURIComponent(vip)}%0A` +
                `Observações: ${encodeURIComponent(observations || 'Nenhuma')}`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');
            showCustomAlert('Briefing enviado!');

            console.log('Contact Form Data:', {
                brand, responsible, whatsapp, email, instagram, platform, reels, videoType, stories, presence, presenceOther, vip, observations
            });

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

// Função para gerenciar rolagem suave e limpar a URL
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Impede o comportamento padrão do link
            const targetId = this.getAttribute("href").substring(1); // Remove o #
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" }); // Rolagem suave
                // Remove o hash da URL após 500ms (tempo da rolagem)
                setTimeout(() => {
                    window.history.pushState("", document.title, window.location.pathname + window.location.search);
                }, 500);
            }
        });
    });

    // Remove hash ao carregar a página, se existir
    if (window.location.hash) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
});

// Adiciona rolagem suave para todos os links de âncora (mantido como fallback)
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

// Função para verificar e gerenciar o consentimento LGPD
document.addEventListener("DOMContentLoaded", function () {
    // Verifica se o consentimento já foi dado
    if (!localStorage.getItem("lgpdConsent")) {
        lgpdConsent.classList.add("active");
    }

    // Aceitar cookies
    if (lgpdAccept) {
        lgpdAccept.addEventListener("click", function () {
            localStorage.setItem("lgpdConsent", "accepted");
            lgpdConsent.classList.remove("active");
            // Integração com Microsoft Clarity (substitua YOUR_CLARITY_PROJECT_ID pelo ID real)
            if (!window.Clarity) {
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/YOUR_CLARITY_PROJECT_ID";
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
            }
        });
    }

    // Recusar cookies
    if (lgpdDecline) {
        lgpdDecline.addEventListener("click", function () {
            localStorage.setItem("lgpdConsent", "declined");
            lgpdConsent.classList.remove("active");
            // Opcional: remover ou desativar scripts de rastreamento se recusado
            if (window.Clarity) {
                window.Clarity("stop"); // Para o rastreamento, se já iniciado
            }
        });
    }
});