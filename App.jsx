/*
  Este arquivo contém toda a interface React da landing page.
  Ele funciona junto com index.html e styles.css, sem precisar de build.

  A foto do hero não fica mais embutida aqui: ela é lida de window.__HERO_IMAGE__,
  definida no index.html. Isso evita que o Babel (que roda no navegador) precise
  processar um texto gigante, deixando o carregamento bem mais rápido.

  As animações de entrada, os efeitos discretos de rolagem e os microinterações de
  hover usam GSAP + ScrollTrigger (carregados via CDN no index.html). A biblioteca
  respeita "prefers-reduced-motion": quem prefere mnos movimento não recebe as
  animações (veja o uso de gsap.matchMedia abaixo e o styles.css).
*/

const { useEffect, useLayoutEffect, useState, useRef } = React;

// Troque este número pelo WhatsApp real da profissional, usando o formato internacional.
const WHATSAPP_URL = "https://wa.me/5511985736871";

// Troque pelo endereço real do perfil do Instagram.
const INSTAGRAM_URL = "https://instagram.com/psico.larissamenezes";

// Ícone em SVG do WhatsApp, mantido no próprio React para não depender de bibliotecas externas.
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.91c0 2.1.55 4.15 1.6 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.71 1.45h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.23-6.17-3.46-8.41ZM12.08 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.86 9.86 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.9 7c0 5.45-4.44 9.89-9.91 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

// Ícone simples do Instagram em SVG para o rodapé.
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Pequena seta reutilizada nos botões e links.
function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

// Rótulo visual usado no início das seções.
function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>;
}

// Arte do hero: foto real da profissional, moldura arredondada e placa de identificação.
// A imagem é decorativa (o nome e a descrição já aparecem em texto ao lado), por isso
// o contêiner continua com aria-hidden e o <img> usa alt="" — isso é o correto para
// leitores de tela, não um esquecimento.
function HeroArtwork({ className, priority }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="hero-svg hero-photo-wrap">
        <img
          className="hero-photo"
          src={window.__HERO_IMAGE__}
          alt=""
          width="768"
          height="1024"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <div className="hero-sign"><span>Psicóloga | Psicanalista</span><strong>Larissa Menezes</strong></div>
    </div>
  );
}

function App() {
  // Controla a abertura do menu em telas pequenas.
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") { setMenuOpen(false); document.querySelector(".menu-button")?.focus(); }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  // Controla qual pergunta do FAQ está aberta.
  const [openFaq, setOpenFaq] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const cardsRef = useRef(null);
  // Guarda o sentido atual (1 = direita, -1 = esquerda) e as pausas por interação.
  const cardsAutoScrollRef = useRef({ direction: 1, paused: false, resumeTimer: null });
  const pauseCardsAutoScroll = () => {
    cardsAutoScrollRef.current.paused = true;
    window.clearTimeout(cardsAutoScrollRef.current.resumeTimer);
  };
  const scheduleCardsAutoScrollResume = () => {
    window.clearTimeout(cardsAutoScrollRef.current.resumeTimer);
    cardsAutoScrollRef.current.resumeTimer = window.setTimeout(() => {
      cardsAutoScrollRef.current.paused = false;
    }, 2600);
  };
  const scrollToCard = (index) => {
    const list = cardsRef.current;
    if (!list) return;
    pauseCardsAutoScroll();
    const next = Math.max(0, Math.min(3, index));
    const card = list.children[next];
    if (card) list.scrollTo({ left: Math.min(card.offsetLeft - list.children[0].offsetLeft, list.scrollWidth - list.clientWidth), behavior: "smooth" });
    setCardIndex(next);
    scheduleCardsAutoScrollResume();
  };
  const handleCardsScroll = () => {
    const list = cardsRef.current;
    if (!list || !list.children.length) return;
    const first = list.children[0];
    const gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;
    setCardIndex(Math.min(3, Math.round(list.scrollLeft / (first.getBoundingClientRect().width + gap))));
  };

  // Movimento contínuo em ambas as telas; retorna suavemente quando chega ao fim.
  // A posição é calculada pelo tempo decorrido para manter a velocidade constante.
  useEffect(() => {
    const list = cardsRef.current;
    if (!list) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const speed = 30; // pixels por segundo
    let rafId = null;
    let lastTime = null;
    const step = (time) => {
      if (lastTime !== null && !cardsAutoScrollRef.current.paused) {
        const max = list.scrollWidth - list.clientWidth;
        if (max > 1) {
          const state = cardsAutoScrollRef.current;
          const next = list.scrollLeft + Math.min(time - lastTime, 50) * speed / 1000 * state.direction;
          if (next >= max) { list.scrollLeft = max; state.direction = -1; }
          else if (next <= 0) { list.scrollLeft = 0; state.direction = 1; }
          else list.scrollLeft = next;
        }
      }
      lastTime = time;
      rafId = window.requestAnimationFrame(step);
    };

    const handleInteractionStart = () => pauseCardsAutoScroll();
    const handleInteractionEnd = () => scheduleCardsAutoScrollResume();

    list.addEventListener("touchstart", handleInteractionStart, { passive: true });
    list.addEventListener("touchend", handleInteractionEnd, { passive: true });
    list.addEventListener("pointerdown", handleInteractionStart);
    list.addEventListener("focusin", handleInteractionStart);
    list.addEventListener("focusout", handleInteractionEnd);
    list.addEventListener("mouseenter", handleInteractionStart);
    list.addEventListener("mouseleave", handleInteractionEnd);
    window.addEventListener("pointerup", handleInteractionEnd);
    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(cardsAutoScrollRef.current.resumeTimer);
      list.removeEventListener("touchstart", handleInteractionStart);
      list.removeEventListener("touchend", handleInteractionEnd);
      list.removeEventListener("pointerdown", handleInteractionStart);
      list.removeEventListener("focusin", handleInteractionStart);
      list.removeEventListener("focusout", handleInteractionEnd);
      list.removeEventListener("mouseenter", handleInteractionStart);
      list.removeEventListener("mouseleave", handleInteractionEnd);
      window.removeEventListener("pointerup", handleInteractionEnd);
    };
  }, []);

  // Texto usado na animação de digitação do CTA do hero.
  const [typedText, setTypedText] = useState("");
  const typingText = "me chama no WhatsApp";
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [feedbackPaused, setFeedbackPaused] = useState(false);
  const feedbacks = [
    { quote: "Eu não acreditava na terapia, mas depois de algumas sessões com Larissa, estou vivendo a melhor fase da minha vida.", author: "Mulher", detail: "67 anos" },
    { quote: "A Lari tem sido muito importante no meu processo de amadurecimento e autoconfiança pra tomar decisões.", author: "Mulher", detail: "17 anos" },
    { quote: "Através das sessões com a psicóloga Larissa, estou conseguindo me posicionar quando é preciso pela primeira vez da vida.", author: "Mulher", detail: "44 anos" },
    { quote: "A Larissa tem me ajudado muito a passar pelos desafios, me entender e entender a história da minha família.", author: "Homem", detail: "23 anos" }
  ];

  // Guarda o ponto onde o toque começou, para reconhecer um "swipe" horizontal
  // no carrossel de feedbacks sem atrapalhar a rolagem vertical da página.
  const touchStartRef = useRef(null);
  const handleFeedbackTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleFeedbackTouchEnd = (event) => {
    if (!touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) setFeedbackIndex((current) => (current + 1) % feedbacks.length);
      else setFeedbackIndex((current) => (current - 1 + feedbacks.length) % feedbacks.length);
    }
  };

  // Executa a digitação uma vez quando o componente entra na tela.
  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedText(typingText.slice(0, index));
      if (index === typingText.length) window.clearInterval(timer);
    }, 95);

    return () => window.clearInterval(timer);
  }, []);

  // Troca o feedback automaticamente; os controles manuais e o gesto de arrastar continuam disponíveis.
  useEffect(() => {
    if (feedbackPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setFeedbackIndex((current) => (current + 1) % feedbacks.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [feedbackPaused]);

  // Perguntas e respostas frequentes exibidas na seção de dúvidas.
  const faqItems = [
    { question: "Como funciona a primeira sessão?", answer: "A primeira sessão é um momento de conversa e acolhimento. Vamos entender o que trouxe você até aqui, conhecer suas expectativas e combinar juntos os próximos passos." },
    { question: "Quanto tempo dura o processo terapêutico?", answer: "Cada processo é único e não existe um tempo pré-determinado. A duração da terapia depende das necessidades e objetivos do paciente, enquanto acompanhando seus avanços ao longo do caminho." },
    { question: "A terapia online é para mim?", answer: "A psicoterapia online pode ser uma ótima opção para quem busca praticidade e conforto. As sessões acontecem por videochamada, em um ambiente reservado, onde você se sinta confortável para falar sobre o que precisar." },
    { question: "Como agendo um horário?", answer: "Para agendar sua primeira sessão, é só entrar em contato diretamente comigo pelo meu WhatsApp. Vamos conversar sobre sua disponibilidade e encontrar um horário que funcione para você." }
  ];

  // Fecha o menu mobile depois que a pessoa escolhe uma âncora, e dá um breve
  // "flash" de transição na troca, como uma passagem suave entre seções.
  const closeMenu = () => setMenuOpen(false);
  const flashPageTransition = () => {
    const el = document.getElementById("page-transition");
    if (!el) return;
    el.classList.remove("is-hidden");
    el.classList.add("is-flash");
    window.requestAnimationFrame(() => el.classList.add("is-flash-visible"));
    window.setTimeout(() => {
      el.classList.remove("is-flash-visible");
      window.setTimeout(() => { el.classList.remove("is-flash"); el.classList.add("is-hidden"); }, 400);
    }, 280);
  };
  const handleNavClick = () => { flashPageTransition(); };
  const handleMobileNavClick = () => { flashPageTransition(); closeMenu(); };

  // Recalcula as posições do ScrollTrigger quando o FAQ muda de altura (pergunta aberta/fechada).
  useEffect(() => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }, [openFaq]);

  // Assim que a página termina de montar, revela o conteúdo com uma transição
  // suave em degradê (a "cortina" inicial do site).
  useLayoutEffect(() => {
    const el = document.getElementById("page-transition");
    if (!el) return;
    const timer = window.setTimeout(() => el.classList.add("is-hidden"), 260);
    return () => window.clearTimeout(timer);
  }, []);

  // Configura as animações de entrada e de rolagem uma única vez, ao montar a página.
  // Tudo roda dentro de gsap.matchMedia, então quem tem "prefers-reduced-motion" ativado
  // simplesmente não recebe nenhuma das animações (o conteúdo já aparece no lugar certo).
  useLayoutEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Entrada suave do hero assim que a página carrega.
      gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
        .from(".hero-anim", { y: 26, opacity: 0, stagger: 0.12 })
        .from(".hero-visual, .hero-mobile-visual", { opacity: 0, scale: 0.97, duration: 1.1 }, "-=0.65");

      // Revelação discreta ao rolar a página: cada grupo de conteúdo sobe e aparece
      // suavemente quando entra na tela, uma única vez.
      document.querySelectorAll("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal]");
        if (!items.length) return;
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      // Efeito de paralaxe bem discreto na foto do hero durante a rolagem.
      gsap.to(".hero-photo", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });

      return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <div>
      <a className="skip-link" href="#top">Pular para o conteúdo</a>
      {/* Transição em degradê: cobre a tela ao carregar e some suavemente; também
          dá um leve "flash" a cada clique nos links do menu, como uma passagem
          elegante entre seções (o site é uma página única, sem rotas separadas). */}
      <div id="page-transition" className="page-transition" aria-hidden="true" />

      {/* Cabeçalho semântico para navegação e SEO. */}
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#top" aria-label="Larissa Menezes, voltar ao início" onClick={handleNavClick}>Larissa <span>Menezes</span></a>

          <nav className="main-nav" aria-label="Navegação principal">
            <a href="#sobre" onClick={handleNavClick}>Sobre mim</a>
            <a href="#atendimento" onClick={handleNavClick}>Abordagem e atendimentos</a>
            <a href="#feedbacks" onClick={handleNavClick}>Feedbacks</a>
            <a href="#duvidas" onClick={handleNavClick}>Dúvidas</a>
          </nav>

          <a className="header-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Agendar conversa ↗</a>

          <button className="menu-button" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Navegação mobile">
            <a href="#sobre" onClick={handleMobileNavClick}>Sobre mim</a>
            <a href="#atendimento" onClick={handleMobileNavClick}>Abordagem e atendimentos</a>
            <a href="#feedbacks" onClick={handleMobileNavClick}>Feedbacks</a>
            <a href="#duvidas" onClick={handleMobileNavClick}>Dúvidas</a>
            <a className="mobile-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Agendar conversa</a>
          </nav>
        )}
      </header>

      <main id="top" tabIndex="-1">
        {/* Hero usando a foto real enviada pela profissional. */}
        <section className="hero" aria-labelledby="hero-title">
          {/* Desktop: a arte fica menor e separada da coluna de texto. */}
          <HeroArtwork className="hero-visual" priority />

          <div className="container">
            <div className="hero-content">
              <p className="eyebrow hero-anim">✦ Psicologia Clínica & Psicanálise</p>
              <h1 id="hero-title" className="hero-anim">Um espaço para <em>você</em> se escutar.</h1>
              {/* Mobile: a foto aparece logo depois do título e antes da descrição. */}
              <HeroArtwork className="hero-mobile-visual" priority />
              <p className="hero-description hero-anim">Psicoterapia é um encontro cuidadoso com a sua história. É acreditar que é possível construir novos caminhos, com leveza e sentido.</p>

              <div className="hero-actions hero-anim">
                <a className="primary-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Quero começar <ArrowIcon /></a>
                <a className="whatsapp-type" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><WhatsAppIcon size={17} /><span>{typedText}</span><span className="type-cursor" aria-hidden="true" /></a>
              </div>

              <p className="hero-note hero-anim">◉ Atendimento ético, sigiloso e acolhedor</p>
            </div>
          </div>
        </section>

        {/* Seção de apresentação (o vídeo foi removido a pedido). */}
        <section id="sobre" className="section section-video" aria-labelledby="sobre-title" data-reveal-group>
          <div className="container">
            <div className="video-heading" data-reveal>
              <SectionLabel>Conheça meu trabalho</SectionLabel>
              <h2 id="sobre-title">Um pouco sobre este <em>espaço.</em></h2>
            </div>

            <div className="section-copy about-copy" data-reveal>
              <p>Olá, eu sou Larissa. Psicóloga formada pela Universidade Presbiteriana Mackenzie e especializada em Psicanálise pelo Núcleo Brasileiro de Psicanálise. Acredito que olhar para dentro é permitir-se transformar a forma como vivemos.</p>
              <p>Meu trabalho é oferecer um lugar seguro, sem julgamentos e com escuta genuína, para que você possa compreender seus padrões, elaborar o que passou e aprender formas saudáveis de lidar com seus sentimentos.</p>
              <p className="professional-note"><strong>CRP 06/220176</strong> · Psicóloga Clínica</p>
            </div>
          </div>
        </section>

        {/* Abordagem e atendimento agora formam uma única seção. */}
        <section id="atendimento" className="section section-blue" aria-labelledby="atendimento-title" data-reveal-group>
          <div className="container approach-layout">
            <div data-reveal><SectionLabel>Abordagem e atendimentos</SectionLabel><h2 id="atendimento-title">Profissionalismo com <em>acolhimento</em>. Técnica com <em>humanidade</em>.</h2></div>
            <div className="section-copy">
              <div id="cards-atendimento" className="cards" ref={cardsRef} onScroll={handleCardsScroll} role="region" aria-roledescription="carrossel" aria-label="Abordagem e atendimentos" tabIndex="0">
                <article className="card intro-card" data-reveal><span className="card-number">01</span><h3>Abordagem Psicanalítica</h3><p>A abordagem psicanalítica é um espaço de escuta e reflexão. Juntos, vamos olhar para pensamentos, emoções e experiências para compreender os sentidos por trás do que você vive e construir novas formas de se relacionar consigo e com a sua história.</p></article>
                <article className="card" data-reveal><span className="card-number">02</span><h3>Escuta sem pressa</h3><p>Um espaço para você chegar como está, com respeito à sua singularidade.</p></article>
                <article className="card accent" data-reveal><span className="card-number">03</span><h3>Construção conjunta</h3><p>Perceber padrões, nomear conflitos e investigar suas dúvidas com gentileza.</p></article>
                <article className="card online-card" data-reveal><span className="card-number">04</span><h3>Terapia online</h3><p>Sessões exclusivamente online, com conforto, privacidade e flexibilidade para cuidar de si onde estiver.</p></article>
              </div>
              <div className="card-controls" role="group" aria-label="Controles dos atendimentos">
                <button type="button" aria-label="Card anterior" disabled={cardIndex === 0} onClick={() => scrollToCard(cardIndex - 1)}>←</button>
                <span>{String(cardIndex + 1).padStart(2, "0")} / 04</span>
                <button type="button" aria-label="Próximo card" disabled={cardIndex === 3} onClick={() => scrollToCard(cardIndex + 1)}>→</button>
              </div>
            </div>
          </div>
        </section>

        {/* Feedbacks editáveis em carrossel; substitua os textos pelos depoimentos autorizados. */}
        <section id="feedbacks" className="section feedback-section" aria-labelledby="feedbacks-title" data-reveal-group>
          <div className="container feedback-layout">
            <div data-reveal><SectionLabel>Experiências</SectionLabel><h2 id="feedbacks-title">Palavras que <em>aquecem.</em></h2></div>
            <div className="feedback-carousel" data-reveal role="region" aria-roledescription="carrossel" aria-label="Feedbacks de pacientes" onMouseEnter={() => setFeedbackPaused(true)} onMouseLeave={() => setFeedbackPaused(false)} onFocusCapture={() => setFeedbackPaused(true)} onBlurCapture={() => setFeedbackPaused(false)}>
              <article
                className="feedback-card"
                key={feedbackIndex}
                aria-live="off"
                onTouchStart={handleFeedbackTouchStart}
                onTouchEnd={handleFeedbackTouchEnd}
              >
                <span className="feedback-quote" aria-hidden="true">“</span>
                <p>“{feedbacks[feedbackIndex].quote}”</p>
                <strong>{feedbacks[feedbackIndex].author}</strong>
                <small>{feedbacks[feedbackIndex].detail}</small>
              </article>
              <div className="feedback-controls">
                <button type="button" aria-label="Feedback anterior" onClick={() => setFeedbackIndex((feedbackIndex - 1 + feedbacks.length) % feedbacks.length)}>←</button>
                <span>{String(feedbackIndex + 1).padStart(2, "0")} / {String(feedbacks.length).padStart(2, "0")}</span>
                <button type="button" aria-label="Próximo feedback" onClick={() => setFeedbackIndex((feedbackIndex + 1) % feedbacks.length)}>→</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ interativo para responder dúvidas comuns antes do contato. */}
        <section id="duvidas" className="section section-yellow" aria-labelledby="duvidas-title" data-reveal-group>
          <div className="container section-grid">
            <div data-reveal><SectionLabel>Antes de começar</SectionLabel><h2 id="duvidas-title">Dúvidas <em>comuns.</em></h2></div>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div className="faq-item" key={item.question} data-reveal>
                  <h3 className="faq-heading"><button className="faq-question" type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{item.question}<span aria-hidden="true">{openFaq === index ? "−" : "+"}</span></button></h3>
                  <div id={`faq-answer-${index}`} hidden={openFaq !== index}><p className="faq-answer">{item.answer}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final para aumentar as chances de contato. */}
        <section className="section section-dark" aria-labelledby="cta-title" data-reveal-group>
          <div className="container closing-layout">
            <div className="closing-heading" data-reveal>
              <SectionLabel>Um primeiro passo</SectionLabel>
              <h2 id="cta-title">Você não precisa ter todas as respostas para <em>começar.</em></h2>
            </div>
            <figure className="closing-photo" data-reveal><img src="larissa-convite.jpeg" alt="Larissa Menezes sorrindo, sentada à mesa" width="768" height="1024" loading="lazy" decoding="async" /></figure>
            <div className="closing-copy section-copy" data-reveal><p>Vamos conversar sobre o que você está vivendo e descobrir se este espaço pode fazer sentido para você.</p><a className="primary-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Agendar uma conversa <ArrowIcon /></a></div>
          </div>
        </section>
      </main>

      {/* Botão flutuante sempre disponível para abrir o WhatsApp. */}
      <a className="floating-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Falar com Larissa pelo WhatsApp"><WhatsAppIcon size={28} /></a>

      {/* Rodapé com Instagram editável. */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <strong className="logo">Larissa <span>Menezes</span></strong>
          <a className="instagram-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram da psicóloga"><InstagramIcon size={20} /><span>@psico.larissamenezes</span></a>
          <span>© 2026 · Psicologia Clínica</span>
        </div>
      </footer>
    </div>
  );
}

// Monta o componente principal no elemento #root definido no HTML.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
