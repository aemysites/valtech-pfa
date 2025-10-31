/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a card anchor, preserving links
  function extractCardFromAnchor(anchor) {
    const img = anchor.querySelector('.panel__image img');
    let imgCell = '';
    if (img) {
      const a = document.createElement('a');
      a.href = anchor.getAttribute('href');
      a.appendChild(img.cloneNode(true));
      imgCell = a;
    }
    const body = anchor.querySelector('.panel__body');
    const textParts = [];
    if (body) {
      const kicker = body.querySelector('.panel__kicker');
      if (kicker) textParts.push(kicker.cloneNode(true));
      const headline = body.querySelector('.panel__headline');
      if (headline) textParts.push(headline.cloneNode(true));
      const cta = body.querySelector('.cta-btn');
      if (cta) textParts.push(cta.cloneNode(true));
    }
    return [imgCell, textParts];
  }

  // Helper to extract card from a panel with no image (e.g., news, links, green)
  function extractCardFromPanel(panel) {
    const img = panel.querySelector('.panel__image img');
    let imgCell = '';
    if (img) {
      imgCell = img.cloneNode(true);
    }
    const body = panel.querySelector('.panel__body');
    const textParts = [];
    if (body) {
      textParts.push(body.cloneNode(true));
    }
    return [imgCell, textParts];
  }

  const cards = [];

  // Hero card (desktop version)
  const heroAnchor = element.querySelector('.narrow-hero__panel--desktop.panel--hero');
  if (heroAnchor) {
    cards.push(extractCardFromAnchor(heroAnchor));
  }

  // Standard cards (image cards)
  const gridCards = element.querySelectorAll('.col-sm-6.col-md-4 > a.panel--image');
  gridCards.forEach(anchor => {
    cards.push(extractCardFromAnchor(anchor));
  });

  // News card (panel--news)
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) {
    cards.push(extractCardFromPanel(newsPanel));
  }

  // Links card (panel--shortcuts-secondary)
  const linksPanel = element.querySelector('.panel--shortcuts-secondary');
  if (linksPanel) {
    cards.push(extractCardFromPanel(linksPanel));
  }

  // Green panel (panel--green)
  const greenPanel = element.querySelector('.panel--green');
  if (greenPanel) {
    cards.push(extractCardFromPanel(greenPanel));
  }

  // Build the table rows
  const rows = [
    ['Cards (cards14)'],
    ...cards.map(([img, text]) => [img, text])
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
