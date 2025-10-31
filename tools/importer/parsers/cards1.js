/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a panel
  function getPanelImage(panel) {
    const img = panel.querySelector('.panel__image img');
    return img || '';
  }

  // Helper to extract text content from a panel
  function getPanelText(panel) {
    const body = panel.querySelector('.panel__body');
    if (!body) return null;
    const fragments = [];
    const kicker = body.querySelector('.panel__kicker');
    if (kicker) fragments.push(kicker.cloneNode(true));
    const headline = body.querySelector('.panel__headline');
    if (headline) {
      // If headline contains a <p>, use its text inside the headline
      const headlineP = headline.querySelector('p');
      if (headlineP) {
        const h2 = document.createElement('h2');
        h2.textContent = headlineP.textContent;
        fragments.push(h2);
      } else {
        fragments.push(headline.cloneNode(true));
      }
    }
    // CTA: preserve link if present
    const cta = body.querySelector('.cta-btn');
    if (cta) {
      const anchor = cta.closest('a');
      if (anchor && anchor.href) {
        const a = document.createElement('a');
        a.href = anchor.href;
        a.innerHTML = cta.innerHTML;
        fragments.push(a);
      } else {
        fragments.push(cta.cloneNode(true));
      }
    }
    // For news panel, include the news list and tags
    const newsList = body.querySelector('.panel__news-list');
    if (newsList) fragments.push(newsList.cloneNode(true));
    const tags = body.querySelector('.panel__tags');
    if (tags) fragments.push(tags.cloneNode(true));
    return fragments.length ? fragments : null;
  }

  // Find all card elements
  const cardRows = [];
  // Header row
  cardRows.push(['Cards (cards1)']);

  // --- HERO CARD ---
  // Desktop hero
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) {
    const img = getPanelImage(heroDesktop);
    const text = getPanelText(heroDesktop);
    cardRows.push([img, text]);
  }

  // --- MAIN CARD GRID ---
  // Select all col-sm-6.col-md-4 elements (each contains a card)
  const cardCols = element.querySelectorAll('.row.panels > .col-sm-6.col-md-4');
  cardCols.forEach(col => {
    // Card can be an anchor or a panel
    const anchor = col.querySelector('a.panel');
    if (anchor) {
      const img = getPanelImage(anchor);
      const text = getPanelText(anchor);
      cardRows.push([img, text]);
    } else {
      // News panel (not an anchor)
      const panel = col.querySelector('.panel');
      if (panel) {
        cardRows.push(['', getPanelText(panel)]);
      }
    }
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cardRows, document);
  element.replaceWith(table);
}
