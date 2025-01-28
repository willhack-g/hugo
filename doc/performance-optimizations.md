# Optymalizacja Wydajności Renderowania (LCP)

## Problem

Zidentyfikowano problem z długim czasem renderowania (Largest Contentful Paint - LCP) na urządzeniach mobilnych:

```
Element: WillHack Hack you reality - if you want to find yourself in tomorrow's world...
Faza                    % LCP    Czas
TTFB                    22%      600 ms
Opóźnienie wczytywania   0%        0 ms
Czas wczytywania         0%        0 ms
Opóźnienie renderowania 78%     2140 ms
```

## Analiza Obecnej Implementacji

### Problematyczne elementy w custom.html:

1. Używanie background-image w CSS:
```html
background-image: var(--hero-background);
```
To wymaga dodatkowych kroków przez przeglądarkę:
- Parsowanie CSS
- Znalezienie zmiennej CSS
- Pobranie obrazu
- Renderowanie jako tło

2. Preload nie działa optymalnie:
```html
<link rel="preload" href="{{ $bgImage | relURL }}" as="image">
```
- Może kolidować z naturalnym ładowaniem zasobów
- Dodaje złożoność do procesu ładowania

## Proponowane Rozwiązanie

Zoptymalizować custom.html zachowując pożądany wygląd (mniejsza wysokość, bez logo, bez przyciemnienia):

```html
{{ $bgImage := .Site.Params.defaultBackgroundImage }}
{{ $mobileBgImage := replace ($bgImage | relURL) ".webp" "_mobile.webp" }}

<div class="hero-section relative flex flex-col justify-center items-center text-center rounded-[20px] overflow-hidden">
  <!-- Optymalne ładowanie obrazu -->
  <img 
    src="{{ $bgImage | relURL }}"
    srcset="{{ $mobileBgImage }} 480w,
            {{ $bgImage | relURL }} 800w"
    sizes="(max-width: 767px) 480px,
           800px"
    class="absolute inset-0 w-full h-full object-cover nozoom"
    alt=""
    role="presentation"
    fetchpriority="high"
    style="z-index: -1;"
  >
  
  <!-- Treść -->
  <div class="hero-content relative z-2">
    <h1 class="text-white text-4xl md:text-5xl font-bold text-shadow mb-4">
      {{ .Site.Title }}
    </h1>
    <p class="text-white text-lg md:text-xl font-bold max-w-[800px] text-shadow">
      {{ .Site.Params.author.headline }}
    </p>
  </div>
</div>

<!-- Recent Articles -->
<div class="recent-articles-section">
  {{ partial "recent-articles/main.html" . }}
</div>

<style>
/* Minimalne wymagane style */
.hero-section {
  min-height: 60vh; /* Mniejsza wysokość */
  padding: 2rem;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
```

### Kluczowe optymalizacje:

1. Natywny `<img>` zamiast `background-image`:
- Przeglądarka może rozpocząć pobieranie obrazu natychmiast
- Lepsze wsparcie dla lazy loading i priorytetyzacji

2. Responsywne obrazy przez `srcset` i `sizes`:
- Browser wybiera odpowiedni obraz bazując na szerokości ekranu
- Nie ma potrzeby ładowania dużego obrazu na mobile

3. Minimalistyczne style:
- Większość przez Tailwind
- Tylko niezbędne custom CSS
- Brak skomplikowanych transformacji

4. Optymalne pozycjonowanie:
- `z-index: -1` dla obrazu
- Relatywne pozycjonowanie dla treści
- Brak zbędnych warstw

## Dodatkowe Optymalizacje

1. W config/_default/params.toml:
```toml
disableImageOptimization = false
backgroundImageResponsive = true
backgroundImageSizes = ["480w", "800w"]
```

2. Optymalizacja obrazów:
- Używać WebP
- Przygotować odpowiednie rozmiary dla mobile/desktop
- Optymalizować jakość/rozmiar

## Oczekiwane Rezultaty

1. Szybsze LCP dzięki:
- Natychmiastowemu rozpoczęciu pobierania obrazu
- Optymalnemu rozmiarowi obrazu dla urządzenia
- Minimalnej ilości CSS do sparsowania

2. Zachowanie pożądanego wyglądu:
- Mniejsza wysokość hero sekcji
- Brak logo autora
- Brak przyciemnienia tła
- Czyste tło bez nakładek

## Monitorowanie

Po wdrożeniu należy:
1. Zmierzyć nowe czasy LCP
2. Sprawdzić wydajność na różnych urządzeniach
3. Zweryfikować wygląd na różnych rozdzielczościach

## Przypisy

1. Obecna implementacja: layouts/partials/home/custom.html
2. Metryki wydajności: DevTools Performance
3. Best practices: web.dev/lcp