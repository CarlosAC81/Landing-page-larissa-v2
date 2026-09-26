# Landing Page — Larissa Menezes (versão aprimorada)

Este repositório é uma versão aprimorada do site original, mantendo a mesma identidade
visual, conteúdo e estrutura, sem nenhum passo de build (continua React + Babel via CDN,
igual ao projeto original — só que mais rápido e com animações).

## O que mudou

**Animações**
- Entrada suave dos elementos do hero ao carregar a página.
- Revelação discreta ao rolar (fade + leve deslocamento) em cada seção.
- Paralaxe bem sutil na foto do hero durante a rolagem.
- Microinterações de hover em botões, cards, nav, FAQ e ícones — sem exagero.
- Tudo feito com **GSAP + ScrollTrigger** (via CDN, `cdn.jsdelivr.net/npm/gsap@3.13`),
  que é a biblioteca de animação mais usada hoje para sites sem processo de build,
  leve e com ótima performance.
- Quem usa "reduzir movimento" no sistema não recebe nenhuma animação decorativa
  (`prefers-reduced-motion` respeitado tanto em CSS quanto no JS via `gsap.matchMedia`).

**Performance**
- A foto do hero (a mesma imagem original, pixel a pixel — só que agora como um arquivo
  `hero-larissa.jpg` de verdade, e não mais como texto em base64 embutido no código) foi
  retirada de dentro do `App.jsx`. Isso tirou cerca de 280 KB de texto que o Babel
  precisava processar no navegador a cada carregamento, e agora o navegador consegue
  carregar a foto em paralelo e guardá-la em cache normalmente.
- **Importante:** suba o arquivo `hero-larissa.jpg` (compartilhado nesta conversa) para a
  **raiz deste repositório** (mesmo nível do `index.html`) usando "Add file → Upload files"
  no GitHub — sem isso a foto do hero não aparece.
- React, ReactDOM, Babel e GSAP agora carregam com `defer`, sem bloquear a leitura
  do HTML.
- A foto tem `width`/`height` definidos (evita "pulos" de layout) e `fetchpriority="high"`
  na versão visível, para melhorar o carregamento da imagem principal.

**SEO técnico**
- `<link rel="canonical">` (troque `SEU-DOMINIO.com.br` pelo domínio final).
- `<meta name="robots" content="index, follow">`.
- Open Graph e Twitter Card completos (`og:url`, `twitter:card`, etc.) e `og:image`
  corrigido para apontar para a foto real do site.
- Dados estruturados (JSON-LD, schema.org `ProfessionalService`) para ajudar buscadores
  a entender quem é a profissional.
- `robots.txt` e `sitemap.xml` novos.
- Hierarquia de títulos (h1 → h2 → h3), texto alternativo e links internos da versão
  original já estavam corretos e foram mantidos como estavam.

## Antes de publicar

1. Suba `hero-larissa.jpg` para a raiz do repositório (veja "Performance" acima) — sem
   isso a foto do hero não aparece.
2. Troque `SEU-DOMINIO.com.br` (em `index.html`, `robots.txt` e `sitemap.xml`) pelo
   domínio real do site.
3. Troque o número de WhatsApp e o usuário do Instagram em `App.jsx` (mesmos pontos
   do projeto original — `WHATSAPP_URL` e `INSTAGRAM_URL`).
4. Preencha o CRP real na seção "Sobre" e os depoimentos autorizados no carrossel de
   feedbacks.

## Stack

HTML + CSS + React 18 (via CDN) + Babel Standalone (transforma o JSX no navegador,
sem etapa de build) + GSAP/ScrollTrigger (animações). Igual ao projeto original, com
a adição apenas da biblioteca de animação.
