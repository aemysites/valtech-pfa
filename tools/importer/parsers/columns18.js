/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const mainRow = element.querySelector('.row.teasers .col-sm-12 > .row');
  if (!mainRow) return;
  const cols = mainRow.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: text content
  const leftCol = cols[0];
  const leftContent = [];

  // Heading (h4)
  const h4 = leftCol.querySelector('h4.teasers__teaser');
  if (h4) leftContent.push(h4);

  // All .teasers__teaser divs and p's (excluding empty divs)
  leftCol.querySelectorAll('.teasers__teaser').forEach((el) => {
    if (el.textContent.trim() || el.querySelector('ul')) {
      leftContent.push(el);
    }
  });

  // Any direct .teasers__teaser p elements
  leftCol.querySelectorAll(':scope > p.teasers__teaser').forEach((el) => {
    leftContent.push(el);
  });

  // Right column: images only
  const rightCol = cols[1];
  const rightContent = [];
  rightCol.querySelectorAll('img').forEach((img) => {
    rightContent.push(img);
  });

  // Create the table with correct block name header
  const headerRow = ['Columns (columns18)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
