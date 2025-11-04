/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns: .row > .col-xs-12
  const columns = Array.from(element.querySelectorAll(':scope > .row > .col-xs-12'));
  if (columns.length === 0) {
    columns.push(...element.querySelectorAll(':scope > .col-xs-12'));
  }

  // For each column, collect all .teasers__teaser blocks (each is a full accordion group)
  const columnTeasers = columns.map(colEl => {
    // Only direct children .teasers__teaser
    return Array.from(colEl.querySelectorAll(':scope > .teasers__teaser'));
  });

  // Build rows: each row contains one teaser from each column (or empty string)
  // Only include rows where at least one column has a teaser
  const rows = [];
  const leftTeasers = columnTeasers[0] || [];
  const rightTeasers = columnTeasers[1] || [];
  const leftCount = leftTeasers.length;
  const rightCount = rightTeasers.length;
  const maxRows = Math.max(leftCount, rightCount);

  for (let i = 0; i < maxRows; i++) {
    const leftCell = leftTeasers[i] ? leftTeasers[i].cloneNode(true) : '';
    const rightCell = rightTeasers[i] ? rightTeasers[i].cloneNode(true) : '';
    // Only push row if at least one cell is not empty
    if (leftCell || rightCell) {
      rows.push([leftCell, rightCell]);
    }
  }

  // Compose table data
  const headerRow = ['Columns (columns9)'];
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
