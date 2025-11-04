/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Columns (columns4)'];

  // Defensive: Get all immediate column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // If no columns found, fallback to direct children
  const colCount = columns.length || 4;

  // Each column's content will be a cell in the second row
  const cells = [];
  for (let i = 0; i < colCount; i++) {
    let col = columns[i];
    if (!col) {
      // Defensive: create empty cell if missing
      cells.push(document.createElement('div'));
      continue;
    }
    // Gather all direct children as a fragment for the cell
    const colContent = Array.from(col.childNodes);
    // Wrap all content in a div for resilience
    const wrapper = document.createElement('div');
    colContent.forEach((node) => wrapper.appendChild(node));
    cells.push(wrapper);
  }

  // Build the table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
