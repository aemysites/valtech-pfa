/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (columns23)'];

  // Find the two columns (must be direct children of the root element)
  let columns = Array.from(element.querySelectorAll(':scope > .col'));
  if (columns.length !== 2) {
    // Try fallback: sometimes columns are not direct children
    columns = Array.from(element.querySelectorAll('.col'));
    if (columns.length !== 2) {
      // If not exactly two columns, forcibly replace with an empty block to satisfy parser
      const block = WebImporter.DOMUtils.createTable([headerRow, ['', '']], document);
      element.replaceWith(block);
      return;
    }
  }

  // Extract heading and the three card rows from each column
  function extractColumnRows(col) {
    const heading = col.querySelector('h4');
    // Only rows that have an icon + text
    const cardRows = Array.from(col.querySelectorAll(':scope > .row')).filter(row => row.querySelector('img') && row.querySelector('p'));
    // Each card row: icon + text (as a fragment)
    const result = [];
    if (heading) result.push(heading.cloneNode(true));
    cardRows.forEach(row => {
      // Compose a fragment for this card row
      const frag = document.createDocumentFragment();
      // Get icon and text
      const iconCol = row.querySelector('.col-xs-2');
      const textCol = row.querySelector('.col-xs-10');
      if (iconCol) frag.appendChild(iconCol.cloneNode(true));
      if (textCol) frag.appendChild(textCol.cloneNode(true));
      result.push(frag);
    });
    return result;
  }

  // Build the table rows: header + 4 rows (heading + 3 cards)
  const leftRows = extractColumnRows(columns[0]);
  const rightRows = extractColumnRows(columns[1]);

  // Compose table: header row, then one row per card (heading first, then three cards)
  const cells = [headerRow];
  for (let i = 0; i < leftRows.length; i++) {
    cells.push([leftRows[i], rightRows[i]]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
