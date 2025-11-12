/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns26)'];

  // Helper to extract a row with two columns: left label, right content
  function extractRow(rowEl) {
    // Defensive: get direct children columns
    const columns = Array.from(rowEl.querySelectorAll(':scope > .cal-column'));
    if (columns.length !== 2) return [rowEl.cloneNode(true), '']; // fallback: single cell

    // Left column: usually just a heading
    const left = columns[0];
    // Right column: slider and labels
    const right = columns[1];

    // For left: grab all children (usually h4)
    const leftContent = Array.from(left.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    // For right: grab all children (labels, slider, etc)
    const rightContent = Array.from(right.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

    return [leftContent, rightContent];
  }

  // Find all rows within the block
  // Each mat-card-content contains one row
  const cardContents = Array.from(element.querySelectorAll('mat-card-content'));
  const rows = [];
  cardContents.forEach(cardContent => {
    const rowEl = cardContent.querySelector('.cal-row');
    if (rowEl) {
      rows.push(extractRow(rowEl));
    }
  });

  // Compose the table: header + rows
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element with the block table
  element.replaceWith(blockTable);
}
