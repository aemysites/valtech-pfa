/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a panel
  function getPanelImage(panel) {
    const img = panel.querySelector('.panel__image img');
    if (img) return img;
    // If no image, check for color panel classes and create a colored div with label
    const panelClass = panel.className;
    let color = '', label = '';
    if (panelClass.includes('panel--primary')) { color = '#a40000'; label = 'Red Card'; }
    if (panelClass.includes('panel--green')) { color = '#006d6d'; label = 'Teal Card'; }
    if (panelClass.includes('panel--tertiary')) { color = '#fff'; label = 'White Card'; }
    if (panelClass.includes('panel--news')) { color = '#f5f5f5'; label = 'News Card'; }
    if (color) {
      const div = document.createElement('div');
      div.style.background = color;
      div.style.width = '100%';
      div.style.height = '80px';
      div.style.borderRadius = '8px';
      div.style.border = '1px solid #eee';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.fontWeight = 'bold';
      div.textContent = label;
      return div;
    }
    return '';
  }

  // Helper to extract card text content
  function getPanelText(panel) {
    const body = panel.querySelector('.panel__body');
    if (!body) return '';
    const fragments = [];
    // Kicker
    const kicker = body.querySelector('.panel__kicker');
    if (kicker) fragments.push(kicker.cloneNode(true));
    // Headline (may be h1, h2, or h2 > p)
    const headline = body.querySelector('.panel__headline');
    if (headline) {
      if (headline.querySelector('p')) {
        fragments.push(headline.querySelector('p').cloneNode(true));
      } else {
        fragments.push(headline.cloneNode(true));
      }
    }
    // News panel: add news list if present
    const newsList = body.querySelector('.panel__news-list');
    if (newsList) fragments.push(newsList.cloneNode(true));
    // CTA
    const cta = body.querySelector('.cta-btn');
    if (cta) fragments.push(cta.cloneNode(true));
    // Tags (for news panel)
    const tags = body.querySelector('.panel__tags');
    if (tags) fragments.push(tags.cloneNode(true));
    if (fragments.length === 0) return '';
    const div = document.createElement('div');
    fragments.forEach(frag => div.appendChild(frag));
    return div;
  }

  // Find all card columns (excluding empty ones)
  const cardColumns = Array.from(element.querySelectorAll('.row.panels > .col-sm-6, .row.panels > .col-md-4'));

  // Find the hero panel (desktop version preferred)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop') || element.querySelector('.narrow-hero__panel--mobile');

  // Build cards array
  const cards = [];

  // 1. Hero card (always first)
  if (heroPanel) {
    const img = getPanelImage(heroPanel);
    const text = getPanelText(heroPanel);
    cards.push([
      img ? img : '',
      text ? text : ''
    ]);
  }

  // 2. Other cards
  cardColumns.forEach(col => {
    let panel = col.querySelector('.panel');
    if (!panel && col.classList.contains('panel')) panel = col;
    if (panel) {
      const img = getPanelImage(panel);
      const text = getPanelText(panel);
      cards.push([
        img ? img : '',
        text ? text : ''
      ]);
    }
  });

  // Add header row
  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cards];

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace element
  element.replaceWith(blockTable);
}
