/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header row
  const headerRow = ['Columns (columns5)'];

  // Find the two column divs
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // LEFT COLUMN: Gather all non-empty content
  const leftCol = columns[0];
  const leftContent = [];
  leftCol.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Ignore empty .teasers__teaser divs
      if (
        node.classList.contains('teasers__teaser') &&
        !node.textContent.trim() &&
        !node.querySelector('img')
      ) {
        return;
      }
      leftContent.push(node);
    }
  });

  // RIGHT COLUMN: Find the image inside the teaser div
  const rightCol = columns[1];
  let rightContent = [];
  const teaserDiv = rightCol.querySelector('.teasers__teaser');
  if (teaserDiv) {
    const img = teaserDiv.querySelector('img');
    if (img) {
      rightContent = [img];
    }
  }

  // Build rows for the table
  const rows = [
    headerRow,
    [leftContent, rightContent],
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
