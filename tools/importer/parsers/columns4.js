/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns4)'];

  // Find the two columns
  const outerRow = element.querySelector('.row.teasers > .row');
  let leftCol, rightCol;
  if (outerRow) {
    const cols = outerRow.querySelectorAll(':scope > div');
    leftCol = cols[0];
    rightCol = cols[1];
  } else {
    // fallback: try to find columns directly
    const cols = element.querySelectorAll('.row.teasers > .col-xs-12');
    leftCol = cols[0];
    rightCol = cols[1];
  }

  // Defensive: fallback if not found
  if (!leftCol || !rightCol) {
    const fallbackCols = element.querySelectorAll(':scope > div > .row > div');
    leftCol = fallbackCols[0];
    rightCol = fallbackCols[1];
  }

  // Left column: heading + paragraphs (only visible heading)
  let leftContent = [];
  if (leftCol) {
    // Only include h2 that is visible (not display:none)
    const headings = Array.from(leftCol.querySelectorAll('h2'));
    const visibleHeading = headings.find(h => !h.hasAttribute('style') || !h.getAttribute('style').includes('display:none'));
    if (visibleHeading) leftContent.push(visibleHeading);
    const paragraphs = leftCol.querySelectorAll('p');
    paragraphs.forEach(p => leftContent.push(p));
  }

  // Right column: images (include all images in rightCol)
  let rightContent = [];
  if (rightCol) {
    // Get all images inside rightCol, including nested divs
    rightCol.querySelectorAll('img').forEach(img => rightContent.push(img));
    // FIX: If images are not direct children, check all descendants
    if (rightContent.length === 0) {
      Array.from(rightCol.querySelectorAll('*')).forEach(node => {
        if (node.tagName === 'IMG') rightContent.push(node);
      });
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
