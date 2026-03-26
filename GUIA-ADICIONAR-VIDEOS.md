# 📖 DramaLuxe — Guia: Como Adicionar Vídeos

---

## ✅ Resposta rápida: funciona online?

**Sim — com limitação.** O Netlify serve arquivos estáticos. Quando você edita o `catalog.js` diretamente no GitHub e faz deploy, o site atualiza automaticamente em segundos. **Não precisa baixar nada.**

---

## 🌐 Como editar diretamente no site (GitHub + Netlify)

### Passo 1 — Conectar seu site ao GitHub

1. Acesse [netlify.com](https://netlify.com) → seu site → **Site configuration → Build & deploy**
2. Clique em **"Link repository"** → escolha **GitHub**
3. Autorize e selecione o repositório `dramaluxe`
4. Branch: `main` · Publish directory: `.` (ponto)
5. Clique em **Save**

A partir daí, **toda vez que você editar um arquivo no GitHub, o Netlify faz deploy automaticamente em 30 segundos.**

---

### Passo 2 — Editar o catálogo direto no GitHub

1. Acesse seu repositório no GitHub
2. Clique no arquivo **`js/catalog.js`**
3. Clique no ícone de **lápis (✏️ Edit)** no canto superior direito
4. Adicione o novo conteúdo (veja os exemplos abaixo)
5. Clique em **"Commit changes"** → **"Commit directly to main"** → **Commit**
6. Aguarde ~30 segundos → site atualizado automaticamente

---

## ➕ Como adicionar um FILME

Abra o `catalog.js` e localize a seção `movies: [`.  
Adicione um novo item **dentro dos colchetes**, separado por vírgula:

```js
{
  platform: 'youtube',
  id: 'ID_DO_VIDEO_AQUI',
  audio: 'dubbed',          // 'dubbed' = dublado PT-BR | 'subbed' = legendado PT-BR
  title: 'Título em Português',
  region: 'c-drama',        // c-drama | k-drama | j-drama | thai-drama
  genre: 'romance',         // romance | fantasy | drama | comedy | action
  year: 2024,
  cast: 'Nome dos Atores',
  rating: '8.5',
  desc: 'Sinopse do filme aqui...',
},
```

---

## ➕ Como adicionar uma SÉRIE (YouTube)

Adicione dentro de `series: [`:

```js
{
  key: 'nome-unico-da-serie',     // ID interno único, sem espaços
  title: 'Título em Português',
  titleOriginal: 'Original / 原名',
  region: 'k-drama',
  genre: 'romance',
  audio: 'dubbed',
  year: 2024,
  cast: 'Ator 1, Ator 2',
  rating: '8.0',
  featured: false,                 // true = aparece no carrossel hero da home
  desc: 'Sinopse da série...',
  episodes: [
    'ID_EP1', 'ID_EP2', 'ID_EP3', 'ID_EP4'
  ],
},
```

---

## ➕ Como adicionar uma SÉRIE (OK.ru)

```js
{
  key: 'nome-da-serie',
  title: 'Título',
  region: 'k-drama',
  genre: 'action',
  audio: 'subbed',
  year: 2025,
  cast: 'Atores',
  rating: '8.0',
  desc: 'Sinopse...',
  thumb: 'https://img.youtube.com/vi/ID_YT_QUALQUER/maxresdefault.jpg',
  episodes: [
    { platform: 'okru', id: 'ID_DO_VIDEO_OKRU' },
    { platform: 'okru', id: 'ID_DO_EPISODIO_2' },
  ],
},
```

---

## 🔗 Onde encontrar os IDs dos vídeos

### 🔴 YouTube
**Link do site:**  
`https://www.youtube.com/watch?v=`**`ESTE_É_O_ID`**

Exemplo: `https://www.youtube.com/watch?v=nbsUjQtY05g` → ID é **`nbsUjQtY05g`**

**Onde buscar conteúdo PT-BR gratuito:**

| Canal / Site | Link | Tipo |
|---|---|---|
| YoYo Teatro Portuguesa | [youtube.com/@YoYoPortuguese](https://www.youtube.com/@YoYoPortuguese) | C-Drama legendado PT-BR |
| WeTV Portuguese | [youtube.com/@WeTVPortuguese](https://www.youtube.com/@WeTVPortuguese) | C-Drama e K-Drama |
| iQIYI Portuguese | [youtube.com/@iQIYIPortuguese](https://www.youtube.com/@iQIYIPortuguese) | C-Drama dublado PT-BR |
| MBC Drama (oficial) | [youtube.com/@MBCdrama](https://www.youtube.com/@MBCdrama) | K-Drama legendado EN |
| SBS Drama (oficial) | [youtube.com/@SBSdrama](https://www.youtube.com/@SBSdrama) | K-Drama legendado EN |
| Mango TV Portuguese | [youtube.com/@MangoTVPortuguese](https://www.youtube.com/@MangoTVPortuguese) | C-Drama legendado PT-BR |
| GMA Network | [youtube.com/@GMANetwork](https://www.youtube.com/@GMANetwork) | Filmes asiáticos |

---

### 🟠 OK.ru (Odnoklassniki)
**Link do site:**  
`https://ok.ru/video/`**`10303827675778`** ← esse número é o ID

Como achar: pesquise no site [ok.ru](https://ok.ru) o nome do drama + "legendado" ou "PT". O ID aparece no final da URL.

**Site:** [ok.ru](https://ok.ru)  
**Busca sugerida:** `kdrama legendado português` · `drama chinês dublado` · `thai drama PT`

---

### 🔵 Dailymotion
**Link do site:**  
`https://www.dailymotion.com/video/`**`x8abc12`** ← esse código é o ID

**Site:** [dailymotion.com](https://www.dailymotion.com)  
**Busca sugerida:** `dorama dublado` · `cdrama legendado portugues`

---

### 🟣 Bilibili
**Link do site:**  
`https://www.bilibili.com/video/`**`BV1xx411c7mD`** ← começa com BV

```js
{ platform: 'bilibili', id: 'BV1xx411c7mD' }
```

**Site:** [bilibili.tv](https://www.bilibili.tv) (versão internacional)  
**Busca sugerida:** C-Dramas oficiais com legenda EN

---

## 🎯 Adicionando ao carrossel Hero (destaques da home)

Para que uma série apareça em destaque no carrossel da home, adicione o `key` dela no array `featured` no final do `catalog.js`:

```js
featured: [
  'so-por-amor',
  'love-in-time',
  'sua-nova-serie-aqui',   // ← adicione aqui
],
```

---

## 🔎 Verificar se o embed funciona antes de adicionar

Antes de adicionar um vídeo, teste se ele pode ser incorporado:

1. Acesse: `https://www.youtube-nocookie.com/embed/ID_DO_VIDEO`
2. Se o vídeo carregar → ✅ funciona no DramaLuxe
3. Se aparecer erro "Video unavailable" ou "Playback on other websites is disabled" → ❌ não funciona (canal bloqueou embed)

---

## ⚠️ Vídeos que NÃO funcionam por embed

Alguns canais desativam a reprodução em outros sites. Nesse caso use o link direto:

```js
// Em vez de embed, use link externo — o botão "Abrir no YouTube" vai aparecer
// O usuário será redirecionado ao YouTube para assistir
```

---

## 📱 Layout responsivo

O DramaLuxe se adapta automaticamente a qualquer tela:

| Dispositivo | Colunas por linha |
|---|---|
| Celular pequeno (< 480px) | 1 a 2 vídeos |
| Celular grande / iPhone (480px+) | 3 vídeos |
| Tablet (768px+) | 4 vídeos |
| Notebook / Desktop (1200px+) | 5 vídeos |

Os vídeos que não cabem na linha aparecem **automaticamente na linha de baixo** — sem scroll lateral.

---

## 🔄 Resumo do fluxo completo

```
1. Acessa GitHub → js/catalog.js → ✏️ Editar
2. Encontra o ID do vídeo na plataforma (YouTube, OK.ru, etc.)
3. Cola o código do novo filme/série no lugar certo
4. Commit → Netlify faz deploy automático em ~30s
5. Acessa o link do site → novo conteúdo aparece
```

---

*DramaLuxe — desenvolvido por Saieso Seraos*  
*Em homenagem a Eliene LBS, Lorhuan LBS e Oliver LBS* 💜
