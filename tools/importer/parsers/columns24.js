/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name header row
  const headerRow = ['Columns (columns24)'];

  // Defensive: get the main row containing columns
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Get all immediate column divs
  const columns = Array.from(mainRow.children).filter(
    (col) => col.classList.contains('col-xs-12')
  );

  // Each column's content will be grouped into a cell
  // This ensures resilience to variations in paragraph count
  const contentRow = columns.map((col) => {
    // Gather all child nodes (paragraphs, links, etc.)
    // Only include elements (not stray text nodes)
    return Array.from(col.childNodes).filter(
      (node) => node.nodeType === 1 // ELEMENT_NODE
    );
  });

  // Build the table rows
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
