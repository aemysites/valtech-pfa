/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns62)'];

  // Defensive: Find the direct columns container
  const teasersRow = element.querySelector('.row.teasers');
  if (!teasersRow) return;

  // Find all column items (each .icon-and-text__link)
  const columns = Array.from(teasersRow.querySelectorAll('.icon-and-text__link'));
  if (!columns.length) return;

  // Each column cell will contain the whole link element (icon + text)
  const contentRow = columns.map((col) => col);

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
