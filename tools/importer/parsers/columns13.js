/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns13)'];

  // Find the main container that holds the four columns
  const container = element.querySelector('.container-fluid');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;

  // Get all direct column divs inside the row
  // For this layout, columns are either .col-md-4 or .col-md-3
  // The three link columns are inside a nested row
  let colDivs = [];
  const leftCol = row.querySelector('.col-md-9');
  if (leftCol) {
    const innerRow = leftCol.querySelector('.row');
    if (innerRow) {
      colDivs = Array.from(innerRow.children).filter(col => col.classList.contains('col-md-4'));
    }
  }
  // The rightmost column is .col-md-3
  const rightCol = row.querySelector('.col-md-3');
  if (rightCol) {
    colDivs.push(rightCol);
  }

  // Defensive: If we don't get 4 columns, fallback to direct children
  if (colDivs.length !== 4) {
    colDivs = Array.from(row.children);
  }

  // Compose the content row for the table
  const contentRow = colDivs.map((col, idx) => {
    if (!col) return document.createElement('div'); // empty cell fallback
    // First three columns: heading + list
    if (idx < 3) {
      const heading = col.querySelector('.footer__heading');
      const list = col.querySelector('ul.footer__list');
      const frag = document.createDocumentFragment();
      if (heading) frag.appendChild(heading);
      if (list) frag.appendChild(list);
      return frag.childNodes.length ? frag : document.createElement('div');
    }
    // Last column: heading, address, social links
    const heading = col.querySelector('.footer__heading');
    const address = col.querySelector('address');
    const social = col.querySelector('dl.share');
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    if (address) frag.appendChild(address);
    if (social) frag.appendChild(social);
    return frag.childNodes.length ? frag : document.createElement('div');
  });

  // Build the table rows
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
