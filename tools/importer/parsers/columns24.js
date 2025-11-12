/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns24)'];

  // Find the columns in the source HTML
  const rowDiv = element.querySelector('.row');
  let columns = [];
  if (rowDiv) {
    columns = Array.from(rowDiv.children).filter(col => col.classList.contains('col-xs-12'));
  }

  // Defensive fallback: if not found, treat the whole element as a single column
  if (columns.length === 0) {
    columns = [element];
  }

  // For each column, collect its content as an array of child nodes (preserving paragraphs and links)
  const contentRow = columns.map(col => {
    // Collect all children except for empty <br> or whitespace
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // If only one node, return it directly, else return array
    return nodes.length === 1 ? nodes[0] : nodes;
  });

  // Build the table: header row, then one row with N columns
  const tableCells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
