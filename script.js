// Seleciona elementos do DOM para interação com o site
const mobileMenuButton = document.getElementById('mobile-menu-button'); // Botão do menu mobile
const mobileMenu = document.getElementById('mobile-menu'); // Container do menu mobile
const backToTopButton = document.getElementById('backToTop'); // Botão "Voltar ao topo"
const contactForm = document.getElementById('contact-form'); // Formulário de contato
const whatsappDirectButton = document.getElementById('whatsapp-direct'); // Botão de contato direto via WhatsApp
const customAlert = document.getElementById('custom-alert'); // Container do alerta personalizado
const customAlertMessage = document.getElementById('custom-alert-message'); // Mensagem do alerta
const customAlertClose = document.getElementById('custom-alert-close'); // Botão para fechar o alerta
const showMoreFaqsButton = document.getElementById('show-more-faqs'); // Botão "Ver mais FAQs"
const collapseFaqsButton = document.getElementById('collapse-faqs'); // Botão "Recolher FAQs"
const showMoreAboutButton = document.getElementById('show-more-about'); // Botão "Ver mais" da seção Sobre
const collapseAboutButton = document.getElementById('collapse-about'); // Botão "Recolher" da seção Sobre

// Função para mostrar o alerta personalizado com uma mensagem
function showCustomAlert(message) {
    // Verifica se os elementos do alerta existem
    if (customAlert && customAlertMessage && customAlertClose) {
        customAlertMessage.textContent = message; // Define a mensagem do alerta
        customAlert.classList.remove('hidden'); // Torna o alerta visível
        const timeout = setTimeout(() => {
            customAlert.classList.add('hidden'); // Oculta o alerta após 5 segundos
            clearTimeout(timeout); // Limpa o temporizador
        }, 5000);
        customAlertClose.addEventListener('click', () => {
            customAlert.classList.add('hidden'); // Oculta o alerta ao clicar no botão
            clearTimeout(timeout); // Limpa o temporizador
        }, { once: true }); // Executa apenas uma vez
    }
}

// Função para exibir mensagens de erro em campos do formulário (exceto WhatsApp e Instagram)
const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId); // Seleciona o elemento de erro
    errorElement.textContent = message; // Define a mensagem de erro
    errorElement.classList.remove('hidden'); // Torna a mensagem visível
    const inputElement = document.getElementById(elementId.replace('-error', '')); // Seleciona o input correspondente
    if (inputElement) {
        inputElement.classList.add('invalid'); // Adiciona classe de erro ao input
    }
};

// Função para limpar todas as mensagens de erro do formulário
const clearErrors = () => {
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.add('hidden'); // Oculta todas as mensagens de erro
    });
    document.querySelectorAll('.invalid').forEach(input => {
        input.classList.remove('invalid'); // Remove a classe de erro de todos os inputs
    });
    // Limpa mensagens de erro personalizadas do WhatsApp e Instagram
    const whatsappInput = document.getElementById('contact-whatsapp');
    const instagramInput = document.getElementById('contact-instagram');
    if (whatsappInput) {
        whatsappInput.setCustomValidity(''); // Remove mensagem de erro nativa do WhatsApp
    }
    if (instagramInput) {
        instagramInput.setCustomValidity(''); // Remove mensagem de erro nativa do Instagram
    }
};

// Manipula o botão de contato direto via WhatsApp
if (whatsappDirectButton) {
    whatsappDirectButton.addEventListener('click', () => {
        const whatsappMessage = 'Olá! Tudo bem? Tenho interesse em fechar uma parceria de publicidade com a Edi.'; // Mensagem padrão
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5585997304019&text=${encodeURIComponent(whatsappMessage)}`; // URL do WhatsApp
        window.open(whatsappUrl, '_blank'); // Abre o WhatsApp em uma nova aba
    });
}

// Manipula o formulário de contato
if (contactForm) {
    // Função para validar o número de WhatsApp
    const validateWhatsApp = (whatsappValue) => {
        const cleanedValue = whatsappValue.replace(/\D/g, ''); // Remove caracteres não numéricos
        return /^\d{11}$/.test(cleanedValue) && cleanedValue.charAt(2) === '9'; // Verifica se tem 11 dígitos e o terceiro é 9
    };

    // Função para validar o Instagram
    const validateInstagram = (instagramValue) => {
        // Permite letras (incluindo çÇ), números, pontos e sublinhados após o @
        return /^@[A-Za-zÀ-ÿ0-9._çÇ]{1,30}$/.test(instagramValue.trim());
    };

    // Validação em tempo real do campo WhatsApp com máscara usando IMask
    const whatsappInput = document.getElementById('contact-whatsapp');
    if (whatsappInput) {
        // Aplica a máscara (00) 00000-0000 ao campo WhatsApp
        IMask(whatsappInput, { mask: '(00) 00000-0000' });
        whatsappInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
            if (!validateWhatsApp(value)) {
                // Define mensagem de erro personalizada com setCustomValidity
                e.target.setCustomValidity('O WhatsApp deve conter 11 dígitos, incluindo DDD e 9 (ex.: (85) 99730-4019).');
            } else {
                // Remove mensagem de erro se o número for válido
                e.target.setCustomValidity('');
            }
            // Força a exibição da mensagem de erro nativa, se aplicável
            e.target.reportValidity();
        });
    }

    // Validação em tempo real do campo Instagram
    const instagramInput = document.getElementById('contact-instagram');
    if (instagramInput) {
        instagramInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (!validateInstagram(value)) {
                // Define mensagem de erro personalizada com setCustomValidity
                e.target.setCustomValidity('O Instagram deve começar com @ e conter apenas letras, números, pontos ou sublinhados.');
            } else {
                // Remove mensagem de erro se o valor for válido
                e.target.setCustomValidity('');
            }
            // Força a exibição da mensagem de erro nativa, se aplicável
            e.target.reportValidity();
        });
    }

    // Validação em tempo real do campo Nome da Marca (sem restrição de caracteres)
    const brandInput = document.getElementById('contact-brand');
    if (brandInput) {
        // Removida a restrição de caracteres, permitindo qualquer entrada
        brandInput.addEventListener('input', (e) => {
            // Não aplica nenhuma filtragem, permite todos os caracteres
        });
    }

    // Validação em tempo real do campo Nome do Responsável
    const responsibleInput = document.getElementById('contact-responsible');
    if (responsibleInput) {
        responsibleInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s^´\`~Çç]/g, ''); // Remove caracteres não permitidos
            e.target.value = value; // Atualiza o valor do input
        });
    }

    // Validação em tempo real do campo Combos de Stories
    const storiesInput = document.getElementById('contact-stories');
    if (storiesInput) {
        storiesInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^0-9]/g, ''); // Permite apenas números
            e.target.value = value; // Atualiza o valor do input
            if (value === '' || parseInt(value) < 0) {
                e.target.classList.add('invalid'); // Marca como inválido
            } else {
                e.target.classList.remove('invalid'); // Remove marcação de inválido
            }
        });
    }

    // Validação em tempo real do campo Reels
    const reelsInput = document.getElementById('contact-reels');
    if (reelsInput) {
        reelsInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/[^0-9]/g, ''); // Permite apenas números
            e.target.value = value; // Atualiza o valor do input
            if (value === '' || parseInt(value) < 0) {
                e.target.classList.add('invalid'); // Marca como inválido
            } else {
                e.target.classList.remove('invalid'); // Remove marcação de inválido
            }
        });
    }

    // Função para validar os dados do formulário ao enviar
    const validateForm = (formData) => {
        let isValid = true; // Flag para verificar se o formulário é válido

        // Validação do campo Nome da Marca
        const brand = formData.get('brand').trim();
        if (brand.length < 2) {
            showError('contact-brand-error', 'O nome deve ter no mínimo 2 caracteres.');
            isValid = false;
        }

        // Validação do campo Nome do Responsável
        const responsible = formData.get('responsible').trim();
        if (!/^[A-Za-zÀ-ÿ\s^´\`~Çç]{2,}$/.test(responsible)) {
            showError('contact-responsible-error', 'O nome deve conter apenas letras, espaços ou os caracteres çÇ^~`´ e ter no mínimo 2 caracteres.');
            isValid = false;
        }

        // Validação do campo WhatsApp
        const whatsapp = formData.get('whatsapp').replace(/\D/g, '');
        if (!validateWhatsApp(whatsapp)) {
            whatsappInput.setCustomValidity('O WhatsApp deve conter 11 dígitos, incluindo DDD e 9 (ex.: (85) 99730-4019).');
            whatsappInput.reportValidity();
            isValid = false;
        } else {
            whatsappInput.setCustomValidity('');
        }

        // Validação do campo Instagram
        const instagram = formData.get('instagram').trim();
        if (!validateInstagram(instagram)) {
            instagramInput.setCustomValidity('O Instagram deve começar com @ e conter apenas letras, números, pontos ou sublinhados.');
            instagramInput.reportValidity();
            isValid = false;
        } else {
            instagramInput.setCustomValidity('');
        }

        // Validação do campo E-mail
        const email = formData.get('email').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('contact-email-error', 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        // Validação do campo Plataforma
        const platform = formData.get('platform');
        if (!platform) {
            showError('platform-error', 'Por favor, selecione uma plataforma.');
            isValid = false;
        }

        // Validação do campo Reels
        const reels = formData.get('reels').trim();
        if (reels === '') {
            showError('contact-reels-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            reelsInput.classList.add('invalid');
            isValid = false;
        } else if (!/^\d+$/.test(reels) || parseInt(reels) < 0) {
            showError('contact-reels-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            reelsInput.classList.add('invalid');
            isValid = false;
        } else {
            reelsInput.classList.remove('invalid');
        }

        // Validação do campo Vídeo
        const videoType = formData.get('video-type');
        if (!videoType) {
            showError('video-type-error', 'Por favor, selecione uma opção para os vídeos.');
            isValid = false;
        }

        // Validação do campo Stories
        const stories = formData.get('stories').trim();
        if (stories === '') {
            showError('contact-stories-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            storiesInput.classList.add('invalid');
            isValid = false;
        } else if (!/^\d+$/.test(stories) || parseInt(stories) < 0) {
            showError('contact-stories-error', 'Por favor, insira um número inteiro maior ou igual a 0.');
            storiesInput.classList.add('invalid');
            isValid = false;
        } else {
            storiesInput.classList.remove('invalid');
        }

        // Validação combinada de Reels e Stories
        if (parseInt(reels) === 0 && parseInt(stories) === 0) {
            showError('reels-stories-error', 'Pelo menos um dos campos (Reels ou Combos de Stories) deve ser maior que 0.');
            isValid = false;
        }

        // Validação do campo Presença Física
        const presence = formData.get('presence');
        if (!presence) {
            showError('presence-error', 'Por favor, selecione uma opção de presença física.');
            isValid = false;
        } else if (presence === 'Outra' && !formData.get('presence-other').trim()) {
            showError('presence-other-error', 'Por favor, descreva a outra opção.');
            isValid = false;
        }

        // Validação do campo Presença VIP
        const vip = formData.get('vip');
        if (!vip) {
            showError('vip-error', 'Por favor, selecione uma opção para presença VIP.');
            isValid = false;
        }

        // Validação do campo Observações
        const observations = formData.get('observations').trim();
        if (observations.length > 500) {
            showError('contact-observations-error', 'O texto não pode exceder 500 caracteres.');
            isValid = false;
        }

        return isValid; // Retorna se o formulário é válido
    };

    // Manipula a exibição do campo "Outra" para presença física
    const presenceOtherInput = document.getElementById('contact-presence-other');
    if (presenceOtherInput) {
        document.querySelectorAll('input[name="presence"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'Outra') {
                    presenceOtherInput.classList.remove('hidden'); // Mostra o campo de texto
                    presenceOtherInput.required = true; // Torna o campo obrigatório
                } else {
                    presenceOtherInput.classList.add('hidden'); // Oculta o campo
                    presenceOtherInput.required = false; // Remove obrigatoriedade
                    presenceOtherInput.value = ''; // Limpa o valor
                    document.getElementById('presence-other-error').classList.add('hidden'); // Oculta mensagem de erro
                }
            });
        });
    }

    // Manipula o envio do formulário
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário
        clearErrors(); // Limpa mensagens de erro anteriores

        const formData = new FormData(contactForm); // Coleta os dados do formulário
        if (validateForm(formData)) { // Valida os dados
            // Extrai os valores dos campos
            const brand = formData.get('brand').trim();
            const responsible = formData.get('responsible').trim();
            const whatsapp = formData.get('whatsapp').replace(/\D/g, '');
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

            // Formata o número do WhatsApp para exibição na mensagem
            const formattedWhatsapp = `(${whatsapp.slice(0, 2)}) ${whatsapp.slice(2, 7)}-${whatsapp.slice(7)}`;

            // Define a mensagem do tipo de vídeo
            const videoTypeMessage = videoType === 'Mesmo'
                ? 'O mesmo para Instagram e TikTok'
                : 'Roteiros diferentes (um para cada plataforma)';

            // Define a mensagem de presença física
            let presenceMessage;
            if (presence === 'Loja') {
                presenceMessage = 'Presença da Edi em loja para gravação no local';
            } else if (presence === 'Casa') {
                presenceMessage = 'Gravação na casa da Edi';
            } else {
                presenceMessage = presenceOther;
            }

            // Monta a mensagem para o WhatsApp
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
                window.open(whatsappUrl, '_blank'); // Abre o WhatsApp
                showCustomAlert('Briefing enviado com sucesso!'); // Exibe alerta de sucesso
            } catch (error) {
                console.error('Erro ao abrir o WhatsApp:', error); // Loga erro no console
                showCustomAlert('Erro ao enviar o briefing. Tente novamente.'); // Exibe alerta de erro
            }

            // Reseta o formulário e os campos
            contactForm.reset();
            document.querySelectorAll('input[name="presence"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="platform"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="video-type"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('input[name="vip"]').forEach(radio => radio.checked = false);
            presenceOtherInput.classList.add('hidden');
            whatsappInput.setCustomValidity('');
            instagramInput.setCustomValidity('');
        }
    });
}

// Manipula o menu mobile
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden'); // Alterna visibilidade do menu
        const isExpanded = !mobileMenu.classList.contains('hidden');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded); // Atualiza acessibilidade
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden'); // Oculta o menu ao clicar em um link
            mobileMenuButton.setAttribute('aria-expanded', 'false'); // Atualiza acessibilidade
        });
    });

    document.addEventListener('click', (event) => {
        // Oculta o menu se clicar fora dele ou do botão
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('resize', () => {
        // Oculta o menu em desktop se estiver aberto
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
            // Mostra ou oculta o botão com base na visibilidade do header
            if (!entry.isIntersecting) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        },
        { threshold: 0 } // Observa quando o header sai da tela
    );
    backToTopObserver.observe(header);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rola suavemente para o topo
        });
    });
}

// Configura rolagem suave para links de âncora
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o comportamento padrão do link
            const targetId = this.getAttribute('href').substring(1); // Obtém o ID do destino
            const targetElement = document.getElementById(targetId); // Seleciona o elemento de destino
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Rola suavemente até o destino
                // Oculta o menu mobile se estiver aberto
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            } else {
                console.error('Elemento de destino não encontrado:', targetId); // Loga erro se o destino não existir
            }
        });
    });
});

// Manipula a seção de FAQs (perguntas frequentes)
if (showMoreFaqsButton && collapseFaqsButton) {
    const faqItems = document.querySelectorAll('.faq-item'); // Seleciona todos os itens de FAQ
    const hiddenFaqs = document.querySelectorAll('.faq-hidden'); // Seleciona FAQs ocultas
    const faqToggleContainer = document.querySelectorAll('.faq-toggle-container'); // Containers dos botões de toggle

    showMoreFaqsButton.addEventListener('click', () => {
        hiddenFaqs.forEach(faq => faq.classList.remove('hidden')); // Mostra FAQs ocultas
        showMoreFaqsButton.classList.add('hidden'); // Oculta botão "Ver mais"
        faqToggleContainer.forEach(container => {
            if (container.querySelector('#collapse-faqs')) {
                container.classList.remove('hidden'); // Mostra botão "Recolher"
            }
        });
    });

    collapseFaqsButton.addEventListener('click', () => {
        hiddenFaqs.forEach(faq => faq.classList.add('hidden')); // Oculta FAQs extras
        showMoreFaqsButton.classList.remove('hidden'); // Mostra botão "Ver mais"
        faqToggleContainer.forEach(container => {
            if (container.querySelector('#collapse-faqs')) {
                container.classList.add('hidden'); // Oculta botão "Recolher"
            }
        });
        // Rola para a seção de FAQs
        const faqSection = document.getElementById('faq');
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Rola suavemente para a seção de FAQs
        }
        // Fecha todos os acordeões abertos
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = '0';
            toggle.textContent = '+';
        });
    });

    // Manipula a expansão/recolhimento de cada FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            // Fecha todos os outros acordeões
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = '0';
                    otherToggle.textContent = '+';
                }
            });
            // Alterna o estado do acordeão clicado
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? '0' : `${answer.scrollHeight}px`; // Ajusta altura da resposta
            toggle.textContent = isExpanded ? '+' : '−'; // Atualiza o ícone de toggle
        });

        // Suporte para acessibilidade (tecla Enter ou Espaço)
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click(); // Simula clique na pergunta
            }
        });
    });
}

// Manipula a seção "Quem sou eu"
if (showMoreAboutButton && collapseAboutButton) {
    const aboutTextHidden = document.querySelector('.about-text-hidden'); // Texto oculto da seção Sobre
    const aboutTextInitial = document.querySelector('.about-text-initial'); // Texto inicial da seção Sobre

    showMoreAboutButton.addEventListener('click', () => {
        aboutTextHidden.classList.remove('hidden'); // Mostra texto oculto
        showMoreAboutButton.classList.add('hidden'); // Oculta botão "Ver mais"
        collapseAboutButton.classList.remove('hidden'); // Mostra botão "Recolher"
    });

    collapseAboutButton.addEventListener('click', () => {
        aboutTextHidden.classList.add('hidden'); // Oculta texto extra
        showMoreAboutButton.classList.remove('hidden'); // Mostra botão "Ver mais"
        collapseAboutButton.classList.add('hidden'); // Oculta botão "Recolher"
    });
}

// Configura IntersectionObserver para animações de fade-in
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Adiciona classe para animação
            animationObserver.unobserve(entry.target); // Para de observar o elemento
        }
    });
}, { rootMargin: '0px 0px -20% 0px' }); // Margem para disparar a animação

// Aplica animação a todos os elementos com a classe 'animate-fadeIn'
document.querySelectorAll('.animate-fadeIn').forEach(element => {
    animationObserver.observe(element); // Observa elementos para animação
});