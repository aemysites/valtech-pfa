/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns30)'];

  // Defensive: get immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two columns: left (text), right (image)
  let leftContent = null;
  let rightContent = null;

  if (columns.length === 2) {
    // Left column: find first .col-xs-12.col-sm-8
    const leftCol = columns[0];
    // Defensive: find the teaser content (may be nested)
    const teaser = leftCol.querySelector('.teasers__teaser') || leftCol;
    leftContent = Array.from(teaser.childNodes).filter(node => {
      // Only keep elements and meaningful text
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // If only one node, don't wrap in array
    if (leftContent.length === 1) leftContent = leftContent[0];
  }

  if (columns.length === 2) {
    // Right column: find first .col-xs-12.col-sm-4
    const rightCol = columns[1];
    // Defensive: find image inside paragraph
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent = img;
    } else {
      // Fallback: use all content
      rightContent = Array.from(rightCol.childNodes).filter(node => {
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      if (rightContent.length === 1) rightContent = rightContent[0];
    }
  }

  // Build table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
