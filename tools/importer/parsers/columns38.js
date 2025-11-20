/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns38)'];

  // Get all immediate child column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if we have columns
  if (!columns.length) return;

  // For each column, extract its content block (the .teasers__teaser div)
  const columnCells = columns.map(col => {
    // Find the teaser content div inside each column
    const teaser = col.querySelector('.teasers__teaser');
    // Defensive: fallback to the column itself if teaser not found
    return teaser || col;
  });

  // Build the table: header row, then one row with all columns
  const cells = [
    headerRow,
    columnCells
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
