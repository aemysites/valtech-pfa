/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards11)'];

  // Find all card columns (each card is a col-xs-12 col-sm-4)
  const cardNodes = Array.from(element.querySelectorAll('.col-xs-12.col-sm-4'));

  // Defensive: If no cards found, do nothing
  if (!cardNodes.length) return;

  // For each card, extract image and text content
  const rows = cardNodes.map(card => {
    // Image: find first img inside card
    const img = card.querySelector('img');

    // Text: find heading (h4) inside card
    const heading = card.querySelector('h4');

    // Compose text cell: if heading exists, use it; else fallback to text
    let textCell;
    if (heading) {
      textCell = heading;
    } else {
      // Fallback: use all text content inside card
      textCell = document.createElement('div');
      textCell.textContent = card.textContent.trim();
    }

    return [img, textCell];
  });

  // Build table rows: header + card rows
  const tableRows = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element with block table
  element.replaceWith(blockTable);
}
