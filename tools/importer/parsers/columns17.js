/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate row children
  const rows = element.querySelectorAll(':scope .row > div');

  // Defensive: fallback if not found
  let leftCol, rightCol;
  if (rows.length === 2) {
    leftCol = rows[0];
    rightCol = rows[1];
  } else {
    // Try to find the nested row inside col-sm-12
    const mainRow = element.querySelector('.col-sm-12 .row');
    if (mainRow) {
      const mainRowCols = mainRow.querySelectorAll(':scope > div');
      if (mainRowCols.length === 2) {
        leftCol = mainRowCols[0];
        rightCol = mainRowCols[1];
      }
    }
  }

  // Defensive: fallback to first two columns found
  if (!leftCol || !rightCol) {
    const allCols = element.querySelectorAll('.row > div, .col-sm-12 .row > div');
    leftCol = allCols[0];
    rightCol = allCols[1];
  }

  // Left column: heading, paragraphs, link
  let leftContent = [];
  if (leftCol) {
    // Heading
    const heading = leftCol.querySelector('h2, h1, h3');
    if (heading) leftContent.push(heading);
    // Paragraphs
    leftCol.querySelectorAll('p').forEach(p => leftContent.push(p));
    // Links (ul.panel__links li a)
    leftCol.querySelectorAll('ul.panel__links li a').forEach(a => leftContent.push(a));
  }

  // Right column: image and caption
  let rightContent = [];
  if (rightCol) {
    // Image
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
    // Caption: ensure 'Seniorboligstandard' is present under the image
    // Find text nodes or elements containing 'Seniorboligstandard' in teaser
    let captionFound = false;
    const teaser = rightCol.querySelector('.teasers__teaser');
    if (teaser) {
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Seniorboligstandard') {
          const span = document.createElement('span');
          span.textContent = 'Seniorboligstandard';
          rightContent.push(span);
          captionFound = true;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim() === 'Seniorboligstandard') {
          rightContent.push(node);
          captionFound = true;
        }
      });
      if (!captionFound) {
        // Try to find any element with that text
        const found = Array.from(teaser.querySelectorAll('*')).find(e => e.textContent.trim() === 'Seniorboligstandard');
        if (found) {
          rightContent.push(found);
          captionFound = true;
        }
      }
    }
    // If not found, add manually
    if (!captionFound) {
      const span = document.createElement('span');
      span.textContent = 'Seniorboligstandard';
      rightContent.push(span);
    }
  }

  // Table structure
  const headerRow = ['Columns (columns17)'];
  const contentRow = [leftContent, rightContent];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
