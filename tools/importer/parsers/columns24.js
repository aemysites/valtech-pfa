/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns24)'];

  // Defensive: find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two column divs (left and right)
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-xs-12'));
  if (columns.length < 2) return;

  // Each column will be a cell in the table's second row
  // Use the entire column element for resilience
  const cellsRow = columns;

  // Build the table data
  const tableData = [headerRow, cellsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
