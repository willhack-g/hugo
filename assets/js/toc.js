document.addEventListener('DOMContentLoaded', function() {
    // Szukamy TOC w konkretnym selektorze używanym przez motyw Blowfish
    const toc = document.querySelector('.toc-right #TableOfContents');
    if (!toc) { 
        console.log('TOC not found');
        return; 
    }

    const tocLinks = toc.querySelectorAll('a');
    const sections = [];

    // Zbierz wszystkie sekcje na podstawie linków w TOC
    tocLinks.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        console.log('Looking for section:', id);
        const section = document.getElementById(id);
        if (section) {
            sections.push({
                element: section,
                link: link
            });
        }
    });

    console.log('Found sections:', sections.length);

    // Funkcja do aktualizacji aktywnego linku
    function updateActiveLink() {
        const scroll = window.scrollY;
        const windowHeight = window.innerHeight;

        // Znajdź aktualnie widoczną sekcję
        let currentSection = null;
        
        // Sprawdź każdą sekcję od góry
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const rect = section.element.getBoundingClientRect();
            
            // Jeśli sekcja jest w widoku (z małym offsetem u góry)
            if (rect.top <= 100) {
                currentSection = section;
            }
        }

        // Jeśli nie znaleziono żadnej sekcji w widoku, użyj pierwszej
        if (!currentSection && sections.length > 0) {
            currentSection = sections[0];
        }

        // Usuń aktywną klasę ze wszystkich linków
        tocLinks.forEach(link => {
            link.classList.remove('active');
            // Reset stylów
            link.style.color = '';
            link.style.fontWeight = '';
        });

        // Dodaj aktywną klasę do bieżącego linku
        if (currentSection) {
            console.log('Setting active:', currentSection.element.id);
            currentSection.link.classList.add('active');
            // Wymuś style bezpośrednio dla lepszej widoczności
            if (document.documentElement.getAttribute('data-scheme') === 'dark') {
                currentSection.link.style.color = 'var(--primary-400)';
            } else {
                currentSection.link.style.color = 'var(--primary-600)';
            }
            currentSection.link.style.fontWeight = 'bold';
        }
    }

    // Nasłuchuj zdarzenia przewijania z debounce dla lepszej wydajności
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveLink);
    });
    
    // Wywołaj raz na starcie
    updateActiveLink();
});