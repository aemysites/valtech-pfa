/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract columns from a cal-row
  function extractColumns(row) {
    // Get direct children columns
    const columns = Array.from(row.querySelectorAll(':scope > .cal-column'));
    return columns.map(col => {
      // For each column, return its content as an array of child elements
      // Only include element nodes, not text nodes
      const children = Array.from(col.childNodes).filter(n => n.nodeType === 1);
      // If the column contains only one child, return that element
      // Otherwise, wrap all children in a div to preserve structure
      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        return wrapper;
      } else {
        // If no element children, check for text content
        const text = col.textContent.trim();
        return text ? document.createTextNode(text) : '';
      }
    });
  }

  // Find all rows (each row is a horizontal section)
  const rows = Array.from(element.querySelectorAll(':scope mat-card mat-card-content > .cal-row'));

  // Build the table rows
  const tableRows = [];
  // Header row
  tableRows.push(['Columns (columns26)']);

  // For each row, extract columns
  rows.forEach(row => {
    const cols = extractColumns(row);
    tableRows.push(cols);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
