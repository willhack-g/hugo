# Optymalizacja obrazu hero - Plan działania

## Analiza aktualnego stanu
1. **Struktura plików:**
   - Obraz główny: `static/back_optimized.webp` (800x450px)
   - Wersja mobilna: `static/back_optimized_mobile.webp` (480x270px)
   - Implementacja w `layouts/partials/home/custom.html`

2. **Problem:**
   - Brak responsywnych wersji obrazów
   - Niespójne wykorzystanie zmiennych Hugo
   - Brak preload dla obrazów
   - Niekorzystne ustawienia dekodowania

## Strategia optymalizacji

### 1. Generowanie wersji obrazów
```bash
hugo gen chroma
hugo gen images -q 80 -formats webp,avif -resize "800x, 1200x, 1600x"
```

### 2. Modyfikacja szablonu
```html
{{ $hero := resources.GetMatch "images/hero.*" }}
{{ $hero_webp := $hero.Resize "1600x webp q80" }}
{{ $hero_avif := $hero.Resize "1600x avif q80" }}

<picture>
  <source 
    srcset="{{ ($hero.Resize "480x avif q80").RelPermalink }} 480w,
            {{ ($hero.Resize "800x avif q80").RelPermalink }} 800w,
            {{ $hero_avif.RelPermalink }} 1600w"
    type="image/avif"
    sizes="(max-width: 480px) 100vw,
          (max-width: 1200px) 80vw,
          1600px">
  
  <source
    srcset="{{ ($hero.Resize "480x webp q80").RelPermalink }} 480w,
            {{ ($hero.Resize "800x webp q80").RelPermalink }} 800w,
            {{ $hero_webp.RelPermalink }} 1600w"
    type="image/webp"
    sizes="(max-width: 480px) 100vw,
          (max-width: 1200px) 80vw,
          1600px">

  <img 
    src="{{ $hero.RelPermalink }}"
    alt="{{ .Site.Params.heroAltText }}"
    width="{{ $hero.Width }}"
    height="{{ $hero.Height }}"
    loading="eager"
    fetchpriority="high"
    decoding="async"
    class="hero-image"
    style="aspect-ratio: {{ div (float $hero.Width) $hero.Height }}">
</picture>
```

### 3. Wymagane zmiany konfiguracyjne
```toml
[imaging]
resampleFilter = "CatmullRom"
quality = 85
anchor = "smart"

[mediaTypes]
[mediaTypes."image/avif"]
suffixes = ["avif"]
[mediaTypes."image/webp"]
suffixes = ["webp"]
```

## Harmonogram wdrożenia
1. Migracja obrazów do katalogu `assets/images/` (2h)
2. Konfiguracja przetwarzania obrazów (1h)
3. Testy wydajnościowe (Lighthouse Audit)
4. Aktualizacja dokumentacji technicznej

## Metryki sukcesu
- Redukcja rozmiaru obrazu o ≥40%
- LCP < 2.5s na 3G
- Wynik Performance w Lighthouse ≥90