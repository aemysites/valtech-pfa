/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: 2 columns, header row, each card = [image/icon, text]
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Select all card columns (each card)
  const cardEls = element.querySelectorAll('.col-xs-12.col-sm-4');
  cardEls.forEach((cardEl) => {
    // Find image/icon (first img inside card)
    const img = cardEl.querySelector('img');
    // Find title (first h4 inside card)
    const title = cardEl.querySelector('h4');
    // Defensive: fallback if h4 not found, try strong, p, or get text
    let textContent = title;
    if (!textContent) {
      textContent = cardEl.querySelector('strong, p');
    }
    if (!textContent) {
      // fallback: get all text
      textContent = document.createElement('div');
      textContent.textContent = cardEl.textContent.trim();
    }
    // Each card row: [image/icon, text]
    rows.push([
      img,
      textContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
