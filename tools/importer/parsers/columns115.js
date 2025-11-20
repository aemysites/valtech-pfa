/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Header row
  const headerRow = ['Columns (columns115)'];

  // Left column: main content
  const leftCol = columns[0];
  const leftTeaser = leftCol.querySelector('.teasers__teaser') || leftCol;
  const leftCellContent = Array.from(leftTeaser.childNodes).filter(node => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
    return true;
  });

  // Right column: include ALL images (panel-bg.jpg and plaster icon)
  const rightCol = columns[1];
  const rightTeaser = rightCol.querySelector('.teasers__teaser') || rightCol;
  const rightCellContent = Array.from(rightTeaser.querySelectorAll('img'));

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCellContent, rightCellContent]
  ], document);

  element.replaceWith(table);
}
