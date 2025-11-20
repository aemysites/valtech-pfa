/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  let mainContentDiv = element.querySelector('.col-sm-12');
  if (!mainContentDiv) return;

  // Find the first visible table (striped)
  const table = mainContentDiv.querySelector('table.show-in-print') || mainContentDiv.querySelector('table');

  // Compose rows for the block table
  const rows = [];
  // Block header row (must match block name exactly)
  rows.push(['Table (striped, tableStriped66)']);

  // Extract table header and rows
  if (table) {
    const ths = Array.from(table.querySelectorAll('thead tr th'));
    const headerCells = ths.map(th => th.textContent.trim());
    if (headerCells.length) rows.push(headerCells);
    const trs = Array.from(table.querySelectorAll('tbody tr'));
    trs.forEach(tr => {
      const tds = Array.from(tr.querySelectorAll('td'));
      rows.push(tds.map(td => td.textContent.trim()));
    });
  }

  // Create the block table element
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Insert all content before the first table, then the table, then all content after the first table
  const fragment = document.createDocumentFragment();
  let tableFound = false;
  Array.from(mainContentDiv.childNodes).forEach(node => {
    // Only inject the block table for the first table occurrence
    if (!tableFound && node.nodeType === 1 && node.tagName === 'TABLE') {
      fragment.appendChild(blockTable);
      tableFound = true;
      return;
    }
    // If it's a table wrapper div containing the table, inject block table and skip its content
    if (!tableFound && node.nodeType === 1 && node.tagName === 'DIV' && node.querySelector('table')) {
      fragment.appendChild(blockTable);
      tableFound = true;
      return;
    }
    // Otherwise, clone and append the node
    if (node.nodeType === 3) {
      if (node.textContent.trim()) fragment.appendChild(document.createTextNode(node.textContent));
    } else if (node.nodeType === 1) {
      // Skip duplicate tables
      if (node.tagName === 'TABLE' || (node.tagName === 'DIV' && node.querySelector('table'))) return;
      fragment.appendChild(node.cloneNode(true));
    }
  });

  element.replaceWith(fragment);
}
