/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero117)'];

  // --- IMAGE ROW ---
  // Find the image in the right column (.col-sm-3)
  let imageCell = [''];
  const imageCol = element.querySelector('.col-sm-3');
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) imageCell = [img];
  }

  // --- CONTENT ROW ---
  // Find the main content column (.col-sm-7)
  const mainCol = element.querySelector('.col-sm-7');
  const contentCell = [];
  if (mainCol) {
    // Get all children of .teasers__teaser (text and CTA)
    const teaser = mainCol.querySelector('.teasers__teaser');
    if (teaser) {
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
          // Only include non-empty elements (skip empty divs)
          if (!(node.nodeType === 1 && node.tagName === 'DIV' && !node.textContent.trim())) {
            contentCell.push(node);
          }
        }
      });
    }
    // Also check for CTA in nested .col-xs-12.text-left
    const ctaDiv = mainCol.querySelector('.col-xs-12.text-left');
    if (ctaDiv) {
      Array.from(ctaDiv.childNodes).forEach(node => {
        // Only include anchor tags or non-empty text nodes
        if (node.nodeType === 1 && node.tagName === 'A') {
          contentCell.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          contentCell.push(node);
        }
      });
    }
  }

  // --- TABLE ASSEMBLY ---
  const rows = [
    headerRow,
    imageCell,
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
