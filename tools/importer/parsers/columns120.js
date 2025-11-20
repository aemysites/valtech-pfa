/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns within the .row
  const row = element.querySelector('.row .row');
  let columns = [];
  if (row) {
    columns = Array.from(row.children).filter((col) => col.classList.contains('col'));
  }

  // Fallback: try direct children of .row if nested .row not found
  if (columns.length === 0) {
    const outerRow = element.querySelector('.row');
    if (outerRow) {
      columns = Array.from(outerRow.children).filter((col) => col.classList.contains('col'));
    }
  }

  // Defensive: fallback to any .col found inside element
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('.col'));
  }

  // If still not found, fallback to all direct children divs
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Ensure we have at least two columns
  if (columns.length < 2) return;

  // Table header must match block name exactly
  const headerRow = ['Columns (columns120)'];
  const contentRow = columns.map((col) => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
