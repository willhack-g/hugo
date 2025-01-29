# Analiza i rekomendacje optymalizacji CSS

## Obecny stan
- Rozmiar głównego pliku CSS: 14.7 KiB
- Potencjalne oszczędności: 11.5 KiB
- Główne źródła nadmiarowego kodu:
  1. Nieużywane klasy Tailwind w szablonach
     - Wiele nieużywanych wariantów dla dark mode
  2. Duplikacja styli dla różnych breakpointów
  3. Nadmiarowe style Tailwind

## Zidentyfikowane problemy

### 1. Nadmiarowe warianty komponentów
- Wiele nieużywanych wariantów headerów (`fixed.html`, `header-mobile-option-nested.html` itd.)
- Każdy wariant ma własne style, które są ładowane nawet jeśli nie są używane
- Szczególnie w widoku artykułu:
  ```html
  <article>
    <section class="flex flex-col max-w-full mt-0 prose dark:prose-invert lg:flex-row">
      <!-- Wiele klas, które mogą być uproszczone -->
    </section>
  </article>
  ```
- Duplikacja styli dla różnych wariantów author box (top/bottom)

### 2. Duplikacja mediaqueriesów
```css
/* Przykład duplikacji dla różnych breakpointów */
.ratio-16-9 { padding-top: 56.25%; }
.sm\:ratio-16-9 { padding-top: 56.25%; }
.md\:ratio-16-9 { padding-top: 56.25%; }
.lg\:ratio-16-9 { padding-top: 56.25%; }
.xl\:ratio-16-9 { padding-top: 56.25%; }
.2xl\:ratio-16-9 { padding-top: 56.25%; }
```

### 3. Niewykorzystane klasy pomocnicze Tailwind
- Duża liczba wygenerowanych klas grid (grid-w10 do grid-w100)
- Nieużywane warianty dla wszystkich breakpointów
- Nadmiarowe style dla komponentów warunkowych:
  ```html
  {{ if .Params.showTableOfContents }}
  <!-- Generowane są style nawet jeśli ToC jest wyłączony -->
  ```
- Nadmiarowe style dla komponentu hero:
  ```html
  <div class="w-full h-36 md:h-56 lg:h-72 single_hero_basic nozoom">
  ```
  Generuje wiele klas dla różnych breakpointów, można uprościć do:
  ```css
  .single_hero_basic {
    width: 100%;
    height: 9rem; /* 36px */
    @screen md { height: 14rem; } /* 56px */
    @screen lg { height: 18rem; } /* 72px */
  }
  ```

## Rekomendacje optymalizacji

### 1. Optymalizacja szablonów
```toml
# config/_default/module.toml
[module]
  [module.hugoVersion]
    extended = true
  [[module.imports]]
    path = "github.com/nunocoracao/blowfish"
    disable = false

[build]
  writeStats = true  # Włącz generowanie statystyk dla PurgeCSS
```

### 2. Konfiguracja PurgeCSS
```js
// purgecss.config.js
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  css: ['./public/css/main.bundle.min.css'],
  safelist: [
    'prose',
    'dark',
    // Klasy dynamiczne używane w szablonach
    /^article-/,
    /^hero-/,
    'dark:prose-invert',
    'dark:bg-neutral-800',
    /^group-/
  ]
}
```

### 3. Optymalizacja klas Tailwind
W pliku `tailwind.config.js`:
```js
module.exports = {
  purge: {
    enabled: true,
    content: [
      './layouts/**/*.html',
      './content/**/*.md'
    ],
  },
  theme: {
    // Zdefiniować tylko używane breakpointy
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px'
    }
  },
  variants: {
    // Ograniczyć warianty tylko do faktycznie używanych w szablonach
    extend: {
      backgroundColor: ['dark', 'hover', 'dark:hover'],
      borderColor: ['dark'],
      display: ['dark'],
      flexDirection: ['lg'],
      maxWidth: ['lg'],
      padding: ['ltr', 'rtl'],
      position: ['lg'],
      textColor: ['dark', 'hover'],
      top: ['lg'],
      opacity: ['group-hover'],
      textColor: ['dark', 'hover', 'dark:hover']
    }
  }
}
```

### 4. Optymalizacja ładowania CSS
```html
<!-- layouts/partials/head.html -->
<!-- Critical CSS -->
<style>
  /* Critical CSS dla pierwszego renderowania */
  .prose { /* ... */ }
  .flex { display: flex; }
  
  /* Zoptymalizowane style hero */
  .single_hero_basic {
    width: 100%;
    height: 9rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  
  @media (min-width: 768px) {
    .single_hero_basic { height: 14rem; }
  }
  @media (min-width: 1024px) {
    .single_hero_basic { height: 18rem; }
  }
</style>

<!-- Opóźnione ładowanie pozostałych styli -->
<link rel="preload" href="{{ $styles.RelPermalink }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ $styles.RelPermalink }}"></noscript>
```

## Plan wdrożenia

1. **Faza 1: Analiza wykorzystania**
   - Przeprowadzić audyt używanych szablonów i partiali
   - Zidentyfikować faktycznie używane klasy CSS
   - Stworzyć mapę zależności komponentów
   - Przeanalizować warunkowe ładowanie komponentów
   
2. **Faza 2: Optymalizacja konfiguracji**
   - Wdrożyć PurgeCSS
   - Zoptymalizować konfigurację Tailwind
   - Usunąć nieużywane importy komponentów

3. **Faza 3: Refaktoryzacja szablonów**
   - Zunifikować style komponentów
   - Usunąć duplikacje
   - Zoptymalizować specificity selektorów

4. **Faza 4: Optymalizacja dostarczania**
   - Wdrożyć Critical CSS
   - Skonfigurować lazy loading
   - Zoptymalizować caching

## Oczekiwane rezultaty
- Redukcja rozmiaru CSS o około 11 KiB
- Poprawa First Contentful Paint
- Lepsze wyniki Core Web Vitals
- Uproszczenie maintainance kodu
- Zmniejszenie złożoności selektorów CSS

## Uwagi bezpieczeństwa
- Zachować kopię zapasową oryginalnych styli
- Testować zmiany na wszystkich wspieranych przeglądarkach
- Monitorować metryki wydajności
- Wdrażać zmiany stopniowo z możliwością szybkiego rollback'u