/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Columns (columns4)'];

  // Find the main row that contains the columns
  let columnsRow = null;
  const teasersRow = element.querySelector('.row.teasers');
  if (teasersRow) {
    columnsRow = teasersRow.querySelector('.row') || teasersRow;
  } else {
    columnsRow = element.querySelector('.row') || element;
  }

  // Find the two main column divs
  const colDivs = Array.from(columnsRow.querySelectorAll(':scope > .col-xs-12, :scope > .col-sm-3, :scope > .col-sm-9'));
  // Fallback if not found
  const columns = colDivs.length === 2 ? colDivs : Array.from(columnsRow.children).slice(0,2);

  // First column: image only
  const leftCol = columns[0];
  let leftCell = leftCol.querySelector('img');
  if (leftCell) leftCell = leftCell.cloneNode(true);
  else leftCell = document.createTextNode('');

  // Second column: heading and paragraphs
  const rightCol = columns[1];
  const nodes = [];
  const heading = rightCol.querySelector('h2');
  if (heading) nodes.push(heading.cloneNode(true));
  // Add all <p> elements
  rightCol.querySelectorAll('p').forEach(p => nodes.push(p.cloneNode(true)));
  // If no heading or paragraphs, fallback to all text
  if (nodes.length === 0) {
    nodes.push(document.createTextNode(rightCol.textContent.trim()));
  }
  const rightCell = nodes.length === 1 ? nodes[0] : nodes;

  // Build table rows
  const rows = [headerRow, [leftCell, rightCell]];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
