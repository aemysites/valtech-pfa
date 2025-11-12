/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;

  // Get left and right columns
  const leftCol = mainRow.querySelector('.col-xs-12.col-sm-9');
  const rightCol = mainRow.querySelector('.col-xs-12.col-sm-3');

  // LEFT COLUMN: heading, all text, links, preserve <ul> structure only
  let leftContent = document.createElement('div');
  if (leftCol) {
    // Heading
    const heading = leftCol.querySelector('h2');
    if (heading) leftContent.appendChild(heading.cloneNode(true));
    // List links (all li)
    const ul = leftCol.querySelector('ul.panel__links');
    if (ul) {
      leftContent.appendChild(ul.cloneNode(true)); // preserve <ul> structure, no <hr>
    }
  }

  // RIGHT COLUMN: image and 'Middel' label from screenshot analysis
  let rightContent = document.createElement('div');
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.appendChild(img.cloneNode(true));
    // Always add the 'Middel' label below the image as per screenshot
    const label = document.createElement('div');
    label.textContent = 'Middel';
    rightContent.appendChild(label);
  }

  // Table header and row
  const headerRow = ['Columns (columns17)'];
  const contentRow = [leftContent, rightContent];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
