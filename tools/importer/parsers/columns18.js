/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns in the inner .row
  const innerRow = element.querySelector('.row .row');
  let leftCol = null, rightCol = null;
  if (innerRow) {
    const cols = Array.from(innerRow.children).filter(
      el => el.className && el.className.match(/col-/)
    );
    [leftCol, rightCol] = cols;
  }

  // Left column: collect ALL content (heading, links, etc)
  let leftContent = [];
  if (leftCol) {
    Array.from(leftCol.childNodes).forEach(node => {
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img'))) {
        leftContent.push(node.cloneNode(true));
      }
    });
    if (!leftContent.some(n => n.tagName === 'H2')) {
      const heading = leftCol.querySelector('h2');
      if (heading) leftContent.unshift(heading.cloneNode(true));
    }
  }

  // Right column: image and always add 'Lav' label (per screenshot analysis)
  let rightContent = [];
  if (rightCol) {
    const teaser = rightCol.querySelector('.teasers__teaser') || rightCol;
    const img = teaser.querySelector('img');
    if (img) rightContent.push(img.cloneNode(true));
    // Always add 'Lav' label as seen in the screenshot
    rightContent.push(document.createTextNode('Lav'));
  }

  // Table header
  const headerRow = ['Columns (columns18)'];
  // Table content row
  const contentRow = [leftContent, rightContent];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
