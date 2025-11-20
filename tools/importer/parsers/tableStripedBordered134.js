/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main table (hide-in-print preferred, fallback to show-in-print)
  function getMainTable(el) {
    let table = el.querySelector('.table.hide-in-print');
    if (!table) {
      table = el.querySelector('.table.show-in-print');
    }
    return table;
  }

  // Find the main content container
  const container = element.querySelector('.container-fluid') || element;

  // Extract heading and intro paragraphs (to be placed before the table)
  let heading = container.querySelector('h2:not([style*="display:none"])');
  if (!heading) {
    heading = container.querySelector('h2');
  }
  const introParagraphs = [];
  for (const child of container.children) {
    if (child.querySelector && child.querySelector('table')) {
      break;
    }
    if (child.tagName === 'P') {
      introParagraphs.push(child.cloneNode(true));
    }
  }

  // Get the main table
  const table = getMainTable(container);
  if (!table) return;

  // Determine the column count from the table's widest row
  let maxCols = 0;
  Array.from(table.querySelectorAll('tbody > tr')).forEach(tr => {
    let cols = 0;
    Array.from(tr.children).forEach(td => {
      cols += parseInt(td.getAttribute('colspan') || '1', 10);
    });
    if (cols > maxCols) maxCols = cols;
  });
  if (maxCols < 1) maxCols = 1;

  // Compose the block table rows
  const rows = [];
  // Header row: block name
  rows.push(['Table (striped, bordered, tableStripedBordered134)']);

  // Extract table rows and cells, preserving colspans and full HTML content for each cell
  Array.from(table.querySelectorAll('tbody > tr')).forEach(tr => {
    const cells = [];
    Array.from(tr.children).forEach(td => {
      const colspan = parseInt(td.getAttribute('colspan') || '1', 10);
      const cellDiv = document.createElement('div');
      Array.from(td.childNodes).forEach(node => {
        cellDiv.appendChild(node.cloneNode(true));
      });
      if (colspan > 1) {
        // Only one cell for the row, pad with empty cells to maxCols
        cells.push(cellDiv);
        while (cells.length < maxCols) {
          cells.push('');
        }
      } else {
        cells.push(cellDiv);
      }
    });
    // Pad row to maxCols if not already
    while (cells.length < maxCols) {
      cells.push('');
    }
    rows.push(cells);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Insert heading and intro paragraphs before the table (outside the block table)
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    element.parentNode.insertBefore(h2, element);
  }
  introParagraphs.forEach(p => {
    element.parentNode.insertBefore(p, element);
  });

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
