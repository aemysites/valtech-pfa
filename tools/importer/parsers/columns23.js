/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Columns (columns23)'];

  // Get the two column elements (they are direct children of the main .row container)
  const columns = Array.from(element.querySelectorAll(':scope > .col'));
  const cols = columns.length === 2 ? columns : Array.from(element.children);

  // For each column, extract heading and rows
  const headings = cols.map(col => col.querySelector('h4'));
  const rowsPerCol = cols.map(col => Array.from(col.querySelectorAll(':scope > .row')));

  // Build rows: each row contains two cells (one per column)
  // First row: headings
  const headingRow = headings.map(h => h ? h.cloneNode(true) : '');

  // Next rows: for each row index (0..2), build a row with two cells
  const rowCount = Math.max(rowsPerCol[0].length, rowsPerCol[1].length);
  const contentRows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowCells = [];
    for (let c = 0; c < 2; c++) {
      const row = rowsPerCol[c][i];
      if (row) {
        // Icon (img)
        const icon = row.querySelector('img');
        // Text (the .col-xs-10, which contains a <p>)
        const textCol = row.querySelector('.col-xs-10');
        let cellDiv = document.createElement('div');
        if (icon) cellDiv.appendChild(icon.cloneNode(true));
        if (textCol) {
          Array.from(textCol.childNodes).forEach(n => cellDiv.appendChild(n.cloneNode(true)));
        }
        rowCells.push(cellDiv);
      } else {
        rowCells.push(''); // empty cell if missing
      }
    }
    contentRows.push(rowCells);
  }

  // Build the table rows
  const cells = [
    headerRow,
    headingRow,
    ...contentRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
