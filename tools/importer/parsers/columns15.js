/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns15)'];

  // Defensive: Find the main container holding the four columns
  const container = element.querySelector('.container-fluid');
  if (!container) return;

  // Find the row containing the columns
  const mainRow = container.querySelector('.row');
  if (!mainRow) return;

  // Get all direct child columns (should be 2: left 3 columns, right 1 column)
  const topLevelCols = Array.from(mainRow.children).filter((child) => child.classList.contains('col-xs-landscape-6'));
  if (topLevelCols.length < 2) return;

  // Left columns (3 columns grouped)
  const leftColsContainer = topLevelCols[0];
  // Defensive: find the row inside the left columns container
  const leftColsRow = leftColsContainer.querySelector('.row');
  if (!leftColsRow) return;
  // Get the 3 left columns
  const leftCols = Array.from(leftColsRow.children).filter((child) => child.classList.contains('col-md-4'));

  // Right column (address + social)
  const rightCol = topLevelCols[1];

  // Helper to extract a column block (heading + list)
  function extractColumn(colElem) {
    const parts = [];
    // Heading (usually a <p> with class 'footer__heading')
    const heading = colElem.querySelector('.footer__heading');
    if (heading) parts.push(heading);
    // List (usually a <ul> with class 'footer__list')
    const list = colElem.querySelector('.footer__list');
    if (list) parts.push(list);
    return parts;
  }

  // Build the content row (4 columns)
  const contentRow = [];

  // First three columns: extract heading + list
  leftCols.forEach((colElem) => {
    const colContent = extractColumn(colElem);
    if (colContent.length) {
      contentRow.push(colContent);
    } else {
      // Fallback: push the whole column if structure changes
      contentRow.push(colElem);
    }
  });

  // Fourth column: address + social links
  const rightParts = [];
  // Heading
  const rightHeading = rightCol.querySelector('.footer__heading');
  if (rightHeading) rightParts.push(rightHeading);
  // Address
  const address = rightCol.querySelector('address');
  if (address) rightParts.push(address);
  // Social links (dl.share)
  const share = rightCol.querySelector('.share--footer');
  if (share) rightParts.push(share);
  if (rightParts.length) {
    contentRow.push(rightParts);
  } else {
    // Fallback: push the whole right column
    contentRow.push(rightCol);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
