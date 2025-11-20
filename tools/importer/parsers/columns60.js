/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the header row for Columns (columns60)
  const headerRow = ['Columns (columns60)'];

  // Defensive: Find all immediate child columns (should be two)
  const columns = Array.from(element.querySelectorAll(':scope > .col-xs-12.col-sm-6'));

  // If not found, fallback to direct children with .teasers__teaser
  if (columns.length === 0) {
    // Sometimes the .col-xs-12.col-sm-6 might be missing, fallback to teasers
    const teasers = Array.from(element.querySelectorAll(':scope > .teasers__teaser'));
    if (teasers.length) {
      columns.push(...teasers);
    } else {
      // Fallback: treat the whole element as one column
      columns.push(element);
    }
  }

  // For each column, extract the table (header and rows)
  function extractTableContent(col) {
    // Find the table inside this column
    const table = col.querySelector('table');
    if (!table) return col; // fallback: return the whole column

    // Extract the header (th)
    const th = table.querySelector('thead th');
    const headerDiv = document.createElement('div');
    if (th) {
      headerDiv.textContent = th.textContent.trim();
      headerDiv.style.fontWeight = 'bold';
      headerDiv.style.marginBottom = '8px';
    }

    // Extract the rows (td)
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const rowDivs = rows.map((tr) => {
      const td = tr.querySelector('td');
      if (!td) return null;
      const div = document.createElement('div');
      div.textContent = td.textContent.trim();
      div.style.marginBottom = '4px';
      return div;
    }).filter(Boolean);

    // Compose column content
    const colContent = document.createElement('div');
    colContent.appendChild(headerDiv);
    rowDivs.forEach(div => colContent.appendChild(div));
    return colContent;
  }

  // Build the columns row (second row of table)
  const columnsRow = columns.map(extractTableContent);

  // Compose the table rows
  const cells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
