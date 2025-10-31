/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a panel
  function extractCard(panel) {
    // Find image (if present)
    const img = panel.querySelector('.panel__image img');
    // Find text content
    const body = panel.querySelector('.panel__body');
    // Only return a card if it has at least image or body and is not both empty
    if (img || (body && body.textContent.trim())) {
      return [img || '', body ? body : ''];
    }
    return null;
  }

  // Cards table header
  const headerRow = ['Cards (cards14)'];
  const rows = [];

  // Select all card columns
  const cols = Array.from(element.querySelectorAll('.row.panels > .col-sm-12, .row.panels > .col-sm-6, .row.panels > .col-md-4'));

  // Hero card (first .col-sm-12)
  const heroCol = cols.find(col => col.classList.contains('col-sm-12'));
  if (heroCol) {
    let heroPanel = heroCol.querySelector('.narrow-hero__panel--desktop') || heroCol.querySelector('.narrow-hero__panel--mobile');
    if (heroPanel) {
      const card = extractCard(heroPanel);
      if (card) rows.push(card);
    }
  }

  // Other cards
  cols.forEach(col => {
    // Podcast, Seniorliv, Investeringer, Green panel
    const panelImage = col.querySelector('.panel.panel--image');
    if (panelImage) {
      const card = extractCard(panelImage);
      if (card) rows.push(card);
      return;
    }
    // News panel
    const panelNews = col.querySelector('.panel.panel--news');
    if (panelNews) {
      const card = extractCard(panelNews);
      if (card) rows.push(card);
      return;
    }
    // Links panel
    const panelLinks = col.querySelector('.panel.panel--shortcuts-secondary');
    if (panelLinks) {
      const card = extractCard(panelLinks);
      if (card) rows.push(card);
      return;
    }
    // Green panel (no image, just text and button)
    const panelGreen = col.querySelector('.panel.panel--green');
    if (panelGreen) {
      const card = extractCard(panelGreen);
      if (card) rows.push(card);
      return;
    }
  });

  // Build table and replace (no empty rows)
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
