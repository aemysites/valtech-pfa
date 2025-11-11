/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content area
  let mainRow;
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));
  for (const div of topDivs) {
    const row = div.querySelector('.row.teasers');
    if (row) {
      mainRow = row;
      break;
    }
  }
  if (!mainRow) return;

  // Get the inner row with columns
  const innerRow = mainRow.querySelector('.row');
  if (!innerRow) return;
  const colDivs = Array.from(innerRow.children).filter(
    (el) => el.classList.contains('col-xs-12')
  );
  if (colDivs.length < 2) return;

  // Left column: heading and links
  const leftCol = colDivs[0];
  // Heading
  const heading = leftCol.querySelector('h2');
  // Links (ul.panel__links)
  const linksBlock = leftCol.querySelector('ul.panel__links');
  // Defensive: if linksBlock exists, use it; else, fallback to all anchors
  let linksContent;
  if (linksBlock) {
    linksContent = linksBlock;
  } else {
    const anchors = Array.from(leftCol.querySelectorAll('a'));
    if (anchors.length) {
      linksContent = document.createElement('div');
      anchors.forEach(a => linksContent.appendChild(a));
    }
  }
  // Compose left cell
  const leftCellContent = [];
  if (heading) leftCellContent.push(heading);
  if (linksContent) leftCellContent.push(linksContent);

  // Right column: image (circular chart) and label 'Lav'
  const rightCol = colDivs[1];
  let image = rightCol.querySelector('img');
  // Find the label 'Lav' (center of the chart)
  let lavLabel;
  // Try to find a text node or element with 'Lav'
  // Look inside h3 or teasers__teaser
  const h3 = rightCol.querySelector('h3');
  if (h3) {
    // Look for text nodes inside h3
    const text = h3.textContent.trim();
    if (text && text.toLowerCase() === 'lav') {
      lavLabel = document.createElement('span');
      lavLabel.textContent = text;
    } else {
      // Sometimes the label is not direct text, check children
      Array.from(h3.childNodes).forEach((node) => {
        if (node.nodeType === 3 && node.textContent.trim().toLowerCase() === 'lav') {
          lavLabel = document.createElement('span');
          lavLabel.textContent = node.textContent.trim();
        }
      });
    }
  }
  // Compose right cell
  const rightCellContent = [];
  if (image) rightCellContent.push(image);
  if (lavLabel) rightCellContent.push(lavLabel);
  // If not found, try to find any element with 'Lav' text
  if (!lavLabel) {
    const possibleLabel = rightCol.querySelector('*:not(img):not(h3)');
    if (possibleLabel && possibleLabel.textContent.trim().toLowerCase() === 'lav') {
      const span = document.createElement('span');
      span.textContent = possibleLabel.textContent.trim();
      rightCellContent.push(span);
    }
  }

  // Table structure
  const headerRow = ['Columns (columns18)'];
  const contentRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
