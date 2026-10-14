# Portfólio — Alexandre Sampaio Guimarães Ribeiro

Portfólio pessoal com visual de **menu de videogame**: o visitante navega por "fases" (Sobre, Projetos, Habilidades e Contato) usando o mouse ou atalhos de teclado, com tema claro/noturno e textos em português e inglês.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-9D7BFF?logo=vite&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-9-339AF0?logo=mantine&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)

---

## Funcionalidades

- **Menu principal estilo game** — navegação por telas, sem roteador, com banner, "nível", "fase" e velocímetro em SVG contornando a foto no tema noturno.
- **Atalhos de teclado**
  - `Enter` / `X` — confirmar (ou focar o primeiro item da tela)
  - `Y` — voltar ao menu principal
  - `←` `→` — navegar entre os painéis do carrossel
- **Tema claro e noturno** — preferência salva no `localStorage`.
- **Bilíngue (PT / EN)** — todos os textos centralizados em `src/idioma/textos.js`; preferência salva no `localStorage`.
- **Projetos** — cartões com descrição, tecnologias (ícone e cor de cada uma) e link opcional para o código.
- **Habilidades** — carrossel com quatro painéis:
  - estatísticas de programação do **WakaTime** (grade, legenda em fatias e ranking em barras);
  - **globo 3D interativo** de tecnologias, que gira sozinho e pode ser arrastado.
- **Contato** — formulário com validação, campo "isca" anti‑spam e envio via **EmailJS** (mensagem para o dono + resposta automática para quem escreveu).
- **Currículo** em PDF (português e inglês) em `public/curriculo/`.

## Tecnologias

| Categoria | Ferramentas |
|---|---|
| Base | React 19, Vite 8 |
| UI | Mantine 9, Tabler Icons, React Icons |
| Integrações | EmailJS, WakaTime API |
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
# edite o .env com suas chaves do EmailJS

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

### Variáveis de ambiente (EmailJS)

O formulário de contato usa o [EmailJS](https://www.emailjs.com/). Crie um arquivo `.env` (já ignorado pelo Git) a partir do `env.example`:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_DONO=template_xxxxxxx      # e-mail que chega para você
VITE_EMAILJS_TEMPLATE_RESPOSTA=template_xxxxxxx  # resposta automática ao visitante
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

Os templates recebem as variáveis `{{nome}}`, `{{email}}` e `{{mensagem}}`.

> Na Vercel, cadastre as mesmas variáveis em **Settings → Environment Variables**.

### WakaTime

Os dados do painel de habilidades vêm da API pública do WakaTime. Ajuste o usuário e o período em `src/config/wakatime.js`:

```js
export const WAKATIME = {
  base: '/wakatime-api',
  usuario: 'SEU_ID_OU_@USUARIO',
  intervalo: 'all_time', // last_7_days, last_30_days, last_6_months, last_year...
}
```

Para evitar problemas de CORS, as chamadas passam por um proxy em `/wakatime-api`:

- **desenvolvimento:** `server.proxy` no `vite.config.js`;
- **produção:** `rewrites` no `vercel.json`.

> O perfil no WakaTime precisa estar com as estatísticas públicas. Se o período escolhido não estiver liberado, o app tenta `last_year` e depois o padrão.

## Estrutura do projeto

```
Portfolio-front/
├── public/
│   ├── curriculo/          # Currículos em PDF (PT e EN)
│   └── img/                # Fotos de perfil e fundo
├── src/
│   ├── components/         # Telas e componentes (MenuPrincipal, SobreMim, Projetos,
│   │                       # Habilidades, Contato, Carrossel, GloboHabilidades, ...)
│   ├── config/             # Configuração do WakaTime
│   ├── data/               # Listas de tecnologias, linguagens e habilidades do globo
│   ├── hooks/              # useWakaTime, useAtalhosJogo
│   ├── idioma/             # Provider, contexto e textos PT/EN
│   ├── lib/                # Cliente e formatação dos dados do WakaTime
│   ├── tema/               # Provider, contexto e variáveis de tema
│   ├── App.jsx             # Alterna entre o menu e as telas
│   └── main.jsx
├── env.example
├── vercel.json             # Rewrite do proxy do WakaTime
└── vite.config.js          # Proxy do WakaTime em dev
```

## Personalização rápida

| O que mudar | Onde |
|---|---|
| Textos (PT/EN) | `src/idioma/textos.js` |
| Projetos e links de repositório | `src/components/Projetos.jsx` (descrições em `textos.js`) |
| Tecnologias do globo | `src/data/habilidadesGlobo.js` |
| Ícones extras de tecnologias | `src/data/tecnologias.js` |
| Links de contato | `src/components/Contato.jsx` |
| Cores dos temas | `src/tema/temas.css` |
| Currículos | `public/curriculo/` |

## Deploy

O projeto está pronto para a **Vercel**:

1. Importe o repositório na Vercel (framework detectado: Vite).
2. Cadastre as variáveis `VITE_EMAILJS_*`.
3. Faça o deploy — o `vercel.json` já configura o proxy do WakaTime.

## Contato

- GitHub: [@AlexandreSampaioGuimaraesRibeiro](https://github.com/AlexandreSampaioGuimaraesRibeiro)
- LinkedIn: [Alexandre Sampaio Guimarães Ribeiro](https://linkedin.com/in/alexandre-sampaio-guimarães-ribeiro-417760410)
- E-mail: lexandre.guimaraes@gmail.com

---

*"Estudar. Praticar. Publicar."*
