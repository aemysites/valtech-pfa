/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns7)'];

  // Defensive: get direct children columns
  const columns = element.querySelectorAll(':scope > div');

  // There should be two columns: left (text + button), right (image)
  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    leftCol = element;
    rightCol = null;
  }

  // Left column: collect all paragraphs and CTA
  const leftContent = [];
  leftCol.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      if (node.tagName === 'P' || node.tagName === 'DIV') {
        leftContent.push(node);
      }
    }
  });
  if (leftContent.length === 0) {
    leftContent.push(leftCol);
  }

  // Right column: find the image and add 'Middel' text
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent.push(img);
      // Add the visually present text 'Middel' from the screenshot
      const middelText = document.createElement('div');
      middelText.textContent = 'Middel';
      middelText.style.textAlign = 'center';
      middelText.style.marginTop = '8px';
      rightContent.push(middelText);
    }
  }

  // Table rows: header, then one row with two columns
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
