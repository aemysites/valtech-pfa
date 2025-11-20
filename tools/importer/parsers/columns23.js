/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns23)'];

  // Get the two main column divs
  const columns = Array.from(element.querySelectorAll(':scope > div.col'));
  if (columns.length < 2) return;

  // Helper to extract heading and rows for a column
  function extractColumnParts(colDiv) {
    const heading = colDiv.querySelector('h4')?.cloneNode(true) || '';
    const rows = Array.from(colDiv.querySelectorAll(':scope > .row')).filter(row => row.querySelector('img')).map(row => {
      const iconImg = row.querySelector('.col-xs-2 img');
      const textDiv = row.querySelector('.col-xs-10');
      const rowFrag = document.createElement('div');
      rowFrag.style.display = 'flex';
      rowFrag.style.alignItems = 'flex-start';
      if (iconImg) rowFrag.appendChild(iconImg.cloneNode(true));
      if (textDiv) {
        const p = textDiv.querySelector('p');
        if (p) {
          rowFrag.appendChild(p.cloneNode(true));
        } else {
          Array.from(textDiv.childNodes).forEach(child => {
            rowFrag.appendChild(child.cloneNode(true));
          });
        }
      }
      return rowFrag;
    });
    return { heading, rows };
  }

  // Extract both columns
  const left = extractColumnParts(columns[0]);
  const right = extractColumnParts(columns[1]);

  // Compose the table rows
  const rows = [headerRow];
  // First row after header: headings
  rows.push([left.heading, right.heading]);
  // Next rows: each row from both columns side-by-side
  for (let i = 0; i < Math.max(left.rows.length, right.rows.length); i++) {
    rows.push([
      left.rows[i] || '',
      right.rows[i] || ''
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
