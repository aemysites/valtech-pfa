/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns72)'];

  // Get all immediate child anchor tags (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > a.btn--icon-rm'));

  // Defensive: If no columns found, do nothing
  if (!columns.length) return;

  // For each column, preserve the anchor tag wrapping icon and text
  const cells = columns.map(col => {
    // Clone the anchor element and remove any unwanted line breaks
    const anchor = col.cloneNode(true);
    // Remove <br> tags for cleaner output
    anchor.querySelectorAll('br').forEach(br => br.remove());
    return anchor;
  });

  // Table rows: header, then one row with all columns
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
