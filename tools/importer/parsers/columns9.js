/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns9)'];

  // Defensive: Get immediate children columns
  const columns = element.querySelectorAll(':scope > div');
  // Expecting two columns: left (text), right (image)
  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    // Fallback: treat all children as a single row
    leftCol = element;
    rightCol = null;
  }

  // LEFT COLUMN: Gather heading, paragraphs, and link
  // Defensive: Find heading, paragraphs, and links inside leftCol
  let leftContent = [];
  // Heading (h5 or h3/h4)
  const heading = leftCol.querySelector('h5, h3, h4');
  if (heading) leftContent.push(heading);
  // Paragraphs
  leftCol.querySelectorAll('p').forEach(p => leftContent.push(p));
  // Standalone links not inside paragraphs
  leftCol.querySelectorAll('a:not(p a)').forEach(a => leftContent.push(a));

  // If nothing found, fallback to all children
  if (leftContent.length === 0) {
    leftContent = Array.from(leftCol.childNodes).filter(n => n.nodeType === 1);
  }

  // RIGHT COLUMN: Find image (img)
  let rightContent = [];
  if (rightCol) {
    // Find image inside rightCol
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
    // If no image, fallback to all children
    if (rightContent.length === 0) {
      rightContent = Array.from(rightCol.childNodes).filter(n => n.nodeType === 1);
    }
  }

  // Compose table rows
  const contentRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}
