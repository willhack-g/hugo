# Ulepszenia SEO dla strony willhack.top

## 1. Metadane stron
- [ ] Dodać opisy meta (description) w plikach sekcji
- [ ] Dodać słowa kluczowe (keywords) w metadanych
- [ ] Rozszerzyć i zoptymalizować tytuły stron

### Przykład poprawionego front matter:
```yaml
+++
title = "Artificial Intelligence | WillHack - Advanced AI Insights"
description = "Comprehensive articles about artificial intelligence, machine learning, and their applications in modern technology"
keywords = ["AI", "artificial intelligence", "machine learning", "deep learning"]
language = "en"
images = ["featured.webp"]
+++
```

## 2. Konfiguracja techniczna

### Mapa witryny
Zmodyfikować `params.toml`:
```toml
[sitemap]
  priority = 0.8  # Wyższy priorytet dla głównych sekcji
```

### Cache Control
Dodać do konfiguracji serwera:
```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|webp)$ {
    expires 365d;
    add_header Cache-Control "public, no-transform";
}
```

## 3. Optymalizacja obrazów
- [ ] Dodać atrybuty alt do wszystkich obrazów
- [ ] Określić wymiary (width/height) dla obrazów
- [ ] Dodać fallbacki dla starszych przeglądarek

### Przykład optymalizacji obrazu:
```html
<img
  src="image.webp"
  alt="Detailed description of the image"
  width="800"
  height="600"
  loading="lazy"
  onerror="this.onerror=null; this.src='image.jpg'"
/>
```

## 4. Internacjonalizacja

### Dodać do layouts/partials/head.html:
```html
<link rel="alternate" hreflang="x-default" href="{{ .Site.BaseURL }}">
{{ range .Site.Languages }}
<link rel="alternate" hreflang="{{ .Lang }}" href="{{ .Site.BaseURL }}/{{ .Lang }}">
{{ end }}
<meta http-equiv="content-language" content="{{ .Site.Language.Lang }}">
```

## 5. Optymalizacja wydajności

### Preload krytycznych zasobów
Dodać do head:
```html
<link rel="preload" href="/css/main.css" as="style">
<link rel="preload" href="/js/main.js" as="script">
```

### Progressive loading
```html
<!-- Dla obrazów -->
<img
  src="tiny-image.jpg"
  data-src="full-image.jpg"
  class="lazyload blur-up"
/>
```

## 6. Schema.org i Open Graph

### Dodać do params.toml:
```toml
[params]
  enableSEO = true
  enableOpenGraph = true
  enableTwitterCards = true
  enableSchemaOrg = true
```

### Dodać do layouts/partials/head.html:
```html
{{ if .IsPage }}
<meta property="og:type" content="article" />
<meta property="og:title" content="{{ .Title }}" />
<meta property="og:description" content="{{ .Description }}" />
<meta property="og:url" content="{{ .Permalink }}" />
{{ with .Params.images }}
<meta property="og:image" content="{{ index . 0 | absURL }}" />
{{ end }}
{{ end }}
```

## 7. Lista kontrolna wdrożenia
1. Zaktualizować wszystkie pliki _index.md z nowymi metadanymi
2. Wdrożyć zmiany w szablonach (layouts)
3. Zoptymalizować wszystkie obrazy
4. Przetestować wydajność po zmianach
5. Zweryfikować mapy witryn
6. Sprawdzić poprawność hreflangs

## 8. Monitoring
- [ ] Skonfigurować Google Search Console
- [ ] Monitorować Core Web Vitals
- [ ] Śledzić indeksowanie w różnych wersjach językowych