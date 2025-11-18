/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns7)'];

  // Get direct children divs (columns)
  const columns = element.querySelectorAll(':scope > div');

  let leftCol, rightCol;
  if (columns.length === 2) {
    leftCol = columns[0];
    rightCol = columns[1];
  } else {
    leftCol = element;
    rightCol = null;
  }

  // Left column: gather all non-empty paragraphs and CTA
  const leftContent = [];
  leftCol.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim()) {
      leftContent.push(p);
    }
  });
  const cta = leftCol.querySelector('a.cta-btn');
  if (cta && !leftContent.includes(cta)) {
    leftContent.push(cta);
  }

  // Right column: image only, add visible label 'Middel' below image
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent.push(img);
      // Add visible label below image
      const label = document.createElement('div');
      label.textContent = 'Middel';
      rightContent.push(label);
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
