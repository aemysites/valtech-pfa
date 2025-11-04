/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the two main columns
  // Left: .col-xs-12.col-sm-9
  // Right: .col-xs-12.col-sm-3
  const leftCol = element.querySelector('.col-xs-12.col-sm-9');
  const rightCol = element.querySelector('.col-xs-12.col-sm-3');

  // Defensive: fallback if columns not found
  let columns = [];
  if (leftCol && rightCol) {
    columns = [leftCol, rightCol];
  } else {
    // Try fallback: find first two direct children with col- classes
    columns = Array.from(element.querySelectorAll('[class*="col-"]')).slice(0, 2);
    if (columns.length < 2) {
      // If still not found, treat entire element as one column
      columns = [element];
    }
  }

  // Table header
  const headerRow = ['Columns (columns6)'];

  // Build content row
  // Reference the actual column elements (do not clone)
  const contentRow = columns.map((col) => col);

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
