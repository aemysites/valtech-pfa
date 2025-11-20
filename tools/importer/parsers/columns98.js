/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns98)'];

  // Defensive: get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect its content as a single cell
  const contentRow = columns.map((col) => {
    // Gather all children: image, heading, paragraph (and any others)
    const children = [];
    Array.from(col.childNodes).forEach((child) => {
      // Ignore empty text nodes
      if (child.nodeType === 3 && !child.textContent.trim()) return;
      // If child is &nbsp; text node, skip
      if (child.nodeType === 3 && child.textContent.trim() === '\u00A0') return;
      // Otherwise, include element or text node
      children.push(child);
    });
    // Return all children as a cell (array of elements)
    return children;
  });

  // Build the table: header + content row
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
