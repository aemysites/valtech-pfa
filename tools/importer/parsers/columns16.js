/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if the element is a UL with class panel__links
  if (!element || element.tagName !== 'UL' || !element.classList.contains('panel__links')) return;

  // Get all direct LI children
  const items = Array.from(element.children).filter(child => child.tagName === 'LI');

  // Get all anchor elements from each LI
  const links = items.map(li => li.querySelector('a')).filter(Boolean);

  // Group links for each column based on their visual grouping in the screenshot
  // Left column: all 'PFA Plus...' links, Right column: all 'PFA Klima Plus...' links
  const col1 = links.filter(a => a.textContent.includes('PFA Plus'));
  const col2 = links.filter(a => a.textContent.includes('PFA Klima Plus'));
  const rowCount = Math.max(col1.length, col2.length);

  // Build rows: each row contains one cell per column
  const cells = [['Columns (columns16)']]; // Header row
  for (let i = 0; i < rowCount; i++) {
    cells.push([
      col1[i] || '',
      col2[i] || ''
    ]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
