/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns3)'];

  // Find immediate child columns (ignore nested rows)
  const columns = Array.from(element.children).filter(
    (col) => col.classList.contains('col-xs-12') || col.classList.contains('col-sm-6')
  );

  // Defensive: fallback to single cell if not a multi-column row
  if (columns.length < 2) {
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      [element]
    ], document);
    element.replaceWith(block);
    return;
  }

  // For each column, gather all content (including images and text)
  const contentRow = columns.map(col => {
    // Create a wrapper div to preserve all content
    const wrapper = document.createElement('div');
    Array.from(col.childNodes).forEach(node => {
      wrapper.appendChild(node.cloneNode(true));
    });
    return wrapper;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
