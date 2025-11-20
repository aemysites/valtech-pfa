/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first visible heading and intro paragraph
  const heading = Array.from(element.querySelectorAll('h2')).find(h => h.offsetParent !== null && h.textContent.trim().length > 0);
  const intro = Array.from(element.querySelectorAll('p')).find(p => p.textContent.trim().length > 0);

  // Find all tables (not just the first)
  const tables = Array.from(element.querySelectorAll('table'));
  if (tables.length === 0) return;

  // Prepare rows for the block table
  const rows = [];
  // Header row: block name only
  rows.push(['Table (bordered, tableBordered78)']);

  // Use the first table for tabular data (deduplicate visually identical tables)
  const table = tables[0];
  // Extract table header labels
  const ths = Array.from(table.querySelectorAll('thead th'));
  const headerLabels = ths.map(th => th.textContent.trim());
  rows.push(headerLabels);

  // Extract table body rows
  const trs = Array.from(table.querySelectorAll('tbody tr'));
  trs.forEach(tr => {
    const tds = Array.from(tr.querySelectorAll('td'));
    const row = tds.map((td, idx) => {
      if (idx === 2) {
        const a = td.querySelector('a');
        if (a) {
          const link = a.cloneNode(true);
          return link;
        }
        return td.textContent.trim();
      }
      // For other columns, preserve all text and line breaks
      const span = document.createElement('span');
      span.innerHTML = td.innerHTML.trim();
      return span;
    });
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert heading and intro before the table if found (not inside the table)
  const parent = element.parentNode;
  if (parent) {
    if (heading) parent.insertBefore(heading, element);
    if (intro) parent.insertBefore(intro, element);
  }

  // Replace the original element
  element.replaceWith(block);
}
