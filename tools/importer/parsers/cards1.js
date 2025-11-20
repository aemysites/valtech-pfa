/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract CTA as a link from a container
  function extractCTA(container) {
    // Look for a CTA button or link
    let cta = container.querySelector('.cta-btn, a.cta-btn');
    if (cta && cta.closest('a')) return cta.closest('a');
    if (cta && cta.tagName === 'A') return cta;
    // fallback: look for a single link that is not just a list item
    const links = Array.from(container.querySelectorAll('a[href]'));
    const link = links.find(l => !l.closest('ul')) || links[0];
    if (link) return link;
    return null;
  }

  // Helper to extract all text content from a container, ensuring links are preserved
  function extractTextContent(container) {
    const fragments = [];
    // Kicker
    const kicker = container.querySelector('.panel__kicker');
    if (kicker) fragments.push(kicker);
    // Headline (h1, h2, h3, .panel__headline)
    const headline = container.querySelector('h1, h2, h3, .panel__headline');
    if (headline) fragments.push(headline);
    // Any <p> or <span> that isn't kicker, headline, or cta
    Array.from(container.querySelectorAll('p, span')).forEach(el => {
      if (
        el !== kicker &&
        el !== headline &&
        !el.classList.contains('cta-btn') &&
        !el.closest('.cta-btn') &&
        !el.closest('.panel__tags') // skip tags, handled separately
      ) {
        fragments.push(el);
      }
    });
    // News list (for news panel)
    const newsList = container.querySelector('.panel__news-list');
    if (newsList) fragments.push(newsList);
    // Tags (for news panel)
    const tags = container.querySelector('.panel__tags');
    if (tags) fragments.push(tags);
    // CTA as link
    const ctaLink = extractCTA(container);
    if (ctaLink) fragments.push(ctaLink);
    return fragments;
  }

  // Helper to extract image from a card column (mandatory for each card)
  function extractImage(col) {
    const imgPanel = col.querySelector('.panel.panel--image');
    if (imgPanel) {
      const img = imgPanel.querySelector('.panel__image img');
      if (img) return img;
    }
    // For non-image panels, use a color block as a placeholder
    if (col.querySelector('.panel.panel--primary')) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '100px';
      colorDiv.style.height = '100px';
      colorDiv.style.background = '#a1001e'; // Red for primary
      colorDiv.style.display = 'block';
      colorDiv.style.borderRadius = '8px';
      return colorDiv;
    }
    if (col.querySelector('.panel.panel--green')) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '100px';
      colorDiv.style.height = '100px';
      colorDiv.style.background = '#006d6a'; // Green for green
      colorDiv.style.display = 'block';
      colorDiv.style.borderRadius = '8px';
      return colorDiv;
    }
    if (col.querySelector('.panel.panel--tertiary')) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '100px';
      colorDiv.style.height = '100px';
      colorDiv.style.background = '#fff'; // White for tertiary
      colorDiv.style.display = 'block';
      colorDiv.style.border = '2px solid #a1001e';
      colorDiv.style.borderRadius = '8px';
      return colorDiv;
    }
    // News panel: use a color block for news
    if (col.querySelector('.panel--news')) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '100px';
      colorDiv.style.height = '100px';
      colorDiv.style.background = '#f4f4f4'; // Light gray for news
      colorDiv.style.display = 'block';
      colorDiv.style.borderRadius = '8px';
      colorDiv.style.border = '1px solid #ccc';
      return colorDiv;
    }
    return null;
  }

  // Find all cards in the panels row
  const panelsRow = element.querySelector('.row.panels');
  if (!panelsRow) return;
  const cardElements = [];

  // Always include the hero card as the first card
  const heroDesktop = panelsRow.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) {
    // Image
    const imgDiv = heroDesktop.querySelector('.panel__image img');
    // Text
    const body = heroDesktop.querySelector('.panel__body');
    const textCell = extractTextContent(body);
    cardElements.push([imgDiv, textCell]);
  }

  // Find all direct child columns (excluding the hero)
  const cols = Array.from(panelsRow.children)
    .filter(col => col.classList.contains('col-sm-6') || col.classList.contains('col-sm-4'));

  cols.forEach(col => {
    // Try to extract image or color block
    const img = extractImage(col);
    // Text content
    let body = col.querySelector('.panel__body');
    if (!body) {
      // For panels with no .panel__body, fallback to col itself
      body = col;
    }
    const textCell = extractTextContent(body);
    cardElements.push([
      img || '',
      textCell
    ]);
  });

  // Compose table rows
  const rows = [
    ['Cards (cards1)'] // header
  ];
  cardElements.forEach(([img, text]) => {
    // Only add rows that have at least one non-empty cell
    if (img || (Array.isArray(text) && text.length > 0)) {
      rows.push([
        img || '',
        Array.isArray(text) ? text.filter(Boolean) : text
      ]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
