/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;
  const leftCol = mainRow.querySelector('.col-sm-9');
  const rightCol = mainRow.querySelector('.col-sm-3');
  if (!leftCol || !rightCol) return;

  // LEFT COLUMN: Heading and list of links
  const heading = leftCol.querySelector('h2.teasers__teaser');
  const linksList = leftCol.querySelector('ul.panel__links');
  const leftCellContent = [];
  if (heading) leftCellContent.push(heading);
  if (linksList) leftCellContent.push(linksList);

  // RIGHT COLUMN: Image and the visible text 'Lav'
  const rightImg = rightCol.querySelector('img');
  const rightCellContent = [];
  if (rightImg) {
    // Create a wrapper div to hold the image and the text 'Lav'
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.textAlign = 'center';
    wrapper.appendChild(rightImg.cloneNode(true));
    // Add the visible text 'Lav' under or overlaying the image
    const lavText = document.createElement('div');
    lavText.textContent = 'Lav';
    lavText.style.marginTop = '8px';
    lavText.style.fontWeight = 'bold';
    wrapper.appendChild(lavText);
    rightCellContent.push(wrapper);
  }

  // Build table rows
  const headerRow = ['Columns (columns18)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
