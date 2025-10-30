/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns4)'];

  // Defensive: Get all immediate column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column's content will be extracted as a cell
  const contentRow = columns.map((col) => {
    // Defensive: Find the main teaser in each column
    // Some columns have nested .teasers__teaser blocks, so we want the whole column content
    // We'll collect all direct children of the column
    const colContent = Array.from(col.childNodes).filter((node) => {
      // Only include element nodes and non-empty text nodes
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
    // Wrap in a div for structure preservation
    const wrapper = document.createElement('div');
    colContent.forEach((node) => wrapper.appendChild(node));
    return wrapper;
  });

  // Compose the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
