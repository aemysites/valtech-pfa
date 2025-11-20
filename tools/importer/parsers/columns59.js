/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- LEFT COLUMN: main image and all content ---
  const leftDiv = columns[0];
  // Collect all direct children (including images and links)
  const leftCellContent = [];
  Array.from(leftDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      leftCellContent.push(node.cloneNode(true));
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      leftCellContent.push(document.createTextNode(node.textContent));
    }
  });

  // --- RIGHT COLUMN: include all text, captions, links, images ---
  const rightDiv = columns[1];
  const rightCellContent = [];
  Array.from(rightDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      rightCellContent.push(node.cloneNode(true));
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      rightCellContent.push(document.createTextNode(node.textContent));
    }
  });

  // --- TABLE CONSTRUCTION ---
  const headerRow = ['Columns (columns59)'];
  const contentRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
