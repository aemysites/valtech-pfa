/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name
  const headerRow = ['Columns (columns53)'];

  // Defensive selectors for columns
  // Find the inner row containing the two columns
  const innerRow = element.querySelector('.row > .row');
  let leftCol, rightCol;
  if (innerRow) {
    // Two columns: left (sm-9), right (sm-3)
    leftCol = innerRow.querySelector('.col-sm-9');
    rightCol = innerRow.querySelector('.col-sm-3');
  } else {
    // Fallback: try to find columns directly
    const cols = element.querySelectorAll('.row > .col-sm-9, .row > .col-sm-3');
    leftCol = cols[0] || null;
    rightCol = cols[1] || null;
  }

  // LEFT COLUMN: Heading, paragraphs, link
  let leftContent = [];
  if (leftCol) {
    const teaser = leftCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Heading
      const heading = teaser.querySelector('h2');
      if (heading) leftContent.push(heading);
      // Paragraphs
      teaser.querySelectorAll('p').forEach(p => leftContent.push(p));
      // Links (ul.panel__links > li > a)
      teaser.querySelectorAll('ul.panel__links a').forEach(a => leftContent.push(a));
    }
  }

  // RIGHT COLUMN: Images (ignore empty spans)
  let rightContent = [];
  if (rightCol) {
    const teaser = rightCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Get all images inside teaser (ignore empty span)
      teaser.querySelectorAll('img').forEach(img => {
        rightContent.push(img);
      });
    }
  }

  // Compose table rows
  const contentRow = [leftContent, rightContent];
  const rows = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
