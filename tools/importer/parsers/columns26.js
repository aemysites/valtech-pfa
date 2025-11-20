/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child mat-card-content rows
  function getRows(card) {
    return Array.from(card.querySelectorAll(':scope > mat-card-content'));
  }

  // Helper to get columns within a row
  function getColumns(rowDiv) {
    return Array.from(rowDiv.querySelectorAll(':scope > div.cal-row > div'));
  }

  // Find the main card
  const card = element.querySelector('.mat-card');
  if (!card) return;

  // Get all filter sections (mat-card-content)
  const rows = getRows(card);

  // Prepare table rows
  const tableRows = [];

  // Always start with the block header
  const headerRow = ['Columns (columns26)'];
  tableRows.push(headerRow);

  // For each filter row (risk, climate)
  rows.forEach((matContent) => {
    const columns = getColumns(matContent);
    // Defensive: only process if there are exactly 2 columns (label, content)
    if (columns.length === 2) {
      // Left column: label (h4)
      const labelCol = columns[0];
      // Right column: slider and value(s)
      const contentCol = columns[1];
      // For the risk filter, there are two value blocks and a slider
      // For the climate filter, there is one slider and one value
      // We'll keep the full labelCol and contentCol for resilience
      tableRows.push([
        labelCol,
        contentCol
      ]);
    }
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
