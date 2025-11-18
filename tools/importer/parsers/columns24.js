/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for Columns block
  const headerRow = ['Columns (columns24)'];

  // Find the two column containers
  const row = element.querySelector('.row');
  if (!row) return;

  const columns = Array.from(row.children).filter(
    (col) => col.classList.contains('col-xs-12') && col.classList.contains('col-sm-6')
  );
  if (columns.length !== 2) return;

  // For each column, extract only its inner content (paragraphs, links, etc.), not the outer div
  const contentRow = columns.map(col => Array.from(col.childNodes));

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
