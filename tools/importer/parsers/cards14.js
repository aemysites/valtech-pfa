/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image or color block/icon for a card
  function extractVisual(card) {
    // Try image first
    const imgDiv = card.querySelector('.panel__image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) return img;
    }
    // If no image, use a color block for cards with strong background
    const panel = card.closest('.panel') || card;
    let color = '';
    if (panel.classList.contains('panel--primary')) color = '#a4001a'; // red
    else if (panel.classList.contains('panel--green')) color = '#007a7a'; // teal
    else if (panel.classList.contains('panel--tertiary')) color = '#fff'; // white
    else if (panel.classList.contains('panel--news')) color = '#fff'; // news card
    // If color is set, create a colored div
    if (color) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '48px';
      colorDiv.style.height = '48px';
      colorDiv.style.background = color;
      colorDiv.style.borderRadius = '8px';
      colorDiv.style.display = 'inline-block';
      colorDiv.title = 'Color block';
      return colorDiv;
    }
    // If nothing, use a non-breaking space
    return document.createTextNode('\u00A0');
  }

  // Helper to extract text content from a card
  function extractText(card) {
    const body = card.querySelector('.panel__body');
    if (!body) return '';
    const fragments = [];
    // Kicker
    const kicker = body.querySelector('.panel__kicker');
    if (kicker) fragments.push(kicker);
    // Headline (h1 or h2)
    let headline = body.querySelector('.panel__headline');
    if (headline) {
      if (headline.querySelector('p')) {
        headline.querySelectorAll('p').forEach(p => fragments.push(p));
      } else {
        fragments.push(headline);
      }
    }
    // News list (for news card)
    const newsList = body.querySelector('.panel__news-list');
    if (newsList) fragments.push(newsList);
    // Tags (for 'Se flere nyheder' link)
    const tags = body.querySelector('.panel__tags');
    if (tags) fragments.push(tags);
    // CTA button
    const cta = body.querySelector('.cta-btn');
    if (cta) fragments.push(cta);
    // For cards with only headline (no kicker, no CTA)
    if (fragments.length === 0) {
      const altHeadline = card.querySelector('.panel__headline');
      if (altHeadline) fragments.push(altHeadline);
    }
    return fragments.length ? fragments : '';
  }

  // Find all cards in the block
  const cards = [];
  // Hero card (desktop)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) cards.push(heroDesktop);
  // All grid cards
  const panelCols = element.querySelectorAll('.row.panels > [class*="col-"]');
  panelCols.forEach(col => {
    const panel = col.querySelector('.panel');
    if (panel && !panel.classList.contains('narrow-hero__panel--mobile')) {
      cards.push(panel);
    }
  });

  // Table header
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Parse each card
  cards.forEach(card => {
    const visual = extractVisual(card);
    const textContent = extractText(card);
    // Only add rows that have at least one non-empty cell (no empty rows)
    const isVisualEmpty = (visual instanceof Text && visual.textContent.trim() === '') || (!visual);
    const isTextEmpty = !textContent || (Array.isArray(textContent) && textContent.length === 0);
    // Do not add row if both cells are a non-breaking space or empty
    if (!(visual instanceof Text && visual.textContent === '\u00A0' && isTextEmpty)) {
      if (!(isVisualEmpty && isTextEmpty)) {
        rows.push([visual, textContent]);
      }
    }
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
