/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children columns
  function getColumns(rowEl) {
    // Only direct children with col- classes
    return Array.from(rowEl.querySelectorAll(':scope > .col-xs-12, :scope > .col-sm-2, :scope > .col-sm-4, :scope > .col-sm-10'));
  }

  // Find the deepest .row that contains columns
  let rowWithColumns = null;
  const rows = element.querySelectorAll('.row');
  for (const row of rows) {
    const cols = getColumns(row);
    if (cols.length > 0) {
      rowWithColumns = row;
      break;
    }
  }
  if (!rowWithColumns) return;

  // Get columns for this block
  const columns = getColumns(rowWithColumns);
  if (columns.length === 0) return;

  // Build the header row
  const headerRow = ['Columns (columns17)'];

  // If there is a visually hidden <h2> before the columns, include it in the first column
  let hiddenHeading = null;
  const hiddenH2 = element.querySelector('h2.teasers__heading[style*="display:none"]');
  if (hiddenH2) {
    hiddenHeading = hiddenH2.cloneNode(true);
  }

  // Build the content row(s)
  const contentRow = columns.map((col, idx) => {
    // Gather all visible, non-empty content
    const nodes = Array.from(col.childNodes).filter((node) => {
      if (node.nodeType === 3) return node.textContent.trim() !== '';
      if (node.nodeType === 1) {
        // Remove empty paragraphs/divs/spans unless they contain images
        if (["P", "DIV", "SPAN"].includes(node.tagName)) {
          return node.textContent.trim() !== '' || node.querySelector('img');
        }
        return true;
      }
      return false;
    });
    // If column is just an image in a paragraph/div, return the image
    if (nodes.length === 1 && ['P', 'DIV'].includes(nodes[0].tagName) && nodes[0].querySelector('img')) {
      return nodes[0].querySelector('img');
    }
    // If column is just an image, return the image
    if (nodes.length === 1 && nodes[0].tagName === 'IMG') {
      return nodes[0];
    }
    // If this is the first column and there is a hidden heading, prepend it
    if (idx === 0 && hiddenHeading) {
      return [hiddenHeading, ...nodes];
    }
    // Otherwise, return all nodes as array
    return nodes;
  });

  // Compose table rows
  const tableRows = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
