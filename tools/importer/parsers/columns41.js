/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the visible heading (not hidden)
  let heading = null;
  const h2s = Array.from(element.querySelectorAll('h2'));
  heading = h2s.find(h => h.offsetParent !== null) || h2s[0];

  // 2. Find the row containing the columns
  const row = element.querySelector('.row.teasers');
  let columns = [];
  if (row) {
    // Find all direct .col-xs-12.col-sm-4 children (should be 3)
    columns = Array.from(row.querySelectorAll(':scope > .col-xs-12.col-sm-4'));
    // Fallback: if not found, try .teasers__teaser direct children
    if (columns.length !== 3) {
      columns = Array.from(row.querySelectorAll('.teasers__teaser'));
    }
  }
  // Defensive fallback: if not found, try global search
  if (columns.length !== 3) {
    columns = Array.from(element.querySelectorAll('.col-xs-12.col-sm-4, .teasers__teaser'));
  }
  // If still not 3, just take the first 3 found
  if (columns.length > 3) columns = columns.slice(0, 3);

  // 3. Build the table
  const headerRow = ['Columns (columns41)'];
  const contentRow = columns.map(col => col);
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Insert heading above the table if present
  if (heading && heading.textContent.trim()) {
    const headingEl = document.createElement('p');
    headingEl.textContent = heading.textContent.trim();
    element.parentNode.insertBefore(headingEl, element);
  }

  // 4. Replace the original element
  element.replaceWith(table);
}
