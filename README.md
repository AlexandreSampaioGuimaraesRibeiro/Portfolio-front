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
- **Sobre** — resumo, formação e tecnologias com ícone. O currículo abre **dentro do site** (react-pdf), com troca de idioma (PT/EN), zoom e botão de baixar.
- **Projetos** — cartões com:
  - galeria de **prints** do projeto funcionando, com visualização ampliada (setas e `←` `→`);
  - descrição, tecnologias (ícone e cor de cada uma) e link para o código;
  - **tempo programado**: vem do WakaTime, de um badge do WakaTime ou, nos projetos antigos, aparece uma frase explicativa.
- **Habilidades** — carrossel com quatro painéis:
  - estatísticas de programação do **WakaTime** (grade com anéis, legenda em fatias e ranking em barras);
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

> Os atalhos não disparam enquanto a pessoa digita em um campo de texto, e `Y` e `X` ficam desativados com uma janela aberta.

## Tecnologias

| Categoria | Ferramentas |
|---|---|
| Base | React 19, Vite 8 |
| UI | Mantine 9, Tabler Icons, React Icons |
| PDF | react-pdf (pdf.js) |
| Integrações | EmailJS, WakaTime API, Supabase (API REST) |
| Qualidade | ESLint (react-hooks, react-refresh) |
| Deploy | Vercel |

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
# edite o .env com as chaves do EmailJS e do Supabase

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
```

> O Vite grava essas variáveis no site **na hora do build**: depois de criar ou mudar uma, é preciso refazer o deploy. Elas ficam visíveis no navegador, então use só a chave **publishable** do Supabase, **nunca** a `secret`.

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
> O perfil no WakaTime precisa estar com as estatísticas públicas, e só o período público do perfil funciona (os outros dão erro 400).

**Horas de cada projeto** (em `src/components/Projetos.jsx`): usa, nesta ordem, `horas` (número informado à mão), o projeto de mesmo nome (`wakatime`) nas estatísticas do WakaTime, a imagem do `badge` do WakaTime ou uma frase explicando que o projeto é anterior ao uso do WakaTime.

### Currículo

Os PDFs ficam em `public/curriculo/` e são listados em `src/config/curriculo.js` (arquivo e nome de download de cada idioma). O endereço dos arquivos começa em `/curriculo/`, sem `public`.

## Estrutura do projeto

```
Portfolio-front/
├── public/
│   ├── curriculo/          # Currículos em PDF (PT e EN)
│   └── img/                # Fotos de perfil, fundos, escudo e prints (uma pasta por projeto)
├── supabase/               # SQL dos comentários (tabela, regras e bloqueio de links)
├── src/
│   ├── components/         # Telas e componentes
│   │   ├── MenuPrincipal, SobreMim, Projetos, Habilidades, Comentarios, Contato
│   │   ├── TelaGame, BannerGame, Carrossel, Velocimetro, CenaCeu
│   │   ├── GloboHabilidades, WakaTimePainel
│   │   ├── CurriculoModal, VisualizadorCurriculo, PrintsProjeto
│   │   └── AlternarTema, AlternarIdioma, Tecnologia
│   ├── config/             # wakatime.js e curriculo.js
│   ├── data/               # Tecnologias, linguagens e habilidades do globo
│   ├── hooks/              # useWakaTime, useComentarios, useAtalhosJogo
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
| Currículos | `public/curriculo/` e `src/config/curriculo.js` |
| Usuário e período do WakaTime | `src/config/wakatime.js` |

## Deploy

O projeto está pronto para a **Vercel**:

1. Importe o repositório na Vercel (framework detectado: Vite).
2. Em **Settings → Environment Variables**, cadastre as variáveis `VITE_EMAILJS_*` e `VITE_SUPABASE_*`.
3. Faça o deploy — o `vercel.json` já configura o proxy do WakaTime. Se mudar variáveis depois, use *Redeploy* para refazer o build.

## Créditos e direitos de imagem

Os personagens, o escudo do clube, os fundos e as ilustrações usados nos temas pertencem aos seus respectivos detentores e aparecem aqui apenas de forma ilustrativa, em um portfólio pessoal sem fins lucrativos.

## Contato

- GitHub: [@AlexandreSampaioGuimaraesRibeiro](https://github.com/AlexandreSampaioGuimaraesRibeiro)
- LinkedIn: [Alexandre Sampaio Guimarães Ribeiro](https://linkedin.com/in/alexandre-sampaio-guimarães-ribeiro-417760410)
- E-mail: lexandre.guimaraes@gmail.com

---

*"Estudar. Praticar. Publicar."*