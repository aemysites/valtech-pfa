/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a panel
  function extractImage(panel) {
    const img = panel.querySelector('.panel__image img');
    return img || null;
  }

  // Helper to extract text content from a panel
  function extractText(panel) {
    const body = panel.querySelector('.panel__body');
    if (!body) return null;
    const fragments = [];
    // Kicker (optional)
    const kicker = body.querySelector('.panel__kicker');
    if (kicker) fragments.push(kicker.cloneNode(true));
    // Headline (h1/h2)
    let headline = body.querySelector('.panel__headline');
    if (headline) {
      const hero = headline.querySelector('.hero');
      if (hero) {
        const h = document.createElement('h2');
        h.innerHTML = hero.innerHTML;
        fragments.push(h);
      } else if (headline.querySelector('p')) {
        // Only use the p as the headline, not both
        const h = document.createElement('h2');
        h.innerHTML = headline.querySelector('p').innerHTML;
        fragments.push(h);
      } else {
        const h = document.createElement('h2');
        h.innerHTML = headline.innerHTML;
        fragments.push(h);
      }
    }
    // Description (paragraphs not kicker/headline)
    body.querySelectorAll('p').forEach(p => {
      if (p !== kicker && (!headline || p !== headline) && (!headline || !headline.contains(p))) {
        fragments.push(p.cloneNode(true));
      }
    });
    // CTA (span.cta-btn)
    const cta = body.querySelector('.cta-btn');
    if (cta) fragments.push(cta.cloneNode(true));
    return fragments;
  }

  // Helper to extract news card
  function extractNewsCard(panel) {
    const body = panel.querySelector('.panel__body');
    if (!body) return null;
    const fragments = [];
    // Headline
    const headline = body.querySelector('.panel__headline');
    if (headline && headline.textContent.trim()) {
      const h = document.createElement('h2');
      h.innerHTML = headline.textContent.trim();
      fragments.push(h);
    }
    // News list
    const ul = body.querySelector('.panel__news-list');
    if (ul) {
      const newsList = document.createElement('ul');
      ul.querySelectorAll('li').forEach(li => {
        newsList.appendChild(li.cloneNode(true));
      });
      fragments.push(newsList);
    }
    // Tags (see more link)
    const tags = body.querySelector('.panel__tags');
    if (tags) fragments.push(tags.cloneNode(true));
    return fragments;
  }

  // Helper to create a card row
  function createCardRow(img, text) {
    // Always ensure first cell is image or icon
    if (!img) {
      const icon = document.createElement('span');
      icon.textContent = '🗂';
      icon.setAttribute('aria-label', 'Card');
      img = icon;
    }
    return [img, text];
  }

  // Find all card columns
  const cards = [];
  const rowPanels = element.querySelector('.row.panels');
  if (!rowPanels) return;
  const cols = Array.from(rowPanels.children);

  // Hero Card (desktop)
  const heroCol = cols.find(col => col.classList.contains('narrow-hero'));
  if (heroCol) {
    const heroPanel = heroCol.querySelector('.narrow-hero__panel--desktop');
    if (heroPanel) {
      const img = extractImage(heroPanel);
      const text = extractText(heroPanel);
      cards.push(createCardRow(img, text));
    }
  }

  // Other cards
  cols.forEach(col => {
    if (col.classList.contains('narrow-hero') || !col.innerHTML.trim()) return;
    if (col.querySelector('.panel--news')) {
      const newsPanel = col.querySelector('.panel--news');
      const text = extractNewsCard(newsPanel);
      cards.push(createCardRow(null, text));
      return;
    }
    const panel = col.querySelector('.panel');
    if (panel) {
      const img = extractImage(panel);
      const text = extractText(panel);
      cards.push(createCardRow(img, text));
    }
  });

  // Table header
  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cards];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
