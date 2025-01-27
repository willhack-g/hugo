document.addEventListener('DOMContentLoaded', () => {
  if (typeof mediumZoom === 'function') {
    mediumZoom('img:not(.nozoom)', {
      margin: 24,
      background: 'rgba(0,0,0,0.9)',
      scrollOffset: 0,
      container: null,
      template: null,
      zoomSource: (img) => {
        return img.getAttribute('data-zoom-src') || img.src;
      }
    });
  }
});