#!/usr/bin/env python3
"""
DramaLuxe — Baixar imagens reais  (v4 — multi-fonte)
=====================================================
Fontes em cascata:
  1. TMDB backdrop (16:9)
  2. TMDB poster (2:3)
  3. DuckDuckGo Images  ← sem API key, igual ao Google
  4. Bing Images        ← último recurso

COMO USAR:
  1. Este arquivo deve estar na pasta raiz do projeto (junto ao index.html)
  2. Abra o terminal nessa pasta
  3. Execute: python baixar_imagens.py
  4. Aguarde ~3-5 minutos
  5. Suba assets/thumbs/ para o GitHub
"""

import os, re, time, json, html
import urllib.request, urllib.error, urllib.parse

TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8"
TMDB_API = "https://api.themoviedb.org/3"
IMG_BACK = "https://image.tmdb.org/t/p/w780"
IMG_POST = "https://image.tmdb.org/t/p/w500"
THUMBS   = "assets/thumbs"

HDRS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}

# ── Catálogo com IDs TMDB verificados e termos de busca ────────────────
DRAMAS = [
    # (arquivo, tipo, tmdb_id, backdrop, termo_de_busca)
    ("so-por-amor",                "tv",    206534,  True,  "Just For Love 2023 chinese drama poster"),
    ("namoro-na-cozinha",          "tv",    97386,   True,  "Love in the Kitchen chinese drama poster"),
    ("doce-primeiro-amor",         "tv",    116654,  True,  "Sweet First Love 2021 chinese drama poster"),
    ("love-in-time",               "tv",    214803,  True,  "Love in Time 2023 chinese drama poster"),
    ("ashes-of-love",              "tv",    78588,   True,  "Ashes of Love chinese drama poster"),
    ("eternal-love",               "tv",    68286,   True,  "Eternal Love Three Lives Ten Miles Peach Blossoms poster"),
    ("amor-fada-demonio",          "tv",    130368,  True,  "Love Between Fairy and Devil 2022 poster"),
    ("ate-fim-da-lua",             "tv",    218199,  True,  "Till the End of the Moon 2023 poster"),
    ("danca-fenix",                "tv",    107231,  True,  "Dance of the Phoenix 2020 Yang Chaoyue drama poster"),
    ("cashero-2025",               "tv",    257389,  True,  "Cashero 2025 kdrama poster"),
    ("my-love-from-star",          "tv",    55702,   True,  "My Love from the Star korean drama poster"),
    ("business-proposal",          "tv",    134487,  True,  "Business Proposal kdrama 2022 poster"),
    ("extraordinary-attorney-woo", "tv",    197067,  True,  "Extraordinary Attorney Woo kdrama poster"),
    ("girl-from-nowhere",          "tv",    83639,   True,  "Girl from Nowhere thai drama poster"),
    ("hanazakari",                 "tv",    36818,   False, "Hana Kimi 2007 japanese drama poster"),
    ("alice-borderland",           "tv",    110316,  True,  "Alice in Borderland netflix poster"),
    ("amor-oculto",                "tv",    213646,  True,  "Hidden Love 2023 chinese drama poster"),
    ("voce-minha-gloria",          "tv",    127493,  True,  "You Are My Glory chinese drama poster Yang Yang"),
    ("melhor-de-tudo-serie",       "tv",    237421,  True,  "The Best Thing 2025 chinese drama poster"),
    ("coracao-destinados",         "tv",    272484,  True,  "Fated Hearts 2025 chinese drama poster"),
    ("oliveira-branca-serie",      "tv",    208817,  True,  "The White Olive Tree chinese drama poster"),
    ("the-untamed-serie",          "tv",    88375,   True,  "The Untamed 2019 chinese drama poster"),
    ("true-beauty",                "tv",    113149,  True,  "True Beauty kdrama poster 2020"),
    ("twenty-five-twenty-one",     "tv",    120586,  True,  "Twenty Five Twenty One kdrama poster"),
    ("filme-melhor-de-tudo",       "tv",    237421,  True,  "The Best Thing 2025 chinese drama poster"),
    ("filme-oliveira-branca",      "tv",    208817,  True,  "The White Olive Tree chinese drama poster"),
    ("filme-vida-apos-vida",       "movie", 975219,  True,  "Life After Life 2024 chinese film poster"),
    ("filme-amor-oculto",          "tv",    213646,  True,  "Hidden Love 2023 chinese drama poster"),
    ("filme-untamed",              "tv",    88375,   True,  "The Untamed chinese drama poster"),
    ("filme-quem-governa",         "tv",    176564,  True,  "Who Rules the World chinese drama poster Yang Yang"),
    ("filme-pousando-amor",        "tv",    95169,   True,  "Crash Landing on You korean drama poster"),
    ("filme-twenty-five",          "tv",    120586,  True,  "Twenty Five Twenty One kdrama poster"),
    ("filme-true-beauty",          "tv",    113149,  True,  "True Beauty kdrama poster"),
    ("filme-su-ki-da",             "movie", 18990,   True,  "Say I Love You japanese film poster"),
    ("filme-first-love",           "tv",    192516,  True,  "First Love Hatsukoi netflix poster"),
    ("filme-your-eyes-tell",       "movie", 753342,  True,  "Your Eyes Tell japanese film poster"),
    ("filme-rurouni-kenshin",      "movie", 643532,  True,  "Rurouni Kenshin The Final 2021 poster"),
    ("filme-drive-my-car",         "movie", 749630,  True,  "Drive My Car 2021 japanese film poster"),
    ("filme-friend-zone",          "movie", 712879,  True,  "Friend Zone 2 thai film poster"),
    ("filme-brother-year",         "movie", 578573,  True,  "Brother of the Year thai film poster"),
    ("filme-bad-genius",           "movie", 428398,  True,  "Bad Genius thai film poster"),
    ("filme-triage",               "movie", 889736,  True,  "Triage 2022 thai film poster"),
    ("filme-roundup",              "movie", 1096360, True,  "The Roundup Punishment 2024 korean film poster"),
    ("filme-wailing",              "movie", 399723,  True,  "The Wailing Goksung korean film poster"),
    ("filme-cobweb",               "movie", 867028,  True,  "Cobweb 2023 korean film poster"),
    ("filme-hunt",                 "movie", 836225,  True,  "Hunt 2022 korean film poster Lee Jung Jae"),
    ("filme-decision",             "movie", 746243,  True,  "Decision to Leave 2022 korean film poster"),
    ("filme-godzilla",             "movie", 940721,  True,  "Godzilla Minus One 2023 poster"),
    ("filme-boy-heron",            "movie", 508883,  True,  "The Boy and the Heron 2023 poster ghibli"),
    ("filme-suzume",               "movie", 762441,  True,  "Suzume 2022 anime film poster"),
    ("filme-kenshin-final",        "movie", 643532,  True,  "Rurouni Kenshin The Final poster"),
    # ── NOVOS: ARTES MARCIAIS ──
    ("nirvana-in-fire",         "tv",    25472,   True,  "Nirvana in Fire 2015 chinese drama poster"),
    ("sword-snow-stride",        "tv",    145165,  True,  "Sword Snow Stride 2021 chinese drama poster"),
    ("novoland-eagle-flag",      "tv",    84979,   True,  "Novoland Eagle Flag 2019 chinese drama poster"),
    ("ancient-love-poetry",      "tv",    123456,  True,  "Ancient Love Poetry 2021 chinese drama poster Zhou Dongyu"),
    ("vincenzo",                 "tv",    118642,  True,  "Vincenzo kdrama 2021 poster Song Joong Ki"),
    ("arthdal-chronicles",       "tv",    84658,   True,  "Arthdal Chronicles kdrama poster 2019"),
    ("jirisan",                  "tv",    146069,  True,  "Jirisan korean drama poster 2021 Jun Ji Hyun"),
    ("filme-ip-man",             "movie", 47536,   True,  "Ip Man 2008 kung fu film poster Donnie Yen"),
    ("filme-ip-man-2",           "movie", 47546,   True,  "Ip Man 2 2010 kung fu film poster Donnie Yen"),
    ("filme-ip-man-3",           "movie", 283552,  True,  "Ip Man 3 2015 kung fu film poster Donnie Yen"),
    ("filme-league-gods",        "movie", 315635,  True,  "League of Gods 2016 chinese fantasy film poster"),
    ("filme-mulan-2020",         "movie", 337401,  True,  "Mulan 2020 Disney film poster"),
    ("filme-house-dagger",       "movie", 10518,   True,  "House of Flying Daggers 2004 Zhang Yimou poster"),
    ("filme-hero-2002",          "movie", 10535,   True,  "Hero 2002 Jet Li Zhang Yimou film poster"),
    ("filme-crouching-tiger",    "movie", 1267,    True,  "Crouching Tiger Hidden Dragon 2000 film poster"),
    ("filme-new-legend-shaolin", "movie", 22060,   True,  "New Legend of Shaolin 1994 Jet Li film poster"),
    ("filme-warrior-king",       "movie", 10673,   True,  "Tom Yum Goong Warrior King 2005 Tony Jaa poster"),
]


def fetch(url, referer=None, timeout=15):
    h = dict(HDRS)
    if referer:
        h["Referer"] = referer
    try:
        req = urllib.request.Request(url, headers=h)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except Exception:
        return None


def tmdb_url(tipo, tid, backdrop=True):
    data = fetch(f"{TMDB_API}/{tipo}/{tid}?api_key={TMDB_KEY}&language=en-US")
    if not data:
        return None
    try:
        j = json.loads(data)
        if backdrop and j.get("backdrop_path"):
            return IMG_BACK + j["backdrop_path"]
        if j.get("poster_path"):
            return IMG_POST + j["poster_path"]
    except Exception:
        pass
    return None


def duckduckgo_url(query):
    """Busca imagem via DuckDuckGo sem API key"""
    q = urllib.parse.quote(query)

    # Passo 1: obter o token vqd
    page = fetch(f"https://duckduckgo.com/?q={q}&iax=images&ia=images",
                 referer="https://duckduckgo.com/")
    if not page:
        return None
    text = page.decode("utf-8", errors="ignore")

    vqd = None
    m = re.search(r'vqd=(["\'])([^"\']+)\1', text)
    if m:
        vqd = m.group(2)
    else:
        m = re.search(r'vqd=([\d\-]+)', text)
        if m:
            vqd = m.group(1)
    if not vqd:
        return None

    # Passo 2: buscar resultados de imagens
    api = (f"https://duckduckgo.com/i.js?q={q}&o=json&p=1"
           f"&vqd={urllib.parse.quote(vqd)}&f=,,,,,&l=pt-br")
    resp = fetch(api, referer="https://duckduckgo.com/")
    if not resp:
        return None
    try:
        results = json.loads(resp).get("results", [])
        for item in results:
            img = item.get("image", "")
            w, h = item.get("width", 0), item.get("height", 0)
            if img.startswith("http") and w >= 280 and h >= 150 and ".svg" not in img:
                return img
    except Exception:
        pass
    return None


def bing_url(query):
    """Busca imagem no Bing como último recurso"""
    q = urllib.parse.quote(query + " poster official")
    url = f"https://www.bing.com/images/search?q={q}&form=HDRSC3"
    data = fetch(url, referer="https://www.bing.com/")
    if not data:
        return None
    text = data.decode("utf-8", errors="ignore")
    matches = re.findall(r'"murl":"([^"]+\.(?:jpg|jpeg|png))"', text)
    for m in matches:
        m = html.unescape(m)
        if m.startswith("http"):
            return m
    return None


def save(url, dest):
    data = fetch(url, timeout=20)
    if not data or len(data) < 4000:
        return False, f"{len(data or b'')}b"
    with open(dest, "wb") as f:
        f.write(data)
    return True, f"{len(data)//1024}KB"


def main():
    os.makedirs(THUMBS, exist_ok=True)
    total = len(DRAMAS)
    ok, failed = 0, []

    print("=" * 60)
    print("  DramaLuxe — Downloader Multi-fonte  v4")
    print("  TMDB → DuckDuckGo → Bing")
    print(f"  Pasta: {os.path.abspath(THUMBS)}")
    print("=" * 60)

    for i, (name, tipo, tid, use_back, term) in enumerate(DRAMAS, 1):
        dest = os.path.join(THUMBS, f"{name}.jpg")

        if os.path.exists(dest) and os.path.getsize(dest) > 4000:
            print(f"  [{i:02}/{total}] ⏭  {name}.jpg")
            ok += 1
            continue

        url = src = None

        # 1. TMDB backdrop
        if use_back:
            url = tmdb_url(tipo, tid, True)
            if url: src = "TMDB"
        time.sleep(0.15)

        # 2. TMDB poster
        if not url:
            url = tmdb_url(tipo, tid, False)
            if url: src = "TMDB poster"
            time.sleep(0.15)

        # Tenta salvar TMDB
        if url:
            success, info = save(url, dest)
            if success:
                print(f"  [{i:02}/{total}] ✅ {name}.jpg ({src} · {info})")
                ok += 1
                time.sleep(0.2)
                continue
            url = None

        # 3. DuckDuckGo
        print(f"  [{i:02}/{total}] 🔍 {name} — DuckDuckGo...")
        url = duckduckgo_url(term)
        time.sleep(0.6)
        if url:
            success, info = save(url, dest)
            if success:
                print(f"  [{i:02}/{total}] ✅ {name}.jpg (DuckDuckGo · {info})")
                ok += 1
                time.sleep(0.3)
                continue

        # 4. Bing
        print(f"  [{i:02}/{total}] 🔍 {name} — Bing...")
        url = bing_url(term)
        time.sleep(0.6)
        if url:
            success, info = save(url, dest)
            if success:
                print(f"  [{i:02}/{total}] ✅ {name}.jpg (Bing · {info})")
                ok += 1
                time.sleep(0.3)
                continue

        print(f"  [{i:02}/{total}] ❌ {name} — nenhuma fonte funcionou")
        failed.append(name)
        time.sleep(0.3)

    print("=" * 60)
    print(f"  ✅ Sucesso: {ok}/{total}")
    if failed:
        print(f"  ❌ Falhas  : {len(failed)}")
        for f in failed:
            print(f"     - {f}.jpg")
        print()
        print("  Para os que falharam:")
        print("  → Google: 'NOME DO DRAMA poster jpg'")
        print("  → Salve como NOME.jpg em assets/thumbs/")
    print()
    print("  🚀 Depois: suba assets/thumbs/ no GitHub")
    print("=" * 60)


if __name__ == "__main__":
    main()
