/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns95)'];

  // Find the two column elements
  // Defensive: columns are .row-flex_col inside .row-flex
  const columns = Array.from(element.querySelectorAll('.row-flex > .row-flex_col'));

  // For each column, extract the full teaser block
  // Each .row-flex_col contains a .teasers__teaser with image, h2, paragraphs, and CTA
  const columnCells = columns.map((col) => {
    // Find the teaser block inside this column
    const teaser = col.querySelector('.teasers__teaser');
    // Defensive: if not found, fallback to the column itself
    return teaser || col;
  });

  // Build the table rows
  const rows = [
    headerRow,
    columnCells,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
