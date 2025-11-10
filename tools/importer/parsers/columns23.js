/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a column's heading and its rows
  function extractColumnRows(colElem) {
    const heading = colElem.querySelector('h4');
    const rows = Array.from(colElem.querySelectorAll(':scope > .row'));
    // Each row: icon + text
    const rowCells = rows.map(row => {
      const icon = row.querySelector('.col-xs-2 img');
      const textCol = row.querySelector('.col-xs-10');
      const cellDiv = document.createElement('div');
      if (icon) cellDiv.append(icon);
      if (textCol) {
        Array.from(textCol.childNodes).forEach(node => {
          if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
            cellDiv.append(node);
          }
        });
      }
      return cellDiv;
    });
    return { heading, rowCells };
  }

  // Get columns (should be two)
  const columns = element.querySelectorAll(':scope > .col');
  const cells = [];
  // Header row
  cells.push(['Columns (columns23)']);
  if (columns.length === 2) {
    const left = extractColumnRows(columns[0]);
    const right = extractColumnRows(columns[1]);
    // First row: headings
    cells.push([
      left.heading ? left.heading : '',
      right.heading ? right.heading : ''
    ]);
    // For each row, add a row with two columns
    const rowCount = Math.max(left.rowCells.length, right.rowCells.length);
    for (let i = 0; i < rowCount; i++) {
      cells.push([
        left.rowCells[i] || '',
        right.rowCells[i] || ''
      ]);
    }
  } else {
    // Fallback: all content in one cell
    const div = document.createElement('div');
    Array.from(element.children).forEach(child => div.append(child));
    cells.push([div]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
