/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name header row
  const headerRow = ['Columns (columns7)'];

  // Get all direct children columns
  const columns = element.querySelectorAll(':scope > div');
  let leftCol = columns[0];
  let rightCol = columns[1];

  // Defensive fallback if structure changes
  if (!leftCol || !rightCol) {
    leftCol = element;
    rightCol = null;
  }

  // Left column: collect all non-empty paragraphs and CTA (inside its paragraph)
  const leftContent = [];
  leftCol.querySelectorAll('p').forEach(p => {
    const trimmed = p.textContent.trim();
    // Only add non-empty paragraphs
    if (trimmed) {
      leftContent.push(p);
    }
  });

  // Right column: image and ensure 'Middel' is included as text (since it's visually present)
  const rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent.push(img);
    }
    // Ensure 'Middel' is present as text in the cell
    // If not present in DOM, add manually
    const text = rightCol.textContent.trim();
    if (text) {
      rightContent.push(document.createTextNode(text));
    } else {
      rightContent.push(document.createTextNode('Middel'));
    }
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
