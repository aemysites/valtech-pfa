/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row must match target block name exactly
  const headerRow = ['Columns (columns38)'];

  // Find all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract heading, paragraphs, and preserve link list structure
  const cells = columns.map(col => {
    const teaser = col.querySelector(':scope > div');
    const source = teaser || col;
    const container = document.createElement('div');

    // Heading
    const heading = source.querySelector('h3');
    if (heading) container.appendChild(heading.cloneNode(true));

    // All non-empty paragraphs
    source.querySelectorAll('p').forEach(p => {
      if (p.textContent.trim().replace(/\u00a0/g, '').length > 0) {
        container.appendChild(p.cloneNode(true));
      }
    });

    // Preserve link list structure if present
    const linkList = source.querySelector('ul.panel__links');
    if (linkList) {
      container.appendChild(linkList.cloneNode(true));
    }

    return container;
  });

  // Table: header row, then one row with all columns as cells
  const rows = [
    headerRow,
    cells
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
