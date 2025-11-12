/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing columns
  let mainRow = element.querySelector('.row.teasers');
  if (!mainRow) mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Find the columns inside the row
  const innerRow = mainRow.querySelector('.row');
  if (!innerRow) return;
  const leftCol = innerRow.querySelector('.col-sm-8');
  const rightCol = innerRow.querySelector('.col-sm-4');
  if (!leftCol || !rightCol) return;

  // Left column content
  const teaser = leftCol.querySelector('.teasers__teaser') || leftCol;
  const heading = teaser.querySelector('h2');
  const paragraphs = Array.from(teaser.querySelectorAll('p')).filter(p => p.textContent.trim() && p.textContent.trim() !== '\u00A0');
  const cta = teaser.querySelector('a.cta-btn');
  const leftCell = [];
  if (heading) leftCell.push(heading);
  if (paragraphs.length) leftCell.push(...paragraphs);
  if (cta) leftCell.push(cta);

  // Right column content
  const img = rightCol.querySelector('img');
  const rightCell = [];
  if (img) rightCell.push(img);

  // Build table
  const headerRow = ['Columns (columns29)'];
  const contentRow = [leftCell, rightCell];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
