/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns: 3 x .col-md-4, 1 x .col-md-3
  const columns = Array.from(element.querySelectorAll('.col-md-4, .col-md-3'));
  if (columns.length !== 4) return;

  // Build the table rows
  const cells = [
    ['Columns (columns15)'],
    columns.map(col => col)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
