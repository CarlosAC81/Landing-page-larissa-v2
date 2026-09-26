# Landing Page — Larissa Menezes (versão aprimorada)

Nenhum texto, sentido de frase ou estrutura de conteúdo foi alterado nesta
rodada — só o visual, as animações e a experiência de navegação.

## O que mudou nesta rodada

1. **Títulos em destaque** — "Conheça meu trabalho", "Abordagem e
   atendimentos", "Experiências", "Antes de começar" e "Um primeiro passo"
   ficaram maiores, mais escuros e com um traço colorido ao lado, sem mudar o
   texto.
2. **Cards de "Abordagem e atendimentos"** — o parágrafo introdutório agora
   fica dentro de um card, no mesmo estilo dos demais. Ao passar o mouse, o
   card cresce suavemente, sobe sobre os outros elementos e ganha uma borda
   com brilho em degradê. (Implementação própria em CSS — a 21st.dev é focada
   em gerar componentes novos a partir do zero, não em animar componentes já
   existentes, então não se encaixava bem aqui sem reescrever a seção.)
3. **Menu flutuante** — agora com respiro do topo e das laterais, cantos mais
   arredondados e um botão de CTA com gradiente. No desktop, os links do menu
   ficam discretos e aparecem juntos, sincronizados, ao passar o mouse (ou
   navegar por teclado) sobre a barra.
4. **Fundo e brilho** — removi as formas ("manchas") do fundo; voltou a ser
   liso, na cor de cada seção. Em vez disso, um brilho diagonal bem discreto
   atravessa a tela a cada 7 segundos, durando ~1s.
5. **Transição em degradê** — como o site é uma página única (não tem
   páginas/rotas separadas, só seções na mesma página), a transição acontece
   como uma cortina suave em degradê ao carregar o site, e um leve "flash" a
   cada clique num link do menu — dá a sensação de passagem entre uma seção e
   outra sem cortes bruscos.
6. **Carrossel de "Experiências"** — a cada troca de depoimento (automática
   ou pelas setas), o card entra com uma leve rotação 3D, para parecer que o
   carrossel está girando de verdade, e não apenas trocando de texto.
7. **Mobile** — os itens do menu agora aparecem centralizados, em cascata e
   mais devagar. O botão "Agendar conversa" do menu mobile pisca, fica verde
   e volta ao normal quando o menu abre — e repete isso a cada clique. No
   desktop, os links aparecem juntos e sincronizados ao passar o mouse no
   menu.
8. **Botão do WhatsApp** — o intervalo do pulso passou de 30s para 10s.
9. **Swipe no mobile** — não existe uma seção "Resultados" neste site; a mais
   próxima disso são os cards de "Abordagem e atendimentos", então apliquei o
   gesto de arrastar ali: os dois cards agora deslizam horizontalmente com o
   dedo, como um carrossel. Também adicionei o mesmo gesto de arrastar ao
   carrossel de "Experiências" (além das setas). Nenhum dos dois interfere na
   rolagem vertical da página.

## Outras duas coisas pedidas

- **Imagem de compartilhamento** — troquei `og:image`/`twitter:image` para
  usar o print que você mandou (`og-image.jpg`), já recortado no formato
  ideal (1200×630) para aparecer bem no WhatsApp, Facebook, LinkedIn etc.
- **Favicon** — agora é um monograma "LM" em cursiva, azul-marinho, sobre um
  fundo suave da própria paleta (`Favicon.svg`). Um detalhe técnico: fontes
  cursivas em favicon dependem da fonte instalada no computador de quem
  acessa (favicons não carregam fontes da internet); coloquei uma lista
  ampla de fontes cursivas comuns, com um bom recuo elegante (itálico
  serifado) para quem não tiver nenhuma — mas o visual pode variar um pouco
  entre sistemas.

## Antes de publicar (itens que já valiam desde a primeira versão)

1. Suba os 9 arquivos deste zip para a raiz do repositório (substituindo os
   antigos).
2. Troque `SEU-DOMINIO.com.br` (em `index.html`, `robots.txt` e
   `sitemap.xml`) pelo domínio real do site.
3. Troque o número de WhatsApp e o usuário do Instagram em `App.jsx`
   (`WHATSAPP_URL` e `INSTAGRAM_URL`).
4. Preencha o CRP real e os depoimentos autorizados no carrossel de
   feedbacks.

## Stack

HTML + CSS + React 18 (via CDN) + Babel Standalone (JSX no navegador, sem
build) + GSAP/ScrollTrigger (entrada e rolagem). O restante das animações
desta rodada (hover dos cards, brilho, transição, menu, carrossel) é CSS
puro, sem novas dependências.
