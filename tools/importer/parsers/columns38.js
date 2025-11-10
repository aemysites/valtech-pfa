/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns38)'];

  // Get all immediate column wrappers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only keep columns that have the expected teaser structure
  const teaserColumns = columns.filter(col => col.querySelector('.teasers__teaser'));

  // For each teaser column, extract the entire teaser block as a cell
  const cells = teaserColumns.map(col => {
    // Find the teaser content
    const teaser = col.querySelector('.teasers__teaser');
    // Defensive: If teaser is missing, fallback to the column itself
    return teaser || col;
  });

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
