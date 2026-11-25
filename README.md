# Portfólio — Alexandre Sampaio Guimarães Ribeiro

Portfólio pessoal com visual de **menu de videogame**: o visitante navega por "fases" (Sobre, Projetos, Habilidades, Comentários e Contato) usando o mouse ou atalhos de teclado, com **três temas** e textos em **português e inglês**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-9D7BFF?logo=vite&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-9-339AF0?logo=mantine&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-comentários-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)

---

## Funcionalidades

- **Menu principal estilo game** — navegação por telas, sem roteador, com banner de HUD ("nível", "fase") e a foto de perfil dentro de um disco que muda conforme o tema (velocímetro com escala de 0 a 240 km/h no tema noturno).
- **Três temas**, com a preferência salva no `localStorage`:
  - **Noturno** — tema de carros, com foto de fundo da cidade à noite, cores ciano e vermelho neon e vidro fosco nos cartões;
  - **Claro** — inspirado em Dragon Ball, com céu animado (nuvens e vento passando) e o personagem voando numa nuvem que sobe e desce;
  - **Galo** — preto, branco e amarelo dourado, com mural de fundo e o escudo no globo de habilidades.
- **Bilíngue (PT / EN)** — todos os textos ficam em `src/idioma/textos.js`; a preferência é salva no `localStorage`, e quem usa o navegador em português vê português por padrão.
- **Sobre** — resumo, formação e tecnologias com ícone. O currículo abre **dentro do site** (react-pdf), com troca de idioma (PT/EN), zoom e botão de baixar. A janela não pisca nem muda de tamanho ao carregar, e os dois idiomas já abertos ficam prontos para trocar na hora.
- **Carregamento temático** — enquanto o currículo abre, cada tema mostra a sua animação:
  - **Noturno:** um carro andando pela avenida, com a cidade passando atrás;
  - **Claro:** o personagem voando na nuvem, com nuvens e vento passando;
  - **Galo:** o escudo girando como uma moeda, com espessura, brilho e sombra no chão.

  Uma barra mostra o progresso (com a porcentagem, quando o tamanho do PDF é conhecido). Só `transform` e `opacity` são animados, para ficar fluido, e quem prefere menos movimento vê a cena parada.
- **Botão voltar do navegador e do celular** — cada tela tem um endereço (`/#/projetos`), então o voltar do navegador ou do celular funciona e dá para compartilhar o link de uma tela. Com uma janela aberta (currículo ou print ampliado), o voltar fecha a janela. O botão "Voltar" do site continua funcionando.
- **Projetos** — cartões com:
  - galeria de **prints** do projeto funcionando, com visualização ampliada (setas e `←` `→`);
  - descrição, tecnologias (ícone e cor de cada uma) e link para o código;
  - **tempo programado**: vem do WakaTime, de um badge do WakaTime ou, nos projetos antigos, aparece uma frase explicativa.

  Hoje: BeeWork (TCC), MeepleShelf, Breaking Bet, este portfólio, Pokedex e Sistema de Aluguel de Carros.
- **Habilidades** — carrossel com quatro painéis:
  - estatísticas de programação do **WakaTime** (grade com anéis, legenda em fatias e ranking em barras);
  - no topo da grade, o cartão **Codando agora**, que mostra em tempo real se estou programando (projeto, branch, linguagem, editor e duração da sessão) ou há quanto tempo parei;
  - **globo 3D interativo** de tecnologias, que gira sozinho e pode ser arrastado; cada ícone abre uma página sobre a tecnologia. No centro: uma roda de carro (noturno), a esfera de quatro estrelas (claro) ou o escudo girando como moeda (Galo).
- **Comentários** — os visitantes deixam nome e mensagem, que aparecem na hora. Guardados no **Supabase**, com limites de tamanho, bloqueio de links, intervalo entre envios e campo "isca" contra robôs.
- **Contato** — formulário com validação, campo "isca" anti‑spam e envio via **EmailJS** (mensagem para o dono + resposta automática, em português e inglês, para quem escreveu), além de links com ícones para e-mail, GitHub, LinkedIn e Instagram.
- **Acessibilidade** — rótulos para leitores de tela, foco visível, janelas com foco preso e `Esc` para fechar, e animações desligadas para quem prefere movimento reduzido.

### Atalhos de teclado

| Tecla | O que faz |
|---|---|
| `↑` `↓` | Navegar pelo menu principal |
| `Enter` / `X` | Confirmar (ou focar o primeiro item da tela) |
| `Y` | Voltar ao menu principal |
| `←` `→` | Trocar de painel no carrossel de Habilidades (e de print ampliado) |
| `N` / `D` / `G` | Tema Noturno / Claro (Dragon Ball) / Galo |
| `P` / `I` | Idioma Português / Inglês (também troca o idioma do currículo aberto) |
| `Esc` | Fechar o currículo ou o print ampliado |
| Voltar do navegador/celular | Volta ao menu (ou fecha a janela aberta) |

> Os atalhos não disparam enquanto a pessoa digita em um campo de texto, e `Y` e `X` ficam desativados com uma janela aberta.

## Tecnologias

| Categoria | Ferramentas |
|---|---|
| Base | React 19, Vite 8 |
| UI | Mantine 9, Tabler Icons, React Icons |
| PDF | react-pdf (pdf.js) |
| Integrações | EmailJS, WakaTime API (estatísticas públicas e heartbeats), Supabase (API REST) |
| Qualidade | ESLint (react-hooks, react-refresh) |
| Deploy | Vercel (site e a função serverless `/api/codando`) |

## Como rodar localmente

**Pré-requisito:** Node.js 20.19+ (ou 22.12+), exigido pelo Vite 8.

```bash
# 1. Clonar
git clone https://github.com/AlexandreSampaioGuimaraesRibeiro/Portfolio-front.git
cd Portfolio-front

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp env.example .env
# edite o .env com as chaves do EmailJS, do Supabase e o token do WakaTime

# 4. Subir o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`.

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Executa o ESLint |

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env` (já ignorado pelo Git) a partir do `env.example`:

```env
# EmailJS (formulário de contato)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_DONO=template_xxxxxxx      # e-mail que chega para você
VITE_EMAILJS_TEMPLATE_RESPOSTA=template_xxxxxxx  # resposta automática ao visitante
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

# Supabase (comentários)
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_KEY=sb_publishable_xxxxxxxxxxxxxxxx

# WakaTime "Codando agora" (só no servidor: SEM o prefixo VITE_)
WAKATIME_ACCESS_TOKEN=xxxxxxxxxxxxxxxx
```

> O Vite grava essas variáveis no site **na hora do build**: depois de criar ou mudar uma, é preciso refazer o deploy. As variáveis com `VITE_` ficam visíveis no navegador, então use só a chave **publishable** do Supabase, **nunca** a `secret`. O `WAKATIME_ACCESS_TOKEN` é a exceção, de propósito: ele **não** tem o prefixo `VITE_`, fica só no servidor e nunca chega ao navegador.

### EmailJS (contato)

O formulário usa o [EmailJS](https://www.emailjs.com/) com dois templates, que recebem as variáveis `{{nome}}`, `{{email}}` e `{{mensagem}}`: um para o e-mail que chega para você (com `Reply To: {{email}}`) e outro de resposta automática para quem escreveu (`To Email: {{email}}`).

### Comentários (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de `supabase/comentarios.sql`. Ele cria a tabela `comentarios` e as regras de segurança (RLS): quem visita só consegue **enviar** nome e mensagem e **ler** os comentários não escondidos.
3. Em *Project Settings → API*, copie a URL do projeto e a chave **publishable** para o `.env`.

Como funciona:

- Os comentários **aparecem na hora**. Para remover um, apague a linha em *Table Editor → comentarios*; para esconder sem apagar, mude `aprovado` para `false`.
- **Links, endereços de site e e-mails são bloqueados** no nome e no texto — no site (aviso ao visitante) e no banco (a regra vale mesmo para quem chamar a API direto).
- Limites: nome de até 60 caracteres e mensagem de 3 a 500; intervalo de 1 minuto entre comentários do mesmo navegador.
- O texto é sempre exibido como texto puro, nunca como HTML.

> No plano gratuito, o Supabase pausa projetos com pouca atividade. Para manter o banco ativo, dá para agendar uma consulta simples (por exemplo, com um workflow do GitHub Actions).

### WakaTime

Os dados do painel de habilidades (e as horas dos projetos) vêm da API pública do WakaTime. Ajuste o usuário e o período em `src/config/wakatime.js`:

```js
export const WAKATIME = {
  base: '/api/wakatime',
  usuario: 'SEU_ID_OU_USUARIO',
  intervalo: 'all_time', // o período público do seu perfil
}
```

Para evitar problemas de CORS, o site chama `/api/wakatime/stats/<intervalo>` e um proxy completa o endereço com `users/<usuario>`:

- **desenvolvimento:** um middleware no `vite.config.js`;
- **produção:** `rewrites` no `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/wakatime/:path*",
      "destination": "https://wakatime.com/api/v1/users/SEU_ID_OU_USUARIO/:path*"
    }
  ]
}
```

> O usuário aparece em três lugares: `config/wakatime.js`, `vite.config.js` e `vercel.json`. Ao trocá-lo, atualize os três.
>
> O `vite.config.js` também força o IPv4 primeiro e inclui os certificados do sistema, para redes e VPNs que inspecionam HTTPS (esse último passo vale a partir do Node 22.19 / 24.5; em versões antigas ele é ignorado).
>
> O perfil no WakaTime precisa estar com as estatísticas públicas, e só o período público do perfil funciona (os outros dão erro 400).

**Horas de cada projeto** (em `src/components/Projetos.jsx`): usa, nesta ordem, `horas` (número informado à mão), o projeto de mesmo nome (`wakatime`) nas estatísticas do WakaTime, a imagem do `badge` do WakaTime ou uma frase explicando que o projeto é anterior ao uso do WakaTime.

### Codando agora (WakaTime em tempo real)

No topo da grade do WakaTime, um cartão mostra se estou programando agora. Ele usa os **heartbeats** do dia, que exigem um token e por isso passam por uma rota própria no servidor, a `/api/codando`: o token nunca vai para o navegador.

1. Cadastre o token de acesso do WakaTime como `WAKATIME_ACCESS_TOKEN`: no `.env` (desenvolvimento) e, na Vercel, em *Settings → Environment Variables* como **Secret** (sem o prefixo `VITE_`). Depois, faça um novo deploy.
2. Em `api/_codando.js`, liste em `PROJETOS_PUBLICOS` os projetos cujo nome pode aparecer (use o nome que o WakaTime mostra no painel). Qualquer outro aparece como "projeto privado", sem nome nem branch.

Como funciona:

- **Codando agora** — o último sinal foi há até 10 minutos. O cartão mostra o projeto (ou "projeto privado"), a branch, a linguagem, o editor, a duração e o horário de início da sessão e o tempo de hoje no projeto.
- **Parado agora** — uma linha discreta com a última atividade e o total de hoje.
- Uma pausa maior que 15 minutos encerra a sessão. O "hoje" usa o fuso `America/Sao_Paulo`. Os limites ficam nas constantes do topo de `api/_codando.js`.
- A página consulta de minuto em minuto, só com a aba visível, e atualiza ao voltar para ela. Enquanto carrega, em caso de erro ou sem token, o cartão simplesmente não aparece.
- **Desenvolvimento:** o plugin `codandoLocal` do `vite.config.js` atende `/api/codando` (lendo o `.env`). **Produção:** a Vercel transforma `api/codando.js` na rota.

> A rota é pública: qualquer pessoa pode abri-la e ver se estou programando, a linguagem, o editor e os horários. Só o nome do projeto e a branch são protegidos pela lista `PROJETOS_PUBLICOS`.

### Currículo

Os PDFs ficam em `public/curriculo/` e são listados em `src/config/curriculo.js` (arquivo e nome de download de cada idioma). O endereço dos arquivos começa em `/curriculo/`, sem `public`.

O visualizador (react-pdf e pdf.js) é pesado e só é baixado na primeira vez que o currículo é aberto. Por isso o estilo fica dividido em dois arquivos:

- `CurriculoModal.css` — janela e layout base do visualizador, carregado junto com o site: assim o carregamento já aparece no lugar certo antes do visualizador chegar;
- `VisualizadorCurriculo.css` — botões, páginas e zoom, carregado só junto com o react-pdf.

## Estrutura do projeto

```
Portfolio-front/
├── public/
│   ├── curriculo/          # Currículos em PDF (PT e EN)
│   └── img/                # Fotos de perfil, fundos, escudo e prints (uma pasta por projeto)
├── api/                    # Funções da Vercel: rota /api/codando
│   ├── _codando.js         # Lógica do "Codando agora" (heartbeats, sessão, projetos públicos)
│   └── codando.js          # Rota da Vercel
├── supabase/               # SQL dos comentários (tabela, regras e bloqueio de links)
├── src/
│   ├── components/         # Telas e componentes (cada um com o seu .css ao lado)
│   │   ├── MenuPrincipal, SobreMim, Projetos, Habilidades, Comentarios, Contato
│   │   ├── TelaGame, BannerGame, Carrossel, Velocimetro, CenaCeu, CarregandoTema
│   │   ├── GloboHabilidades, WakaTimePainel, CodandoAgora
│   │   ├── CurriculoModal, VisualizadorCurriculo, PrintsProjeto
│   │   └── AlternarTema, AlternarIdioma, Tecnologia
│   ├── config/             # wakatime.js e curriculo.js
│   ├── data/               # Tecnologias, linguagens e habilidades do globo
│   ├── hooks/              # useWakaTime, useCodandoAgora, useComentarios, useAtalhosJogo, useRota, useVoltarFechaJanela
│   ├── idioma/             # Provider, contexto e textos PT/EN
│   ├── lib/                # Clientes e formatação (wakatime.js, comentarios.js)
│   ├── tema/               # Provider, contexto e variáveis dos temas (temas.css)
│   ├── App.jsx             # Alterna entre o menu e as telas
│   └── main.jsx
├── env.example
├── vercel.json             # Rewrite do proxy do WakaTime
└── vite.config.js          # Proxy do WakaTime em desenvolvimento
```

## Personalização rápida

| O que mudar | Onde |
|---|---|
| Textos (PT/EN), incluindo descrições dos projetos | `src/idioma/textos.js` |
| Projetos, links, horas e prints | `src/components/Projetos.jsx` |
| Prints dos projetos | `public/img/<projeto>/` (e a lista `prints` do projeto) |
| Tecnologias do globo | `src/data/habilidadesGlobo.js` |
| Ícones de tecnologias nas etiquetas | `src/data/tecnologias.js` |
| Links de contato | `src/components/Contato.jsx` |
| Cores, fontes e fundos dos temas | `src/tema/temas.css` |
| Estilo de cada tela/componente | `src/components/<Componente>.css` (ao lado do componente) |
| Currículos | `public/curriculo/` e `src/config/curriculo.js` |
| Usuário e período do WakaTime | `src/config/wakatime.js` (e o usuário também em `vite.config.js` e `vercel.json`) |
| Projetos que aparecem pelo nome no "Codando agora" | `PROJETOS_PUBLICOS` em `api/_codando.js` |
| Fuso e limites do "Codando agora" (ativo em 10 min, pausa de 15) | constantes no topo de `api/_codando.js` |

## Deploy

O projeto está pronto para a **Vercel**:

1. Importe o repositório na Vercel (framework detectado: Vite).
2. Em **Settings → Environment Variables**, cadastre as variáveis `VITE_EMAILJS_*` e `VITE_SUPABASE_*` e o `WAKATIME_ACCESS_TOKEN` (tipo **Secret**, sem o prefixo `VITE_`).
3. Faça o deploy — o `vercel.json` já configura o proxy do WakaTime. Se mudar variáveis depois, use *Redeploy* para refazer o build.

## Créditos e direitos de imagem

Os personagens, o escudo do clube, os fundos e as ilustrações usados nos temas pertencem aos seus respectivos detentores e aparecem aqui apenas de forma ilustrativa, em um portfólio pessoal sem fins lucrativos.

## Contato

- GitHub: [@AlexandreSampaioGuimaraesRibeiro](https://github.com/AlexandreSampaioGuimaraesRibeiro)
- LinkedIn: [Alexandre Sampaio Guimarães Ribeiro](https://linkedin.com/in/alexandre-sampaio-guimarães-ribeiro-417760410)
- E-mail: lexandre.guimaraes@gmail.com

---

*"Estudar. Praticar. Publicar."*