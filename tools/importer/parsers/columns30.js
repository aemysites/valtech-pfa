/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns30)'];

  // Defensive: Get immediate children that are columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two columns: left (text), right (image)
  let leftContent = null;
  let rightContent = null;

  if (columns.length === 2) {
    // Left column: likely contains a teaser div with a paragraph
    const leftCol = columns[0];
    // Find first paragraph inside left column
    leftContent = leftCol.querySelector('p') || leftCol;

    // Right column: likely contains a centered image
    const rightCol = columns[1];
    // Find first image inside right column
    rightContent = rightCol.querySelector('img') || rightCol;
  } else {
    // Fallback: treat all content as a single column
    leftContent = element;
    rightContent = '';
  }

  // Content row: two columns, text and image
  const contentRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
