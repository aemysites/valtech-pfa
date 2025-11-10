/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns30)'];

  // Defensive: Get immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two columns: left (text), right (image)
  // Left column: find the first .col-xs-12.col-sm-8 (text)
  // Right column: find the first .col-xs-12.col-sm-8 (text)
  let leftCol = columns.find(col => col.classList.contains('col-sm-8'));
  let rightCol = columns.find(col => col.classList.contains('col-sm-4'));

  // Defensive fallback if not found
  if (!leftCol) leftCol = columns[0];
  if (!rightCol) rightCol = columns[1];

  // Left column: extract all content (preserve semantic structure)
  const leftContent = Array.from(leftCol.childNodes);

  // Right column: extract image (preserve reference)
  // Find the first img in rightCol
  const img = rightCol.querySelector('img');
  let rightContent = [];
  if (img) {
    rightContent.push(img);
    // If there is other meaningful content, include it
    rightCol.childNodes.forEach(node => {
      if (node !== img && node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
        rightContent.push(node);
      }
    });
  } else {
    rightContent = Array.from(rightCol.childNodes);
  }

  // Build table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with table
  element.replaceWith(table);
}
