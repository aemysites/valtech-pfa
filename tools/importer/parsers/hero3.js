/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero3) block parsing
  // 1 column, 3 rows: [header], [image], [content]

  // Header row: must match target block name exactly
  const headerRow = ['Hero (hero3)'];

  // --- IMAGE ROW ---
  // Find the image element in the hero block
  let imgEl = element.querySelector('.panel__image img');
  // Defensive fallback: if not found, try any img inside
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }
  // Only reference the existing image element (do not clone or create new)
  const imageRow = [imgEl ? imgEl : ''];

  // --- CONTENT ROW ---
  // Find the main headline (h1 preferred)
  let headlineEl = element.querySelector('.panel__body .panel__headline');
  if (!headlineEl) {
    headlineEl = element.querySelector('h1, h2, h3');
  }
  // Compose the content cell: only headline present in this HTML
  const contentCell = [];
  if (headlineEl) contentCell.push(headlineEl);
  // No subheading or CTA in this source HTML
  const contentRow = [contentCell];

  // --- TABLE ASSEMBLY ---
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
