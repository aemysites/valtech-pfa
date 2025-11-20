/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns67)'];

  // Defensive: Get the main row containing the two columns
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;

  // Get the left and right column elements
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: image
  const leftCol = columns[0];
  const leftTeaser = leftCol.querySelector('.teasers__teaser');
  let leftCellContent = [];
  if (leftTeaser) {
    // Find the image inside the teaser
    const img = leftTeaser.querySelector('img');
    if (img) leftCellContent.push(img);
  }

  // Right column: blockquote
  const rightCol = columns[1];
  const rightTeaser = rightCol.querySelector('.teasers__teaser');
  let rightCellContent = [];
  if (rightTeaser) {
    // Find the blockquote inside the teaser
    const blockquote = rightTeaser.querySelector('blockquote');
    if (blockquote) rightCellContent.push(blockquote);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
