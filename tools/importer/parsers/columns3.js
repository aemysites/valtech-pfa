/* global WebImporter */
export default function parse(element, { document }) {
  // Extract direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Block header row (must match exactly)
  const headerRow = ['Columns (columns3)'];

  // For each column, extract its main content for the cell
  const contentRow = columns.map((col) => {
    // Find all direct .teasers__teaser children
    const teasers = Array.from(col.querySelectorAll(':scope > .teasers__teaser'));
    if (teasers.length === 1) {
      // Reference the actual element (do not clone)
      return teasers[0];
    } else if (teasers.length > 1) {
      // Wrap multiple teasers in a fragment
      const wrapper = document.createElement('div');
      teasers.forEach((t) => wrapper.appendChild(t));
      return wrapper;
    } else {
      // If no teaser, include all direct children (preserve semantic meaning)
      const wrapper = document.createElement('div');
      Array.from(col.childNodes).forEach((node) => wrapper.appendChild(node));
      return wrapper;
    }
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
