# Analiza wydajności Hero Image

## Problem
Zidentyfikowano znaczące opóźnienie w renderowaniu obrazu tła (hero image) na stronie głównej:
- 77% całkowitego czasu LCP (1980 ms) to opóźnienie renderowania
- 23% to TTFB (600 ms)
- Element problematyczny: `div.relative > main#main-content > div.hero-section > img.absolute`

## Przyczyny opóźnień

### 1. Problemy z optymalizacją renderowania
- Używane są złożone transformacje 3D (`transform: translate3d`) i właściwości 3D (`perspective`, `transform-style: preserve-3d`), które wymuszają compositing na GPU
- Właściwości `backface-visibility` i `transform-style` zwiększają złożoność renderowania
- Nadmiarowe style CSS związane z 3D na elementach, które tego nie wymagają

### 2. Problemy z ładowaniem obrazu
- Brak kompletnej optymalizacji ładowania obrazu:
  - Jest `fetchpriority="high"`, ale brak `loading="eager"`
  - W szablonie brak zdefiniowanego `srcset` i `sizes` (choć pojawia się w wygenerowanym HTML)
  - Brak explicit wymiarów obrazu w HTML (`width` i `height`)

### 3. Layout i Style
- Użycie `position: absolute` może powodować reflow
- Kombinacja `overflow: hidden` z `border-radius` i transformacjami 3D zwiększa złożoność renderowania
- Nadmiarowe warstwy pozycjonowania względnego/absolutnego

## Rekomendowane zmiany

### 1. Optymalizacja ładowania obrazu
```html
<img 
  src="{{ $bgImage | relURL }}"
  srcset="/back_optimized_mobile.webp 480w, /back_optimized.webp 800w"
  sizes="(max-width: 767px) 480px, 800px"
  width="800"
  height="450"
  class="hero-image"
  alt=""
  role="presentation"
  fetchpriority="high"
  loading="eager"
  decoding="async"
>
```

### 2. Uproszczenie CSS
```css
.hero-container {
  position: relative;
  height: 450px;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  /* Usunięto transform/perspective/backface-visibility */
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Usunięto transformacje 3D */
}
```

### 3. Optymalizacja warstw
- Zmniejszenie liczby zagnieżdżonych elementów z pozycjonowaniem
- Użycie `will-change: transform` tylko gdy jest naprawdę potrzebne
- Wykorzystanie `contain: paint` dla lepszej izolacji warstw

## Oczekiwane rezultaty
- Redukcja opóźnienia renderowania o ~40-60%
- Szybsze rozpoczęcie ładowania obrazu dzięki `loading="eager"`
- Mniejsze obciążenie GPU przez usunięcie niepotrzebnych transformacji 3D
- Lepszy Layout Stability Score

## Dodatkowe rekomendacje
1. Rozważyć użycie `<picture>` element dla lepszej kontroli nad responsywnością
2. Zaimplementować progressive loading z placeholder
3. Wykorzystać `Content-Visibility: auto` dla elementów poniżej hero section
4. Dodać preload hint dla obrazu hero:
```html
<link rel="preload" as="image" href="/back_optimized.webp" />