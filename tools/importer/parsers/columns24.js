/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns24)'];

  // Defensive: Get all direct children of the main row
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate column divs
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-xs-12'));

  // Defensive: If no columns found, do nothing
  if (columns.length < 2) return;

  // Prepare the cells for the content row
  // Each column's content is grouped as a single cell
  const contentRow = columns.map(col => col);

  // Table structure: header row, then one row with two columns
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
