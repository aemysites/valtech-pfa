/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the three columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 3) return;

  // --- COLUMN 1 ---
  // Compose all content from the first column
  const col1 = columns[0];
  const col1Content = document.createElement('div');
  Array.from(col1.childNodes).forEach((node) => {
    // Only add nodes with visible content
    if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('*'))) {
      col1Content.appendChild(node);
    } else if (node.nodeType === 3 && node.textContent.trim()) {
      col1Content.appendChild(document.createTextNode(node.textContent));
    }
  });

  // --- COLUMN 2 ---
  // Compose all content from the second column
  const col2 = columns[1];
  const col2Content = document.createElement('div');
  Array.from(col2.childNodes).forEach((node) => {
    if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('*'))) {
      col2Content.appendChild(node);
    } else if (node.nodeType === 3 && node.textContent.trim()) {
      col2Content.appendChild(document.createTextNode(node.textContent));
    }
  });

  // --- COLUMN 3 ---
  // Only reference the image element (do not clone)
  const col3 = columns[2];
  const img = col3.querySelector('img');
  const col3Content = img || document.createElement('div');

  // Table header must match block name exactly
  const headerRow = ['Columns (columns88)'];
  // Table content row: 3 columns
  const contentRow = [col1Content, col2Content, col3Content];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
