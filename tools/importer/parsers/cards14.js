/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a panel
  function extractCard(panel) {
    // Find image (if present)
    const img = panel.querySelector('.panel__image img');
    // Find text content
    const body = panel.querySelector('.panel__body');
    // Compose card cells
    return [img || '', body ? body : ''];
  }

  // Cards table header
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Select all card columns
  const cols = Array.from(element.querySelectorAll('.row.panels > .col-sm-12, .row.panels > .col-sm-6, .row.panels > .col-md-4'));

  // Hero card (first .col-sm-12)
  const heroCol = cols.find(col => col.classList.contains('col-sm-12'));
  if (heroCol) {
    let heroPanel = heroCol.querySelector('.narrow-hero__panel--desktop') || heroCol.querySelector('.narrow-hero__panel--mobile');
    if (heroPanel) {
      rows.push(extractCard(heroPanel));
    }
  }

  // Other cards
  cols.forEach(col => {
    // Podcast, Seniorliv, Investeringer, Green panel
    const panelImage = col.querySelector('.panel.panel--image');
    if (panelImage) {
      rows.push(extractCard(panelImage));
      return;
    }
    // News panel
    const panelNews = col.querySelector('.panel.panel--news');
    if (panelNews) {
      rows.push(extractCard(panelNews));
      return;
    }
    // Links panel
    const panelLinks = col.querySelector('.panel.panel--shortcuts-secondary');
    if (panelLinks) {
      rows.push(extractCard(panelLinks));
      return;
    }
    // Green panel (no image, just text and button)
    const panelGreen = col.querySelector('.panel.panel--green');
    if (panelGreen) {
      rows.push(extractCard(panelGreen));
      return;
    }
  });

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
