# 🎬 DramaLuxe

> Central pessoal de Dramas Asiáticos — C-Drama, K-Drama, J-Drama, Thai-Drama  
> Desenvolvido por **Saieso Seraos** · Em homenagem a Eliene, Lorhuan e Oliver LBS

---

## 🚀 Deploy no GitHub Pages (passo a passo)

### 1. Criar repositório
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Nome: `dramaluxe` (ou qualquer nome)
4. Marque como **Public**
5. Clique em **"Create repository"**

### 2. Fazer upload dos arquivos
Estrutura correta dos arquivos:
```
dramaluxe/
├── index.html
├── sw.js
├── assets/
│   └── style.css
└── js/
    ├── catalog.js
    ├── player.js
    ├── ui.js
    └── app.js
```

No repositório, clique em **"Add file"** → **"Upload files"** e envie todos.

### 3. Ativar GitHub Pages
1. Vá em **Settings** → **Pages**
2. Em "Source", selecione **"Deploy from a branch"**
3. Branch: **main** | Folder: **/ (root)**
4. Clique em **Save**
5. Em 1-2 minutos seu site estará em: `https://SEU-USUARIO.github.io/dramaluxe`

---

## 📱 Instalar como App no Celular

### Android (Chrome)
1. Abra o link do GitHub Pages no Chrome
2. Toque nos **3 pontinhos** → **"Adicionar à tela inicial"**
3. O app aparecerá igual a um app nativo

### iPhone (Safari)
1. Abra no Safari
2. Toque no ícone de **compartilhar** (quadrado com seta)
3. Selecione **"Adicionar à Tela de Início"**

---

## 📂 Estrutura dos Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Casca do app (HTML + estrutura) |
| `sw.js` | Service Worker (modo offline, cache) |
| `assets/style.css` | Todos os estilos visuais |
| `js/catalog.js` | **Todo o catálogo** — séries e filmes |
| `js/player.js` | Player multi-plataforma (YouTube, OK.ru, Dailymotion, Bilibili) |
| `js/ui.js` | Componentes visuais (cards, tela de detalhe, carrosséis) |
| `js/app.js` | Lógica principal (histórico, favoritos, avaliações, progresso, filtros) |

---

## ➕ Como Adicionar Novos Conteúdos

Edite apenas o arquivo `js/catalog.js`.

### Adicionar uma Série (YouTube)
```js
{
  key: 'nome-unico-sem-espacos',       // ID interno único
  title: 'Título em Português',
  titleOriginal: 'Original / 中文',
  region: 'c-drama',                   // c-drama | k-drama | j-drama | thai-drama
  genre: 'romance',                    // romance | fantasy | drama | comedy | action
  year: 2024,
  cast: 'Ator 1, Ator 2',
  rating: '8.5',
  featured: false,                     // true = aparece no carrossel hero
  desc: 'Sinopse do drama aqui...',
  episodes: ['ID_YT_EP1', 'ID_YT_EP2', 'ID_YT_EP3'],
},
```

### Adicionar uma Série (OK.ru)
```js
episodes: [
  { platform: 'okru', id: '10303827675778' },
  { platform: 'okru', id: '10303827806850' },
],
```

### Adicionar uma Série (Dailymotion)
```js
episodes: [
  { platform: 'dailymotion', id: 'x8abc12' },
],
```

### Adicionar uma Série (Bilibili)
```js
episodes: [
  { platform: 'bilibili', id: 'BV1xx411c7mD' },
],
```

### Adicionar um Filme (YouTube)
```js
{
  platform: 'youtube', id: 'ID_DO_VIDEO_YT',
  title: 'Título em Português',
  region: 'k-drama',
  genre: 'romance',
  year: 2024,
  cast: 'Ator 1, Ator 2',
  rating: '8.0',
  desc: 'Sinopse...',
},
```

### Adicionar ao carrossel Hero
Na array `featured` do catalog.js, adicione o `key` da série:
```js
featured: ['so-por-amor', 'love-in-time', 'SUA-NOVA-SERIE'],
```

---

## 🌐 Onde Encontrar IDs de Vídeos

### YouTube
URL: `https://youtube.com/watch?v=`**`ESTE_É_O_ID`**

### OK.ru
URL: `https://ok.ru/video/`**`10303827675778`** ← este é o ID

### Dailymotion
URL: `https://dailymotion.com/video/`**`x8abc12`** ← este é o ID

### Bilibili
URL: `https://bilibili.com/video/`**`BV1xx411c7mD`** ← este é o ID (começa com BV)

---

## 🔍 Canais recomendados para encontrar conteúdo PT-BR

| Canal / Site | Plataforma | Tipo |
|---|---|---|
| WeTV Portuguese | YouTube | C-Drama legendado |
| YoYo Teatro Portuguesa | YouTube | C-Drama legendado |
| iQIYI Portuguese | YouTube | C-Drama dublado |
| MBC Drama (YT oficial) | YouTube | K-Drama legendado |
| SBS Drama (YT oficial) | YouTube | K-Drama legendado |
| Canais de fã PT-BR | YouTube / OK.ru | Vários dramas |
| Bilibili (seção PT) | Bilibili | C-Drama oficial |

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 📺 Multi-plataforma | YouTube, OK.ru, Dailymotion, Bilibili, Vimeo |
| ❤️ Favoritos | Salvar títulos com coração |
| ⭐ Avaliação | Dar de 1 a 5 estrelas |
| ▶ Continue Assistindo | Retoma do último episódio |
| 📜 Histórico | Últimos 80 conteúdos vistos |
| 🔍 Busca | Por título, ator, sinopse |
| 🎯 Filtros | Por região, tipo e gênero |
| 🌐 Hero Carousel | 5 títulos em destaque com rotação |
| 📱 PWA | Instalável como app no celular |
| 💾 Offline | Funciona sem internet (após cache) |
| 🔲 Tela cheia | Botão fullscreen no player |

---

## 📄 Licença

Projeto pessoal — todos os conteúdos de vídeo pertencem aos seus respectivos canais e plataformas.
