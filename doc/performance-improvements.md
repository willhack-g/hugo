# Performance Improvements - Hero Section LCP

## Problem
Aktualnie sekcja hero ma zbyt wysoki LCP (2730ms), z czego:
- TTFB: 600ms (22%)
- Opóźnienie renderowania: 2130ms (78%)

## Przyczyna
1. Bezpośrednie ładowanie dużego obrazu tła przez inline CSS
2. Brak linkowania zasobów z odpowiednim priorytetem
3. Skomplikowane renderowanie tła z dynamiczną podmianą dla mobile

## Możliwe optymalizacje

### Priorytetowe
1. Przenieść logikę ładowania obrazu z inline styles do pliku CSS
```css
.hero-background {
  background-image: var(--hero-background);
}
```

2. Dodać preload dla obrazu hero w szablonie HTML
```html
<link rel="preload" 
      href="{{ .Site.Params.defaultBackgroundImage | relURL }}" 
      as="image" 
      type="image/webp">
```

3. Wykorzystać CSS custom properties dla dynamicznej podmiany obrazów
```css
:root {
  --hero-background: url('/back_optimized.webp');
}

@media (max-width: 767px) {
  :root {
    --hero-background: url('/back_optimized_mobile.webp');
  }
}
```

### Długoterminowe
1. Zoptymalizować pipeline przetwarzania obrazów w Hugo:
   - Automatyczna generacja różnych rozmiarów
   - WebP jako format domyślny
   - Progresywne ładowanie

2. Wprowadzić lazy loading dla elementów poniżej fold

3. Wykorzystać nowoczesne atrybuty obrazów:
   - fetchpriority="high" dla krytycznych zasobów
   - loading="eager" dla hero image
   - decoding="async" dla pozostałych obrazów

## Monitorowanie
1. Śledzić metryki Core Web Vitals:
   - LCP powinien być < 2.5s
   - FID < 100ms
   - CLS < 0.1

2. Sprawdzać rozmiary generowanych obrazów:
   - Desktop max: 1408px szerokości
   - Mobile: 480px szerokości
   - Format: WebP z optymalną kompresją

## Next Steps
1. Usunąć inline styles z hero-background
2. Przenieść logikę obrazów do CSS z użyciem custom properties
3. Dodać preload dla krytycznych zasobów
4. Monitorować wpływ zmian na LCP