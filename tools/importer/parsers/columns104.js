/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name
  const headerRow = ['Columns (columns104)'];

  // Get immediate children columns
  const columns = element.querySelectorAll(':scope > div');
  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    leftCol = element;
    rightCol = null;
  }

  // --- LEFT COLUMN ---
  const teaser = leftCol.querySelector('.teasers__teaser') || leftCol;

  // --- RIGHT COLUMN ---
  let rightCellContent = [];
  if (rightCol) {
    // Convert iframe to link (requirement)
    const iframe = rightCol.querySelector('iframe');
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      // Use the iframe title if present, otherwise fallback to generic text
      link.textContent = iframe.title && iframe.title.trim() ? iframe.title : 'Lyt til episoden';
      rightCellContent.push(link);
    }
    // Include images (podcast cover)
    const images = rightCol.querySelectorAll('img');
    images.forEach(img => rightCellContent.push(img));
    // Include visible text nodes and elements not inside iframe or img
    Array.from(rightCol.childNodes).forEach(node => {
      // Only include non-empty text nodes and elements that are not iframe or img
      if (
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
      ) {
        rightCellContent.push(node.textContent.trim());
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName !== 'IFRAME' &&
        node.tagName !== 'IMG' &&
        node.textContent.trim() !== ''
      ) {
        rightCellContent.push(node.cloneNode(true));
      }
    });
  }
  // If no content found, fallback to empty cell
  if (rightCellContent.length === 0) {
    rightCellContent = [''];
  }

  // Build table rows
  const cells = [headerRow, [teaser, rightCellContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
