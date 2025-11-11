/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards34) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Find all card columns (each card is inside .col-xs-12.col-sm-1 or .col-xs-12.col-sm-10)
  // The main card content is in the center column (.col-xs-12.col-sm-10)
  const centerCol = element.querySelector('.col-xs-12.col-sm-10');
  if (centerCol) {
    // Find the image from either left or right columns
    let img = null;
    const sideCols = element.querySelectorAll('.col-xs-12.col-sm-1');
    for (const col of sideCols) {
      const foundImg = col.querySelector('img');
      if (foundImg) {
        img = foundImg;
        break;
      }
    }

    // Get all content from the center teaser
    const teaser = centerCol.querySelector('.teasers__teaser');
    const textContent = [];
    if (teaser) {
      // Get all child elements (to ensure all text is included)
      teaser.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textContent.push(node);
        }
      });
    }

    rows.push([
      img ? img : '',
      textContent
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
