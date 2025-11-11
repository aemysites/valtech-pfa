/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns38)'];

  // Find all immediate column wrappers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process if we have columns
  if (!columns.length) return;

  // For each column, collect its content as a single cell
  const columnCells = columns.map((col) => {
    // Find the teaser content inside the column
    const teaser = col.querySelector('.teasers__teaser');
    // Defensive: If teaser not found, use the column itself
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
